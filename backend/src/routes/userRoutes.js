const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const { verifyToken, requireRole } = require("../middleware/authMiddleware");

router.use(verifyToken);
router.use(requireRole("admin"));

router.get("/", userController.getUsers);
router.get("/:id", userController.getUser);
router.post("/", userController.createUser);
router.put("/:id", userController.updateUser);
router.patch("/:id/password", userController.updatePassword);
router.delete("/:id", userController.deleteUser);

module.exports = router;