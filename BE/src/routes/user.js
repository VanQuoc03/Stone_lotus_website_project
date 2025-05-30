const express = require("express");
const cors = require("cors");
const userController = require("../controllers/user");
const authMiddleware = require("../utils/authMiddleWare");

const router = express.Router();

router.use(cors());
router.use(authMiddleware.authenticateToken);

router.get("/users", userController.getPaginated);
router.get("/users/:id", userController.getById);
router.post("/users", userController.create);
router.put("/users/:id", userController.update);
router.delete("/users/:id", userController.delete);

router.post("/bulk-delete", userController.bulkDelete);
router.patch("/bulk-status", userController.bulkUpdateStatus);

module.exports = router;
