const SwaggerExpress = require("swagger-express-mw");
const SwaggerUi = require("swagger-ui-express");
const express = require("express");
const routes = require("./routes");
const common = require("./common");
const { handlers } = common.handler.buildRoutesHandler({ routes });
const port = Number(process.env.PORT || 8089);

const app = express();
const swaggerConfig = {
  appRoot: __dirname,
  swaggerFile: `${__dirname}/config/swagger.yaml`,
  swaggerSecurityHandlers: {
    Bearer: common.handler.authenticationHandler,
  },
};

const onSwaggerCreated = (error, swaggerExpress) => {
  if (error) throw error;

  const swaggerDocument = swaggerExpress.runner.swagger;
  app.use("/api/v1/docs", SwaggerUi.serve, SwaggerUi.setup(swaggerDocument));
  swaggerExpress.register(app); // register middlewares
  app.listen(port, () => console.info("onAppStart", { port }));
};

SwaggerExpress.create(swaggerConfig, onSwaggerCreated);

module.exports = {
  app,
  ...handlers,
};
