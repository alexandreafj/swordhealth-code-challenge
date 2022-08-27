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

const del = async ({ key }) => {
  try {
    const patternKey = `${key}:*`;

    const redisClient = getClient();

    await redisClient.connect();

    const redisKeys = await redisClient.keys(patternKey);

    const hasKeysToDelete = redisKeys.length > 0;

    if (hasKeysToDelete) {
      new Promise((resolve, reject) => {
        const transaction = redisClient.multi();

        redisKeys.forEach((key) => transaction.del(key));

        transaction.exec((err, reply) => {
          if (err) reject(err);
          resolve(reply);
        });
      });
    }
  } catch (error) {
    console.error(error);
  }
};

module.exports = { redis: { set, get, del } };
