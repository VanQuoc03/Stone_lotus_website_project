const bcrypt = require("bcryptjs");
const createBaseService = require("./baseService");
const User = require("../models/user");

const userService = {
  ...createBaseService(User, { role: "customer" }),
};

module.exports = userService;
