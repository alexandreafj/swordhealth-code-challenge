module.exports = Object.freeze({
  ...require("./cache/cache"),
  ...require("./database/database"),
  ...require("./bcrypt/bcrypt"),
  ...require("./jwt/jwt"),
  ...require("./rabbitmq/rabbitmq"),
});
