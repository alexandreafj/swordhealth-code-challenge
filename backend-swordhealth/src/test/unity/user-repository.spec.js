const { UserRepository } = require("../../routes/user/repository");
const { Database } = require("../../common/service");
const {
  mockConnection,
  mockTransaction,
  mockQueryMethods,
} = require("./helpers/database-mocks");

describe("user-repository", () => {
  let userRepository = null;
  let database = null;
  beforeEach(() => {
    database = new Database();
    userRepository = new UserRepository({ database });
  });

  it("should find one user on db", async () => {
    const mockGetConnection = jest
      .spyOn(userRepository.database, "getConnection")
      .mockImplementation(() => Promise.resolve(mockConnection()));
    await userRepository.findOne({ email: "teste@teste.com" });
    expect(mockGetConnection).toBeCalledTimes(1);
    expect(mockQueryMethods.select).toBeCalledTimes(1);
    expect(mockQueryMethods.from).toBeCalledTimes(1);
    expect(mockQueryMethods.where).toBeCalledTimes(1);
  });

  it("should find one user and return only email on db", async () => {
    const mockGetConnection = jest
      .spyOn(userRepository.database, "getConnection")
      .mockImplementation(() => Promise.resolve(mockConnection()));
    await userRepository.findByEmail({ email: "teste@teste.com" });
    expect(mockGetConnection).toBeCalledTimes(1);
    expect(mockQueryMethods.select).toBeCalledTimes(1);
    expect(mockQueryMethods.from).toBeCalledTimes(1);
    expect(mockQueryMethods.where).toBeCalledTimes(1);
  });

  it("should insert user on db", async () => {
    const mockUser = {
      email: "teste@teste.com",
      name: "teste",
      password: "12345",
      role: "manager",
    };
    const mockGetTransaction = jest
      .spyOn(userRepository.database, "getTransaction")
      .mockImplementation(() => Promise.resolve(mockTransaction()));
    await userRepository.insert({ user: mockUser });
    expect(mockGetTransaction).toBeCalledTimes(1);
    expect(mockQueryMethods.insert).toBeCalledTimes(1);
    expect(mockQueryMethods.into).toBeCalledTimes(1);
    expect(mockQueryMethods.commit).toBeCalledTimes(1);
  });
});
