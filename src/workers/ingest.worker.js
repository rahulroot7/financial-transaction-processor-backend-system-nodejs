require("dotenv").config();

const connectDB = require("../config/db");

const {
    connectRabbitMQ,
    getChannel,
    assertQueue
} = require("../config/rabbitmq");

const { INGEST_QUEUE } = require("../queues/queues");

const ingestService = require("../services/ingest.service");

const logger = require("../utils/logger");

const startWorker = async () => {

    await connectDB();

    await connectRabbitMQ();

    const channel = getChannel();

    await assertQueue(INGEST_QUEUE);

    logger.info("Ingest Worker Started");

    channel.consume(INGEST_QUEUE, async (message) => {

        if (!message) {
            return;
        }

        try {

            const payload = JSON.parse(
                message.content.toString()
            );

            logger.info(
                `Received message ${payload.webhookEventId}`
            );

            await ingestService.processWebhookEvent(
                payload.webhookEventId
            );

            channel.ack(message);

            logger.info("Message acknowledged");

        } catch (error) {

            logger.error(error);

            channel.nack(message, false, false);
        }

    });

};

startWorker();