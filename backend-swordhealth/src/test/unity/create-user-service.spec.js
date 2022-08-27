const { usersService } = require("../../routes/user/service");

describe("create-user-service", () => {
  it("should return password error when validate schema", () => {
    const mockBody = {
      email: "teste@teste.com",
      name: "teste",
      password: "123",
    };

    const hasErrorOnSchemaValidation = usersService.validateCreateUserSchema({
      body: mockBody,
    });

    expect(hasErrorOnSchemaValidation).toBeDefined();
    expect(hasErrorOnSchemaValidation.details[0].path[0]).toBe("password");
  });

  it("should return email error when validate schema", () => {
    const mockBody = {
      email: "testeteste.com",
      name: "teste",
      password: "123456456",
    };

    const hasErrorOnSchemaValidation = usersService.validateCreateUserSchema({
      body: mockBody,
    });

    expect(hasErrorOnSchemaValidation).toBeDefined();
    expect(hasErrorOnSchemaValidation.details[0].path[0]).toBe("email");
  });

  it("should return name error when validate schema", () => {
    const mockBody = {
      email: "teste@teste.com",
      name: "t",
      password: "123",
    };

    const hasErrorOnSchemaValidation = usersService.validateCreateUserSchema({
      body: mockBody,
    });

    expect(hasErrorOnSchemaValidation).toBeDefined();
    expect(hasErrorOnSchemaValidation.details[0].path[0]).toBe("name");
  });

  it("should return error status 409", async () => {
    const mockBody = {
      email: "teste@teste.com",
      name: "teste",
      password: "123",
    };
    const mockFindUserByEmail = jest
      .spyOn(usersService.userRepository, "findUserByEmail")
      .mockImplementation(() => Promise.resolve([0, 1, 0]));
    await expect(usersService.createUser({ body: mockBody })).rejects.toThrow();
    expect(mockFindUserByEmail).toBeCalledTimes(1);
  });

  it("should return create user", async () => {
    const mockBody = {
      email: "teste@teste.com",
      name: "teste",
      password: "123",
    };
    const mockFindUserByEmail = jest
      .spyOn(usersService.userRepository, "findUserByEmail")
      .mockImplementation(() => Promise.resolve([]));
    const mockInsertUser = jest
      .spyOn(usersService.userRepository, "insertUser")
      .mockImplementation(() => Promise.resolve());
    await expect(usersService.createUser({ body: mockBody }));
    expect(mockFindUserByEmail).toBeCalledTimes(1);
    expect(mockInsertUser).toBeCalledTimes(1);
  });
});
