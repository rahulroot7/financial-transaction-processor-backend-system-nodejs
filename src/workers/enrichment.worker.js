require("dotenv").config();

const connectDB = require("../config/db");

const {
    connectRabbitMQ,
    getChannel,
    assertQueue
} = require("../config/rabbitmq");

const {
    ENRICHMENT_QUEUE
} = require("../queues/queues");

const enrichmentService = require("../services/enrichment.service");

const logger = require("../utils/logger");

const startWorker = async () => {

    await connectDB();

    await connectRabbitMQ();

    const channel = getChannel();

    await assertQueue(ENRICHMENT_QUEUE);

    logger.info("Enrichment Worker Started");

    channel.consume(ENRICHMENT_QUEUE, async (message) => {

        if (!message) {
            return;
        }

        try {

            const payload = JSON.parse(
                message.content.toString()
            );

            await enrichmentService.enrichTransactions(
                payload.webhookEventId
            );

            channel.ack(message);

            logger.info("Enrichment message acknowledged");

        } catch (error) {

            logger.error(error);

            channel.nack(message, false, false);
        }

    });

};

startWorker();