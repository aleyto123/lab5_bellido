// routes/ticket.routes.js
const express = require("express");
const router = express.Router();
const ticketController = require("../controllers/TicketController");

// POST /tickets
router.post("/", ticketController.create);

// GET /tickets
router.get("/", ticketController.list);

// PUT /tickets/:id/assign
router.put("/:id/assign", ticketController.assign);

// PUT /tickets/:id/status
router.put("/:id/status", ticketController.changeStatus);

// DELETE /tickets/:id
router.delete("/:id", ticketController.delete);

module.exports = router;
