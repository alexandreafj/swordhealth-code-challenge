module.exports = Object.freeze({
  ...require("./create-task/create-task"),
  ...require("./delete-task/delete-task"),
  ...require("./get-tasks/get-tasks"),
  ...require("./update-task/update-task"),
});
