const { StatusCodes } = require("http-status-codes");
const uuid = require("uuid");

const httpErrorHandler = ({ req, res, error }) => {
  const responseStatusCode =
    error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const isInternal = responseStatusCode === StatusCodes.INTERNAL_SERVER_ERROR;
  const errorId = uuid.v4();
  const internalErrorMessage = `internal server error (${errorId})`;
  const response = { message: internalErrorMessage };
  if (!isInternal) {
    Object.assign(response, {
      message: error.message,
      details: error.details,
    });
  }
  const errorContext = {
    error: String(error),
    errorId,
    request: {
      headers: req.headers || {},
      host: req.get("host") || "",
      responseStatusCode: responseStatusCode || 0,
      params: req.params || {},
      path: req.originalUrl || "",
      protocol: req.protocol || "",
      query: req.query || {},
    },
    response,
    stack: error.stackTrace,
  };
  console.log(JSON.stringify(errorContext));

  return res.status(responseStatusCode).json(response).end();
};
module.exports = { httpErrorHandler };
