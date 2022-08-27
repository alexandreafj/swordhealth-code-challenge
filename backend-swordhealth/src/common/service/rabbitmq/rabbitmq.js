const amqplib = require("amqplib");
const amqpUrl = process.env.AMQP_URL || "amqp://localhost:5673";

const sendNotification = async ({ message }) => {
  let connection;
  let channel;
  try {
    connection = await amqplib.connect(amqpUrl, "heartbeat=60");
    channel = await connection.createChannel();
    const exchange = "manager.task";
    const queue = process.env.AMQP_QUEUE;
    const routingKey = "taks_perfomed";

    await channel.assertExchange(exchange, "direct", { durable: true });
    await channel.assertQueue(queue, { durable: true });
    await channel.bindQueue(queue, exchange, routingKey);

    await channel.publish(
      exchange,
      routingKey,
      Buffer.from(JSON.stringify(message))
    );
  } catch (e) {
    console.error("Error in publishing message", e);
  } finally {
    if (channel && connection) {
      await channel.close();
      await connection.close();
    }
  }
};
module.exports = { rabbitmq: { sendNotification } };
