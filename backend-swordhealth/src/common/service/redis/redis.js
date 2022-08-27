const redis = require("redis");

const getClient = () => {
  var redisClient = redis.createClient({
    url: `redis://${process.env.REDIS_HOST}:6379`,
  });
  return redisClient;
};

const set = async ({ key, value, expireFormat = "h", expire = 1 }) => {
  try {
    const expireInHours = 60 * 60;

    const typeExpiration = {
      h: expireInHours * expire,
      d: expireInHours * 24 * expire,
    };

    const expireIn = typeExpiration[expireFormat] || expireInHours * expire;

    const redisClient = getClient();

    await redisClient.connect();

    await redisClient.set(key, JSON.stringify(value), "EX", expireIn);

    await redisClient.disconnect();
  } catch (error) {
    console.error(error);
  }
};

const get = async ({ key }) => {
  try {
    const redisClient = getClient();

    await redisClient.connect();

    const data = await redisClient.get(key);

    await redisClient.disconnect();

    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

module.exports = { redis: { set, get } };
