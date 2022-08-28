const {
  service: { Rabbitmq },
} = require("../../common");
const amqp = require("amqplib");

describe("Rabbitmq", () => {
  let rabbitmq = null;
  beforeEach(() => {
    rabbitmq = new Rabbitmq();
  });
  it("should send notification", async () => {
    const channel = {
      assertExchange: jest.fn(),
      publish: jest.fn(),
      assertQueue: jest.fn(),
      bindQueue: jest.fn(),
      close: jest.fn(),
    };
    const connection = {
      createChannel: jest.fn().mockResolvedValueOnce(channel),
      close: jest.fn(),
    };
    const connectSpy = jest
      .spyOn(amqp, "connect")
      .mockResolvedValueOnce(connection);
    await rabbitmq.sendNotification({ message: "teste" });
    expect(connection.createChannel).toBeCalledTimes(1);
    expect(channel.assertExchange).toBeCalledTimes(1);
    expect(channel.publish).toBeCalledTimes(1);
    expect(connection.close).toBeCalledTimes(1);
    expect(connectSpy).toBeCalledTimes(1);
  });
});
