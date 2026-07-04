const Transaction = require("../models/transaction.model");

const {
    fetchTransactionMetadata
} = require("./external-api.service");

const retry = require("../utils/retry");

const {
    getChannel,
    assertQueue
} = require("../config/rabbitmq");

const {
    LEDGER_QUEUE
} = require("../queues/queues");

const logger = require("../utils/logger");

const enrichTransactions = async (webhookEventId) => {

    const transactions = await Transaction.find({
        webhookEventId,
        enriched: false
    });

    logger.info(
        `Found ${transactions.length} transaction(s) for enrichment`
    );

    if (!transactions.length) {
        logger.info("No transactions to enrich");
        return;
    }

    for (const transaction of transactions) {

        const metadata = await retry(() =>
            fetchTransactionMetadata(transaction.transactionId)
        );

        transaction.metadata = metadata;
        transaction.enriched = true;

        await transaction.save();
    }

    const channel = getChannel();

    await assertQueue(LEDGER_QUEUE);

    channel.sendToQueue(
        LEDGER_QUEUE,
        Buffer.from(
            JSON.stringify({
                webhookEventId
            })
        ),
        {
            persistent: true
        }
    );

    logger.info(
        `Published ledger job for webhook ${webhookEventId}`
    );
};

module.exports = {
    enrichTransactions
};