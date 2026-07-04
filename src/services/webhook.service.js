const WebhookEvent = require("../models/webhookEvent.model");
const { generateEventHash } = require("../utils/hash");
const { getChannel, assertQueue } = require("../config/rabbitmq");
const { INGEST_QUEUE } = require("../queues/queues");

const processWebhook = async (payload) => {

    const eventHash = generateEventHash({
        eventId: payload.eventId,
        accountId: payload.accountId,
        payload
    });

    const existingEvent = await WebhookEvent.findOne({
        eventHash
    });

    if (existingEvent) {
        return {
            duplicate: true
        };
    }

    const webhookEvent = await WebhookEvent.create({
        eventHash,
        eventId: payload.eventId,
        accountId: payload.accountId,
        payload
    });

    const channel = getChannel();

    await assertQueue(INGEST_QUEUE);

    channel.sendToQueue(
        INGEST_QUEUE,
        Buffer.from(
            JSON.stringify({
                webhookEventId: webhookEvent._id
            })
        ),
        {
            persistent: true
        }
    );

    return {
        duplicate: false,
        webhookEvent
    };
};

module.exports = {
    processWebhook
};