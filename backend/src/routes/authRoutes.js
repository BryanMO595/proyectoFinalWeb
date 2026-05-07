const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const { verifyToken, requireRole } = require("../middleware/authMiddleware");

router.post("/login", authController.login);
router.post("/register", verifyToken, requireRole("admin"), authController.register);
router.get("/me", verifyToken, authController.me);

module.exports = router;