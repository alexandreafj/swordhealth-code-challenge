const amqplib = require("amqplib");

class Rabbitmq {
  constructor() {
    this.amqpUrl = process.env.AMQP_URL || "amqp://localhost:5673";
    this.queue = process.env.AMQP_QUEUE;
  }
  sendNotification = async ({ message }) => {
    let connection;
    let channel;
    try {
      connection = await amqplib.connect(this.amqpUrl, "heartbeat=60");
      channel = await connection.createChannel();
      const exchange = "manager.task";
      const routingKey = "taks_perfomed";

      await channel.assertExchange(exchange, "direct", { durable: true });
      await channel.assertQueue(this.queue, { durable: true });
      await channel.bindQueue(this.queue, exchange, routingKey);

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
}
module.exports = { Rabbitmq };
