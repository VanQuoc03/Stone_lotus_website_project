const jwt = require("jsonwebtoken");
const { secretKey, expiresIn } = require("../configuration/jwtConfig");

function generateToken(user) {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role,
  };
  return jwt.sign(payload, secretKey, { expiresIn });
}

module.exports = {
  generateToken,
};
