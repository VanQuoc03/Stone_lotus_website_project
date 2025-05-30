/**
 * Middleware kiểm tra quyền của user
 * Dùng sau verifyToken
 * @param {string | string[]} allowedRoles - quyền được phép (vd: "admin" hoặc ["admin", "manager"])
 */

function requireRole(allowedRoles) {
  return (req, res, next) => {
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    if (!req.user || !roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền truy cập trang này" });
    }
    next();
  };
}

module.exports = { requireRole };
