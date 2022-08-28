const { AuthenticationHandler } = require("../../common/handler");
const {
  service: { Jwt },
} = require("../../common");

describe("authentication-handler", () => {
  let jwt = null;
  let authenticationHandler = null;
  beforeEach(() => {
    jwt = new Jwt();
    authenticationHandler = new AuthenticationHandler(jwt);
  });
  it("should authenticate", () => {
    const mockValidateToken = jest
      .spyOn(jwt, "validateToken")
      .mockImplementation(() => Math.random());
    const mockDecode = jest.spyOn(jwt, "decode").mockImplementation();
    authenticationHandler.authentication(
      {},
      "",
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoxLCJlbWFpbCI6InRlc3RlMDFAdGVzdGUuY29tIiwicm9sZSI6InRlY2huaWNpYW4iLCJuYW1lIjoidGVzdGUifSwiaWF0IjoxNjYxNjkyOTg4LCJleHAiOjE2NjE3NzkzODgsImF1ZCI6ImxvY2FsaG9zdCIsImlzcyI6InN3b3JkaGVhbHRoIiwianRpIjoiMWM1YjYzMTMtZGRiYS00YmI2LWI4NDYtYzAxYjVmMGUyNzJlIn0.VwVJVJ3eQZBwTOfoB0hdKfrNVqPo64CqlKRsty-KXRg",
      jest.fn()
    );
    expect(mockValidateToken).toBeCalledTimes(1);
    expect(mockDecode).toBeCalledTimes(1);
  });
});
