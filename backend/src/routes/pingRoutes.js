const express = require("express");
const router = express.Router();

const pingController = require("../controllers/pingController");
const authMiddleware = require("../middleware/authMiddleware");

router.get(
  "/devices/:id/ping",
  authMiddleware.verifyToken,
  pingController.pingDevice
);

module.exports = router;