const redis = require("redis");
class Cache {
  constructor() {}
  getClient = () => {
    var redisClient = redis.createClient({
      url: `redis://${process.env.REDIS_HOST}:6379`,
    });
    return redisClient;
  };

  set = async ({ key, value, expireFormat = "h", expire = 1 }) => {
    try {
      const expireInMinutes = 60;
      const expireInHours = 60 * 60;
      const exoureInDays = expireInHours * 24;
      const typeExpiration = {
        m: expireInMinutes * expire,
        h: expireInHours * expire,
        d: exoureInDays * expire,
      };

      const expireIn = typeExpiration[expireFormat] || expireInMinutes * expire;
      //const expireIn = 100;

      const redisClient = this.getClient();

      await redisClient.connect();

      const response = await redisClient.set(
        key,
        JSON.stringify(value),
        "EX",
        expireIn
      );

      await redisClient.disconnect();

      return response;
    } catch (error) {
      console.error(error);
    }
  };

  get = async ({ key }) => {
    try {
      const redisClient = this.getClient();

      await redisClient.connect();

      const data = await redisClient.get(key);

      await redisClient.disconnect();

      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  del = async ({ key }) => {
    try {
      const patternKey = `${key}:*`;

      const redisClient = this.getClient();

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
}

module.exports = { Cache };
