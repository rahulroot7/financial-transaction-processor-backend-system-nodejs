require("dotenv").config();

const connectDB = require("../config/db");

const {
    connectRabbitMQ,
    getChannel,
    assertQueue
} = require("../config/rabbitmq");

const {
    LEDGER_QUEUE
} = require("../queues/queues");

const ledgerService = require("../services/ledger.service");

const logger = require("../utils/logger");

const startWorker = async () => {

    await connectDB();

    await connectRabbitMQ();

    const channel = getChannel();

    await assertQueue(LEDGER_QUEUE);

    logger.info("Ledger Worker Started");

    channel.consume(
        LEDGER_QUEUE,
        async (message) => {

            if (!message) {
                return;
            }

            try {

                const payload = JSON.parse(
                    message.content.toString()
                );

                await ledgerService.rebuildLedger(
                    payload.webhookEventId
                );

                channel.ack(message);

                logger.info("Ledger message acknowledged");

            } catch (error) {

                logger.error(error);

                channel.nack(message, false, false);
            }

        }
    );

};

startWorker();