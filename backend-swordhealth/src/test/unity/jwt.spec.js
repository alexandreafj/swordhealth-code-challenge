const {
  service: { Jwt },
} = require("../../common");
const jsonwebtoken = require("jsonwebtoken");

describe("Jwt", () => {
  let jwt = null;
  beforeEach(() => {
    jwt = new Jwt();
  });
  it("should generate token", () => {
    const mockData = {
      id: 0,
      name: "teste",
    };
    const mockSign = jest
      .spyOn(jsonwebtoken, "sign")
      .mockReturnValue("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9");
    const { token } = jwt.generateJwt({ data: mockData });
    expect(token).toBeDefined();
    expect(token).toBe("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9");
    expect(mockSign).toBeCalledTimes(1);
  });

  it.skip("should throw token expired", () => {
    const mockVerify = jest.spyOn(jsonwebtoken, "verify").mockReturnValue();
    const mockDecode = jest
      .spyOn(jsonwebtoken, "decode")
      .mockReturnValue({ exp: 1401708019, aud: "", iss: "" });
    expect(jwt.validateToken({ token: "" })).rejects.toThrow();
    expect(mockDecode).toBeCalledTimes(1);
    expect(mockVerify).toBeCalledTimes(1);
  });
});
