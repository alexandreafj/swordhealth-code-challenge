module.exports = Object.freeze({
  ...require("./redis/redis"),
  ...require("./db-connection/db-connection"),
});
