const amqp = require("amqplib");

let connection;
let channel;

const connectRabbitMQ = async () => {
    connection = await amqp.connect(process.env.RABBITMQ_URI);

    channel = await connection.createChannel();

    console.log("RabbitMQ Connected");
};

const getChannel = () => {
    if (!channel) {
        throw new Error("RabbitMQ channel not initialized");
    }

    return channel;
};

const assertQueue = async (queueName) => {
    await channel.assertQueue(queueName, {
        durable: true
    });
};

module.exports = {
    connectRabbitMQ,
    getChannel,
    assertQueue
};