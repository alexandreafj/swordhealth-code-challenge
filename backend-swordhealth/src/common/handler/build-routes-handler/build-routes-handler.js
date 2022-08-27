const buildRoutesHandler = ({ routes }) => {
  return {
    handlers: {
      createUser: routes.userRoutes.controller.createUser,
      loginUser: routes.loginRoutes.controller.loginUser,
      createTask: routes.tasksRoutes.controller.createTask,
      getTasks: routes.tasksRoutes.controller.getTasks,
      updateTask: routes.tasksRoutes.controller.updateTask,
      deleteTask: routes.tasksRoutes.controller.deleteTask,
    },
  };
};

module.exports = { buildRoutesHandler };
