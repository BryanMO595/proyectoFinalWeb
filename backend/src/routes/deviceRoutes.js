const express = require("express");
const router = express.Router();

const deviceController = require("../controllers/deviceController");
const { requireRole } = require("../middleware/authMiddleware");

router.get("/", deviceController.getDevices);
router.get("/:id", deviceController.getDevice);

router.post("/", requireRole("admin"), deviceController.createDevice);
router.put("/:id", requireRole("admin"), deviceController.updateDevice);
router.patch("/:id/status", requireRole("admin", "tecnico"), deviceController.updateStatus);
router.delete("/:id", requireRole("admin"), deviceController.deleteDevice);

module.exports = router;