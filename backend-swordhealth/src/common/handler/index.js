module.exports = Object.freeze({
  ...require("./http-error-handler/http-error-handler"),
  ...require("./auth/authentication-handler"),
  ...require("./build-routes-handler/build-routes-handler"),
});
