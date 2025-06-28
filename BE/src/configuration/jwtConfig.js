require("dotenv").config();
module.exports = {
  secretKey: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRES_IN || "7d",
};
