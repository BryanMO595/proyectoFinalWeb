const express = require("express");
const router = express.Router();
const deviceController = require("../controllers/deviceController");

router.get("/", deviceController.getDevices);
router.get("/:id", deviceController.getDevice);
router.patch("/:id/status", deviceController.updateStatus);

module.exports = router;