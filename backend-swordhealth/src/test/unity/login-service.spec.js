const { loginService } = require("../../routes/login/service");

describe("login-service", () => {
  it("should throw when a user has not been found", async () => {
    const mockBody = {
      email: "teste@teste.com",
      password: "123456",
    };
    const mockFindOne = jest
      .spyOn(loginService.userRepository, "findOne")
      .mockImplementation(() => Promise.resolve([]));
    await expect(
      loginService.verifyCredentials({ body: mockBody })
    ).rejects.toThrow({
      message: "You have entered an invalid username or password",
    });
    expect(mockFindOne).toBeCalledTimes(1);
  });

  it("should throw when a password doesn't match", async () => {
    const mockBody = {
      email: "teste@teste.com",
      password: "123456",
    };
    const mockFindOne = jest
      .spyOn(loginService.userRepository, "findOne")
      .mockImplementation(() => Promise.resolve([{ password: "123" }]));
    const mockComparePassword = jest
      .spyOn(loginService.bcrypt, "comparePassword")
      .mockImplementation(() => Promise.resolve(false));
    await expect(
      loginService.verifyCredentials({ body: mockBody })
    ).rejects.toThrow({
      message: "You have entered an invalid username or password",
    });
    expect(mockFindOne).toBeCalledTimes(1);
    expect(mockComparePassword).toBeCalledTimes(1);
  });

  it("should return a user", async () => {
    const mockBody = {
      email: "teste@teste.com",
      password: "123456",
    };
    const mockFindOne = jest
      .spyOn(loginService.userRepository, "findOne")
      .mockImplementation(() =>
        Promise.resolve([
          { id: 0, name: "alexandre", password: "123", role: "manager" },
        ])
      );
    const mockComparePassword = jest
      .spyOn(loginService.bcrypt, "comparePassword")
      .mockImplementation(() => Promise.resolve(true));
    const { user } = await loginService.verifyCredentials({ body: mockBody });
    expect(mockFindOne).toBeCalledTimes(1);
    expect(mockComparePassword).toBeCalledTimes(1);
    expect(user).toBeDefined();
    expect(user.id).toBe(0);
    expect(user.name).toBe("alexandre");
    expect(user.password).toBe("123");
    expect(user.role).toBe("manager");
  });

  it("should return a user", async () => {
    const mockUser = {
      id: 0,
      name: "alexandre",
      password: "123",
      role: "manager",
    };
    const mockGenerateJwt = jest
      .spyOn(loginService.jwt, "generateJwt")
      .mockImplementation(() =>
        Promise.resolve({ token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9" })
      );
    const { token } = await loginService.generateToken({ user: mockUser });
    expect(mockGenerateJwt).toBeCalledTimes(1);
    expect(token).toBeDefined();
    expect(token).toBe("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9");
  });
});
