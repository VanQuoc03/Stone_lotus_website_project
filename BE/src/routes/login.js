const express = require("express");
const cors = require("cors");
const { login } = require("../controllers/login");
const { googleLogin } = require("../controllers/authGoogle");

const router = express.Router();

router.use(cors());

router.post("/login", login);
router.post("/google", googleLogin);

module.exports = router;
