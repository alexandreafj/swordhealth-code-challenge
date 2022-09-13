const { taskService } = require("../../routes/tasks/service");

describe.only("task-service", () => {
  it("should return without any error on validate schema create task", () => {
    const mockBody = {
      name: "teste",
      summary: "teste",
    };

    const hasErrorOnSchemaValidation = taskService.validateCreateTaskSchema({
      task: mockBody,
    });
    expect(hasErrorOnSchemaValidation).toBeUndefined();
  });

  it("should return error on validate schema create task", () => {
    const mockBody = {
      name: "te",
      summary: "teste",
    };

    const hasErrorOnSchemaValidation = taskService.validateCreateTaskSchema({
      task: mockBody,
    });

    expect(hasErrorOnSchemaValidation).toBeDefined();
    expect(hasErrorOnSchemaValidation.details[0].path[0]).toBe("name");
  });

  it("should return error on validate schema create task with invalid property", () => {
    const mockBody = {
      name: "testes",
      summary: "teste",
      invalidProperty: "abc",
    };

    const hasErrorOnSchemaValidation = taskService.validateCreateTaskSchema({
      task: mockBody,
    });

    expect(hasErrorOnSchemaValidation).toBeDefined();
    expect(hasErrorOnSchemaValidation.details[0].path[0]).toBe(
      "invalidProperty"
    );
  });

  it("should return without any error on validate schema update task", () => {
    const mockBody = {
      id: 1,
      name: "teste",
      summary: "teste",
      perfomed_task_date: "2021-08-10",
    };

    const hasErrorOnSchemaValidation = taskService.validateUpdateTaskSchema({
      task: mockBody,
    });
    expect(hasErrorOnSchemaValidation).toBeUndefined();
  });

  it("should return error on validate schema update task", () => {
    const mockBody = {
      id: 1,
      name: "te",
      summary: "teste",
      perfomed_task_date: "2021-08-10",
    };

    const hasErrorOnSchemaValidation = taskService.validateUpdateTaskSchema({
      task: mockBody,
    });

    expect(hasErrorOnSchemaValidation).toBeDefined();
    expect(hasErrorOnSchemaValidation.details[0].path[0]).toBe("name");
  });

  it("should return error on validate schema update task with invalid property", () => {
    const mockBody = {
      id: 1,
      name: "teste",
      summary: "teste",
      perfomed_task_date: "2021-08-10",
      unvalidParam: "teste",
    };

    const hasErrorOnSchemaValidation = taskService.validateUpdateTaskSchema({
      task: mockBody,
    });

    expect(hasErrorOnSchemaValidation).toBeDefined();
    expect(hasErrorOnSchemaValidation.details[0].path[0]).toBe("unvalidParam");
  });

  it("should create task", async () => {
    const mockInsert = jest
      .spyOn(taskService.taskRepository, "insert")
      .mockImplementation(() => Promise.resolve());
    const mockDel = jest
      .spyOn(taskService.cache, "del")
      .mockImplementation(() => Promise.resolve());
    const mockTask = {
      name: "mocked",
      summary: "teste teste",
    };
    const mockUser = {
      id: 1,
    };
    await taskService.createTask({ task: mockTask, user: mockUser });
    expect(mockInsert).toBeCalledTimes(1);
    expect(mockDel).toBeCalledTimes(1);
  });

  it("should get tasks without using cache", async () => {
    const mockGetAll = jest
      .spyOn(taskService.taskRepository, "getAll")
      .mockImplementation(() =>
        Promise.resolve([
          { id: 0, name: "teste1" },
          { id: 0, name: "teste2" },
        ])
      );
    const mockGetCache = jest
      .spyOn(taskService.cache, "get")
      .mockImplementation(() => Promise.resolve(null));
    const mockSetCache = jest
      .spyOn(taskService.cache, "set")
      .mockImplementation(() => Promise.resolve());
    const mockUser = {
      id: 1,
    };
    const mockFilters = {
      limit: 10,
      offset: 0,
    };
    const tasks = await taskService.getTasks({
      user: mockUser,
      filters: mockFilters,
    });
    expect(mockGetAll).toBeCalledTimes(1);
    expect(mockGetCache).toBeCalledTimes(1);
    expect(mockSetCache).toBeCalledTimes(1);
    expect(tasks).toBeDefined();
    expect(tasks.length).toBe(2);
  });

  it("should get tasks using cache", async () => {
    const mockGetAll = jest
      .spyOn(taskService.taskRepository, "getAll")
      .mockImplementation(() => Promise.resolve());
    const mockGetCache = jest
      .spyOn(taskService.cache, "get")
      .mockImplementation(() =>
        Promise.resolve(
          JSON.stringify([
            { id: 0, name: "teste1" },
            { id: 0, name: "teste2" },
          ])
        )
      );
    const mockSetCache = jest
      .spyOn(taskService.cache, "set")
      .mockImplementation(() => Promise.resolve());
    const mockUser = {
      id: 1,
    };
    const mockFilters = {
      limit: 10,
      offset: 0,
    };
    const tasks = await taskService.getTasks({
      user: mockUser,
      filters: mockFilters,
    });
    expect(mockGetAll).toBeCalledTimes(0);
    expect(mockSetCache).toBeCalledTimes(0);
    expect(mockGetCache).toBeCalledTimes(1);
    expect(tasks).toBeDefined();
    expect(tasks.length).toBe(2);
  });

  it("should delete task", async () => {
    const mockDelCache = jest
      .spyOn(taskService.cache, "del")
      .mockImplementation(() => Promise.resolve());
    const mockDeleteTask = jest
      .spyOn(taskService.taskRepository, "delete")
      .mockImplementation(() => Promise.resolve());
    const mockUser = {
      id: 1,
    };
    await taskService.deleteTask({ taskId: 1, user: mockUser });
    expect(mockDelCache).toBeCalledTimes(1);
    expect(mockDeleteTask).toBeCalledTimes(1);
  });

  it("should update task and notify manager", async () => {
    const mockGetById = jest
      .spyOn(taskService.taskRepository, "getById")
      .mockImplementation(() => Promise.resolve({ perfomed_task_date: null }));
    const mockUpdateTask = jest
      .spyOn(taskService.taskRepository, "update")
      .mockImplementation(() => Promise.resolve());
    const mockDelCache = jest
      .spyOn(taskService.cache, "del")
      .mockImplementation(() => Promise.resolve());
    const mockSendNotification = jest
      .spyOn(taskService.rabbitmq, "sendNotification")
      .mockImplementation(() => Promise.resolve());
    const mockUser = {
      id: 1,
      name: "teste1",
    };
    const mockTask = {
      id: 1,
      name: "teste1",
      summary: "teste1",
      perfomed_task_update: "2022-08-27",
    };
    await taskService.updateTask({ task: mockTask, user: mockUser });
    expect(mockGetById).toBeCalledTimes(1);
    expect(mockUpdateTask).toBeCalledTimes(1);
    expect(mockDelCache).toBeCalledTimes(1);
    expect(mockSendNotification).toBeCalledTimes(1);
  });

  it("should throw error if task don't belong to user", async () => {
    const mockGetById = jest
      .spyOn(taskService.taskRepository, "getById")
      .mockImplementation(() => Promise.resolve(null));
    const mockUser = {
      id: 1,
      name: "teste1",
    };
    const mockTask = {
      id: 1,
      name: "teste1",
      summary: "teste1",
      perfomed_task_update: "2022-08-27",
    };
    await expect(
      taskService.updateTask({ task: mockTask, user: mockUser })
    ).rejects.toThrow({
      message: "Task does not belongs to user.",
    });
    expect(mockGetById).toBeCalledTimes(1);
  });

  it("should throw error when update the task already has been perfomed", async () => {
    const mockGetById = jest
      .spyOn(taskService.taskRepository, "getById")
      .mockImplementation(() =>
        Promise.resolve({ perfomed_task_date: "2021-01-01" })
      );
    const mockUser = {
      id: 1,
      name: "teste1",
    };
    const mockTask = {
      id: 1,
      name: "teste1",
      summary: "teste1",
      perfomed_task_update: "2022-08-27",
    };
    await expect(
      taskService.updateTask({ task: mockTask, user: mockUser })
    ).rejects.toThrow({
      message: "Task already has been perfomed.",
    });
    expect(mockGetById).toBeCalledTimes(1);
  });

  it("should update task throw error", async () => {
    const mockGetById = jest
      .spyOn(taskService.taskRepository, "getById")
      .mockImplementation(() =>
        Promise.resolve({ perfomed_task_date: "2021-09-10" })
      );
    const mockUser = {
      id: 1,
      name: "teste1",
    };
    const mockTask = {
      id: 1,
      name: "teste1",
      summary: "teste1",
      perfomed_task_update: "2022-08-27",
    };
    await expect(
      taskService.updateTask({ task: mockTask, user: mockUser })
    ).rejects.toThrow({
      message: "Task already has been perfomed.",
    });
    expect(mockGetById).toBeCalledTimes(1);
  });
});
