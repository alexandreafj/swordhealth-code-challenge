const {
  service: { Jwt },
} = require("../../common");
const jsonwebtoken = require("jsonwebtoken");

describe("Jwt", () => {
  let jwt = null;
  beforeEach(() => {
    jwt = new Jwt();
  });
  it("should generate token", async () => {
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
});
