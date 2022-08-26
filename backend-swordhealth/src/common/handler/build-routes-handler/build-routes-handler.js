const buildRoutesHandler = ({ routes }) => {
  return {
    handlers: {
      createUser: routes.userRoutes.controller.createUser,
      loginUser: routes.loginRoutes.controller.loginUser,
    },
  };
};

module.exports = { buildRoutesHandler };
