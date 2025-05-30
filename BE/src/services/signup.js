const User = require("../models/user");
const bcrypt = require("bcrypt");

async function createUser(userData) {
  const { name, email, password } = userData;

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new Error("Email đã tồn tại");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const createdUser = new User({
    name,
    email,
    password: hashedPassword,
    role: "customer",
    status: true,
    created_at: new Date(),
  });
  const savedUser = await createdUser.save();
  return savedUser;
}
module.exports = { createUser };
