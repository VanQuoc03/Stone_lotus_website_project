const bcrypt = require("bcrypt");
const User = require("../models/user");
const { generateToken } = require("../utils/jwtUtils");

async function login(email, password) {
  try {
    const lowercasedEmail = email.toLowerCase();

    const existingUser = await User.findOne({ email: lowercasedEmail });
    if (!existingUser) {
      throw new Error("User not found");
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordValid) {
      throw new Error("Incorrect password");
    }
    const token = generateToken(existingUser);
    return {
      token,
      user: {
        name: existingUser.name,
        email: existingUser.email,
      },
    };
  } catch (error) {
    throw new Error("Tài khoản hoặc mật khẩu không chính xác");
  }
}

module.exports = {
  login,
};
