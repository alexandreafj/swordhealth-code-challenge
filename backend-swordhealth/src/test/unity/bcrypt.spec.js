const {
  service: { Bcrypt },
} = require("../../common");
const bcryptjs = require("bcryptjs");

describe("Jwt", () => {
  let bcrypt = null;
  beforeEach(() => {
    bcrypt = new Bcrypt();
  });
  it("should generate hash", () => {
    const mockGenSaltSync = jest
      .spyOn(bcryptjs, "genSaltSync")
      .mockImplementation();
    const mockHashSync = jest
      .spyOn(bcryptjs, "hashSync")
      .mockImplementation(
        () => "$2a$10$FHZ34VCo59EltJCE1jGpQ.47fcPskNsD6fVDFJQgsZ05h09vR.rLK"
      );
    const hashPassword = bcrypt.generateHashPassword({ password: "123456" });
    expect(mockGenSaltSync).toBeCalledTimes(1);
    expect(mockHashSync).toBeCalledTimes(1);
    expect(hashPassword).toBeDefined();
    expect(hashPassword).toBe(
      "$2a$10$FHZ34VCo59EltJCE1jGpQ.47fcPskNsD6fVDFJQgsZ05h09vR.rLK"
    );
  });

  it("should compare password", async () => {
    const mockCompare = jest
      .spyOn(bcryptjs, "compare")
      .mockImplementation(() => Promise.resolve(true));
    const compare = await bcrypt.comparePassword({
      password: "123456",
      hash: '"$2a$10$FHZ34VCo59EltJCE1jGpQ.47fcPskNsD6fVDFJQgsZ05h09vR.rLK',
    });
    expect(mockCompare).toBeCalledTimes(1);
    expect(compare).toBeDefined();
    expect(compare).toBe(true);
  });
});
