const { TaskRepository } = require("../../routes/tasks/repository");
const { Database } = require("../../common/service");
const {
  mockConnection,
  mockTransaction,
  mockQueryMethods,
} = require("./helpers/database-mocks");

describe("task-repository", () => {
  let taskRepository = null;
  let database = null;
  beforeEach(() => {
    database = new Database();
    taskRepository = new TaskRepository({ database });
  });

  it("should insert task on db", async () => {
    const mockTask = {
      name: "teste",
      summary: "teste teste",
      user_id: 1,
      created_at: new Date(),
    };
    const mockGetTransaction = jest
      .spyOn(taskRepository.database, "getTransaction")
      .mockImplementation(() => Promise.resolve(mockTransaction()));

    await taskRepository.insert({ task: mockTask });
    expect(mockGetTransaction).toBeCalledTimes(1);
    expect(mockQueryMethods.insert).toBeCalledTimes(1);
    expect(mockQueryMethods.into).toBeCalledTimes(1);
    expect(mockQueryMethods.commit).toBeCalledTimes(1);
  });

  it("should get all technician tasks from db", async () => {
    const mockUser = {
      id: 1,
      role: "technician",
    };
    const mockFilters = {
      offset: 0,
      limit: 10,
    };
    const mockGetConnection = jest
      .spyOn(taskRepository.database, "getConnection")
      .mockImplementation(() => Promise.resolve(mockConnection()));

    await taskRepository.getAll({ user: mockUser, filters: mockFilters });
    expect(mockGetConnection).toBeCalledTimes(1);
    expect(mockQueryMethods.select).toBeCalledTimes(1);
    expect(mockQueryMethods.from).toBeCalledTimes(1);
    expect(mockQueryMethods.where).toBeCalledTimes(1);
    expect(mockQueryMethods.limit).toBeCalledTimes(1);
    expect(mockQueryMethods.offset).toBeCalledTimes(1);
  });

  it("should get all tasks from db", async () => {
    const mockUser = {
      id: 1,
      role: "manager",
    };
    const mockFilters = {
      offset: 0,
      limit: 10,
    };
    const mockGetConnection = jest
      .spyOn(taskRepository.database, "getConnection")
      .mockImplementation(() => Promise.resolve(mockConnection()));

    await taskRepository.getAll({ user: mockUser, filters: mockFilters });
    expect(mockGetConnection).toBeCalledTimes(1);
    expect(mockQueryMethods.select).toBeCalledTimes(1);
    expect(mockQueryMethods.from).toBeCalledTimes(1);
    expect(mockQueryMethods.limit).toBeCalledTimes(1);
    expect(mockQueryMethods.offset).toBeCalledTimes(1);
  });

  it("should delete task on db", async () => {
    const mockGetTransaction = jest
      .spyOn(taskRepository.database, "getTransaction")
      .mockImplementation(() => Promise.resolve(mockTransaction()));

    await taskRepository.delete({ taskId: 1, userId: 1 });
    expect(mockGetTransaction).toBeCalledTimes(1);
    expect(mockQueryMethods.table).toBeCalledTimes(1);
    expect(mockQueryMethods.where).toBeCalledTimes(1);
    expect(mockQueryMethods.del).toBeCalledTimes(1);
  });

  it("should get task by id on db", async () => {
    const mockGetConnection = jest
      .spyOn(taskRepository.database, "getConnection")
      .mockImplementation(() => Promise.resolve(mockConnection()));

    await taskRepository.getById({ taskId: 1, userId: 1 });
    expect(mockGetConnection).toBeCalledTimes(1);
    expect(mockQueryMethods.select).toBeCalledTimes(1);
    expect(mockQueryMethods.from).toBeCalledTimes(1);
    expect(mockQueryMethods.where).toBeCalledTimes(1);
    expect(mockQueryMethods.andWhere).toBeCalledTimes(1);
    expect(mockQueryMethods.first).toBeCalledTimes(1);
  });

  it("should update task on db", async () => {
    const mockTask = {
      name: "teste",
      summary: "teste teste",
      perfomed_task_date: "2021-01-01",
    };
    const mockGetTransaction = jest
      .spyOn(taskRepository.database, "getTransaction")
      .mockImplementation(() => Promise.resolve(mockTransaction()));
    await taskRepository.update({ task: mockTask, userId: 1, taskId: 1 });
    expect(mockGetTransaction).toBeCalledTimes(1);
    expect(mockQueryMethods.table).toBeCalledTimes(1);
    expect(mockQueryMethods.where).toBeCalledTimes(1);
    expect(mockQueryMethods.andWhere).toBeCalledTimes(1);
    expect(mockQueryMethods.update).toBeCalledTimes(1);
  });
});
