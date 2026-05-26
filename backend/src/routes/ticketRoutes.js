const express = require("express");
const router = express.Router();

const ticketController = require("../controllers/ticketController");
const { requireRole } = require("../middleware/authMiddleware");

router.get("/", ticketController.getTickets);
router.get("/:id", ticketController.getTicket);

router.post("/", requireRole("admin", "tecnico"), ticketController.createTicket);
router.put("/:id", requireRole("admin", "tecnico"), ticketController.updateTicket);
router.patch("/:id/status", requireRole("admin", "tecnico"), ticketController.updateStatus);
router.patch("/:id/close", requireRole("admin", "tecnico"), ticketController.closeTicket);
router.delete("/:id", requireRole("admin"), ticketController.deleteTicket);

module.exports = router;