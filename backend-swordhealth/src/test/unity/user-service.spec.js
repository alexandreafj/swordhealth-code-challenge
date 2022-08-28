const { usersService } = require("../../routes/user/service");

describe("user-service", () => {
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

  it("should throw error when trying to create duplicate users", async () => {
    const mockBody = {
      email: "teste@teste.com",
      name: "teste",
      password: "123",
    };
    const mockfindByEmail = jest
      .spyOn(usersService.userRepository, "findByEmail")
      .mockImplementation(() => Promise.resolve([0, 1, 0]));
    await expect(usersService.createUser({ body: mockBody })).rejects.toThrow({
      message: "Email already exists",
    });
    expect(mockfindByEmail).toBeCalledTimes(1);
  });

  it("should return create user", async () => {
    const mockBody = {
      email: "teste@teste.com",
      name: "teste",
      password: "123",
    };
    const mockfindByEmail = jest
      .spyOn(usersService.userRepository, "findByEmail")
      .mockImplementation(() => Promise.resolve([]));
    const mockinsert = jest
      .spyOn(usersService.userRepository, "insert")
      .mockImplementation(() => Promise.resolve());
    await expect(usersService.createUser({ body: mockBody }));
    expect(mockfindByEmail).toBeCalledTimes(1);
    expect(mockinsert).toBeCalledTimes(1);
  });
});
