const { createClient } = require("redis");

const getClient = () => {
  const redis_client = createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT || "6379",
  });
  return redis_client;
};

const setKey = async ({ key, value, expire_format = "h", expire = 1 }) => {
  try {
    const expire_in_hours = 60 * 60;

    const type_expire = {
      h: expire_in_hours * expire,
      d: expire_in_hours * 24 * expire,
    };

    const expire_data = type_expire[expire_format] || expire_in_hours * expire;

    const redis_client = getClient();

    await redis_client.set(key, JSON.stringify(value), "EX", expire_data);
  } catch (error) {
    console.error(error);
  }
};

const getKey = async ({ key }) => {
  const redis_client = getClient();

  const data = await redis_client.get(key);

  return data;
};

module.exports = { redis: { setKey, getKey } };
