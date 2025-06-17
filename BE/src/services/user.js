const bcrypt = require("bcryptjs");
const createBaseService = require("./baseService");
const User = require("../models/user");

const userService = {
  ...createBaseService(User, { role: "customer" }),
  comparePassword: async (plainPassword, hashedPassword) => {
    return bcrypt.compare(plainPassword, hashedPassword);
  },
  updatePassword: async (userId, newPassword) => {
    const hashed = await bcrypt.hash(newPassword, 10);
    return User.findByIdAndUpdate(userId, { password: hashed }, { new: true });
  },
};

module.exports = userService;
