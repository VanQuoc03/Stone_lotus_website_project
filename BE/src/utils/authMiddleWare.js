const jwt = require("jsonwebtoken");
const config = require("../configuration/jwtConfig");

function authenticateToken(req, res, next) {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    return res.status(401).json({ message: "Thiếu token!" });
  }

  const [bearer, token] = authHeader.split(" ");
  if (bearer !== "Bearer" || !token) {
    return res.status(401).json({ message: "Định dạng token không hợp lệ" });
  }

  try {
    const decoded = jwt.verify(token, config.secretKey);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT verify error:", err.message);
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token đã hết hạn" });
    }
    return res.status(403).json({ message: "Cấm: Token không hợp lệ" });
  }
}

module.exports = { authenticateToken };
