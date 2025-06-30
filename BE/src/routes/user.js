const express = require("express");
const cors = require("cors");
const userController = require("../controllers/user");
const authMiddleware = require("../utils/authMiddleWare");

const router = express.Router();

router.use(cors());

router.get(
  "/users",
  authMiddleware.authenticateToken,
  userController.getPaginated
);
router.get("/users/me", authMiddleware.authenticateToken, userController.getMe);
router.put(
  "/users/me",
  authMiddleware.authenticateToken,
  userController.updateMe
);
router.get(
  "/users/:id",
  authMiddleware.authenticateToken,
  userController.getById
);
router.post("/users", authMiddleware.authenticateToken, userController.create);
router.put(
  "/users/:id",
  authMiddleware.authenticateToken,
  userController.update
);
router.delete(
  "/users/:id",
  authMiddleware.authenticateToken,
  userController.delete
);
router.post(
  "/bulk-delete",
  authMiddleware.authenticateToken,
  userController.bulkDelete
);
router.patch(
  "/bulk-status",
  authMiddleware.authenticateToken,
  userController.bulkUpdateStatus
);
router.post(
  "/change-password",
  authMiddleware.authenticateToken,
  userController.changePassword
);
router.post(
  "/set-password",
  authMiddleware.authenticateToken,
  userController.setPassword
);

module.exports = router;
