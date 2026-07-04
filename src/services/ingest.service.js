const WebhookEvent = require("../models/webhookEvent.model");
const Transaction = require("../models/transaction.model");
const { getChannel, assertQueue } = require("../config/rabbitmq");
const { ENRICHMENT_QUEUE } = require("../queues/queues");
const logger = require("../utils/logger");

const BATCH_SIZE = 500;

const processWebhookEvent = async (webhookEventId) => {

    const webhookEvent = await WebhookEvent.findById(webhookEventId);

    if (!webhookEvent) {
        throw new Error("Webhook event not found");
    }

    webhookEvent.status = "PROCESSING";
    await webhookEvent.save();

    const transactions = webhookEvent.payload.transactions || [];

    logger.info(
        `Processing webhook ${webhookEvent.eventId} with ${transactions.length} transactions`
    );

    if (transactions.length === 0) {

        webhookEvent.status = "COMPLETED";

        await webhookEvent.save();

        return;
    }

    const bulkOperations = transactions.map((transaction) => ({
        updateOne: {
            filter: {
                transactionId: transaction.transactionId
            },
            update: {
                $set: {
                    transactionId: transaction.transactionId,
                    webhookEventId: webhookEvent._id,
                    accountId: webhookEvent.accountId,
                    amount: transaction.amount,
                    type: transaction.type,
                    timestamp: transaction.timestamp
                }
            },
            upsert: true
        }
    }));

    for (let i = 0; i < bulkOperations.length; i += BATCH_SIZE) {

        const batch = bulkOperations.slice(i, i + BATCH_SIZE);

        await Transaction.bulkWrite(batch, {
            ordered: false
        });

        logger.info(
            `Processed batch ${Math.floor(i / BATCH_SIZE) + 1}`
        );
    }

    const channel = getChannel();

    await assertQueue(ENRICHMENT_QUEUE);

    channel.sendToQueue(
        ENRICHMENT_QUEUE,
        Buffer.from(
            JSON.stringify({
                webhookEventId: webhookEvent._id.toString()
            })
        ),
        {
            persistent: true
        }
    );

    webhookEvent.status = "COMPLETED";

    await webhookEvent.save();

    logger.info(
        `Webhook ${webhookEvent.eventId} completed`
    );
};

module.exports = {
    processWebhookEvent
};