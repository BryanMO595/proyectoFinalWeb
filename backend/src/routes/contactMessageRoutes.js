const express = require("express");
const router = express.Router();

const contactMessageController = require("../controllers/contactMessageController");

router.get("/", contactMessageController.getMessages);
router.get("/:id", contactMessageController.getMessage);
router.post("/", contactMessageController.createMessage);
router.delete("/:id", contactMessageController.deleteMessage);

module.exports = router;