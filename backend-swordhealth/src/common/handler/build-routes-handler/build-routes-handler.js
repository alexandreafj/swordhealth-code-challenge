const buildRoutesHandler = ({ routes }) => {
  return {
    handlers: {
      createUser: routes.userRoutes.controller.createUserController,
      loginUser: routes.loginRoutes.controller.loginUser,
    },
  };
};

module.exports = { buildRoutesHandler };
