const crypto = require("crypto");

const secretKey = crypto.randomBytes(32).toString("hex");
// const secretKey = 123456789;
module.exports = {
  secretKey: secretKey,
};
