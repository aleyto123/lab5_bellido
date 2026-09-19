// controllers/TicketController.js
const TicketService = require("../services/TicketService");

const ticketService = new TicketService();

// POST /tickets
const create = async (req, res) => {
  try {
    const { title, description, priority, assignedTo } = req.body;
    if (!title) {
      return res.status(400).json({ error: "El campo 'title' es obligatorio." });
    }
    const ticket = await ticketService.createTicket({
      title,
      description,
      priority,
      assignedTo,
    });
    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /tickets
const list = (req, res) => {
  try {
    const tickets = ticketService.list();
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT /tickets/:id/assign
const assign = async (req, res) => {
  try {
    const { id } = req.params;
    const { assignedTo } = req.body;
    if (!assignedTo) {
      return res
        .status(400)
        .json({ error: "El campo 'assignedTo' es obligatorio." });
    }
    const ticket = await ticketService.assignTicket(id, assignedTo);
    if (!ticket) {
      return res.status(404).json({ error: "Ticket no encontrado." });
    }
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT /tickets/:id/status
const changeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: "El campo 'status' es obligatorio." });
    }
    const ticket = await ticketService.changeStatus(id, status);
    if (!ticket) {
      return res.status(404).json({ error: "Ticket no encontrado." });
    }
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE /tickets/:id
const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await ticketService.deleteTicket(id);
    if (!ticket) {
      return res.status(404).json({ error: "Ticket no encontrado." });
    }
    res.json({ message: "Ticket eliminado.", ticket });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  create,
  list,
  assign,
  changeStatus,
  delete: remove,
};
