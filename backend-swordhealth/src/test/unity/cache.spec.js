const {
  service: { Cache },
} = require("../../common");
const redis = require("redis");

const mockMulti = {
  del: jest.fn(),
  exec: jest.fn(),
};

const mockRedisClient = {
  connect: jest.fn(),
  disconnect: jest.fn(),
  set: jest.fn().mockImplementation(() => "OK"),
  get: jest.fn().mockImplementation(() => JSON.stringify({ id: 0 })),
  keys: jest.fn().mockImplementation(() => ["key1", "key2", "key3"]),
  multi: jest.fn().mockImplementation(() => mockMulti),
};

describe("redis", () => {
  let cache = null;
  beforeEach(() => {
    cache = new Cache();
  });
  it("should create client", () => {
    const mockGetClient = jest
      .spyOn(redis, "createClient")
      .mockImplementation(() => mockRedisClient);
    const redisClient = cache.getClient();
    expect(mockGetClient).toBeCalledTimes(1);
    expect(redisClient).toBeDefined();
  });
  it("should set data on cache", async () => {
    const mockKey = "teste";
    const mockValue = "teste";
    const mockGetClient = jest
      .spyOn(cache, "getClient")
      .mockImplementation(() => mockRedisClient);
    const response = await cache.set({
      key: mockKey,
      value: mockValue,
      expireFormat: "h",
      expire: 1,
    });
    expect(mockGetClient).toBeCalledTimes(1);
    expect(mockRedisClient.connect).toBeCalledTimes(1);
    expect(mockRedisClient.disconnect).toBeCalledTimes(1);
    expect(mockRedisClient.set).toBeCalledTimes(1);
    expect(response).toBe("OK");
  });

  it("should get data on cache", async () => {
    const mockKey = "teste";
    const mockGetClient = jest
      .spyOn(cache, "getClient")
      .mockImplementation(() => mockRedisClient);
    const response = await cache.get({
      key: mockKey,
    });
    expect(mockGetClient).toBeCalledTimes(1);
    expect(mockRedisClient.connect).toBeCalledTimes(1);
    expect(mockRedisClient.disconnect).toBeCalledTimes(1);
    expect(mockRedisClient.get).toBeCalledTimes(1);
    expect(response).toBe('{"id":0}');
  });

  it("should del data on cache", async () => {
    const mockKey = "teste";
    const mockGetClient = jest
      .spyOn(cache, "getClient")
      .mockImplementation(() => mockRedisClient);
    await cache.del({ key: mockKey });
    expect(mockGetClient).toBeCalledTimes(1);
    expect(mockRedisClient.connect).toBeCalledTimes(1);
    expect(mockRedisClient.keys).toBeCalledTimes(1);
    expect(mockRedisClient.multi).toBeCalledTimes(1);
    expect(mockMulti.del).toBeCalledTimes(3);
    expect(mockMulti.exec).toBeCalledTimes(1);
    expect(mockRedisClient.disconnect).toBeCalledTimes(1);
  });
});
