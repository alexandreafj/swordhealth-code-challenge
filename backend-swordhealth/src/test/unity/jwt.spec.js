const {
  service: { Jwt },
} = require("../../common");
const jsonwebtoken = require("jsonwebtoken");
process.env.JWT_AUD = "sword";
process.env.JWT_ISS = "sword";
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

  it("should validate token", () => {
    const mockVerify = jest
      .spyOn(jsonwebtoken, "verify")
      .mockReturnValue({ exp: 2401708019, aud: "sword", iss: "sword" });
    jwt.validateToken({ token: "" });
    expect(mockVerify).toBeCalledTimes(1);
  });
});
