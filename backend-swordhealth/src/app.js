const SwaggerExpress = require("swagger-express-mw");
const SwaggerUi = require("swagger-ui-express");
const express = require("express");
const routes = require("./routes");
const common = require("./common");
const helmet = require("helmet");
const compression = require("compression");
const { Jwt, Database } = require("./common/service");
const { handlers } = common.handler.buildRoutesHandler({ routes });
const port = Number(process.env.PORT || 8089);

const app = express();
let server = null;
const jwt = new Jwt();
const authenticationHandler = new common.handler.AuthenticationHandler(jwt);
const swaggerConfig = {
  appRoot: __dirname,
  swaggerFile: `${__dirname}/config/swagger.yaml`,
  swaggerSecurityHandlers: {
    Bearer: authenticationHandler.authentication,
  },
};

const onSwaggerCreated = (error, swaggerExpress) => {
  if (error) throw error;

  const swaggerDocument = swaggerExpress.runner.swagger;
  app.use("/api/v1/docs", SwaggerUi.serve, SwaggerUi.setup(swaggerDocument));
  app.use(helmet());
  app.use(compression());
  app.disable("x-powered-by");
  swaggerExpress.register(app); // register middlewares
  server = app.listen(port, () => console.info("onAppStart", { port }));
};

// capture errors not been handled
// if the system don't have this system is going to brake
process.on("uncaughtException", (error, origin) => {
  console.log(`\n${origin} signal received. \n${error}`);
});
// capture errors not been handled by promises
// if we don't have this the system don't warn us
process.on("unhandledRejection", (error) => {
  console.log(`signal received \n${error}`);
});

// gracefull shutdown
const gracefullShutdown = (event) => {
  return (code) => {
    console.log(`${event} received with ${code}`);
    // assure that no client is going to request any in this period
    // but if that's someone using, wait until finish
    const database = new Database();
    server.close((err) => {
      console.log("http server closed");
      console.log("db connection closed");
      database.closeConnection();
      process.exit(code);
    });
  };
};

// trigger when CTRL + C on terminal -> multi platform
process.on("SIGINT", gracefullShutdown("SIGINT"));

// trigger when kill the process
process.on("SIGTERM", gracefullShutdown("SIGTERM"));

process.on("exit", (code) => {
  console.log("exit signal received ", code);
});

SwaggerExpress.create(swaggerConfig, onSwaggerCreated);

module.exports = {
  app,
  ...handlers,
};
