// services/TicketService.js
const { v4: uuidv4 } = require("uuid");
const TicketRepository = require("../repositories/TicketRepository");
const NotificationService = require("./NotificationService");

class TicketService {
  constructor() {
    this.ticketRepository = new TicketRepository();
    this.notificationService = new NotificationService();
  }

  // Crea un nuevo ticket y genera una notificacion
  async createTicket({ title, description, priority = "media", assignedTo = null }) {
    const ticket = {
      id: uuidv4(),
      title,
      description,
      priority,
      status: "abierto",
      assignedTo,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const created = this.ticketRepository.save(ticket);

    this.notificationService.create({
      ticketId: created.id,
      message: `Ticket "${created.title}" creado.`,
      type: "created",
    });

    return created;
  }

  // Asigna un ticket a un responsable y genera una notificacion
  async assignTicket(id, assignedTo) {
    const updated = this.ticketRepository.update(id, {
      assignedTo,
      updatedAt: new Date().toISOString(),
    });

    if (!updated) return null;

    this.notificationService.create({
      ticketId: id,
      message: `Ticket "${updated.title}" asignado a ${assignedTo}.`,
      type: "assigned",
    });

    return updated;
  }

  // Cambia el estado de un ticket y genera una notificacion
  async changeStatus(id, status) {
    const updated = this.ticketRepository.update(id, {
      status,
      updatedAt: new Date().toISOString(),
    });

    if (!updated) return null;

    this.notificationService.create({
      ticketId: id,
      message: `Ticket "${updated.title}" cambio de estado a "${status}".`,
      type: "status_changed",
    });

    return updated;
  }

  // Lista todos los tickets
  list() {
    return this.ticketRepository.findAll();
  }

  // Elimina un ticket y genera una notificacion
  async deleteTicket(id) {
    const deleted = this.ticketRepository.delete(id);

    if (!deleted) return null;

    this.notificationService.create({
      ticketId: deleted.id,
      message: `Ticket "${deleted.title}" eliminado.`,
      type: "deleted",
    });

    return deleted;
  }
}

module.exports = TicketService;
