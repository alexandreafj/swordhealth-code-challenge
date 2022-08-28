const {
  handler: { httpErrorHandler },
} = require("../../common");

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.end = jest.fn().mockReturnValue(res);
  return res;
};

const mockRequest = {
  headers: {},
  get: jest.fn(),
  params: {},
  originalUrl: "",
  protocol: "",
  query: {},
};

describe("httpErrorHandler", () => {
  it("should return bad request", () => {
    const mockError = {
      statusCode: 400,
      message: "error",
      details: null,
    };
    const res = mockResponse();
    const req = mockRequest;
    const response = httpErrorHandler({ req, res, error: mockError });
    expect(response).toBeDefined();
  });
});
