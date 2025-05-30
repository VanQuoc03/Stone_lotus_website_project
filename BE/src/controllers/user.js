const userService = require("../services/user");
const createController = require("./genericControllerFactory");

const userController = createController(userService, "Người dùng");

module.exports = userController;
