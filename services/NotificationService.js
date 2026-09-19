// services/NotificationService.js
const { v4: uuidv4 } = require("uuid");
const NotificationRepository = require("../repositories/NotificationRepository");

class NotificationService {
  constructor() {
    this.notificationRepository = new NotificationRepository();
  }

  // Crea una nueva notificación con UUID
  create({ ticketId, message, type = "info" }) {
    const notification = {
      id: uuidv4(),
      ticketId,
      message,
      type,
      createdAt: new Date().toISOString(),
    };
    return this.notificationRepository.save(notification);
  }

  // Lista todas las notificaciones
  list() {
    return this.notificationRepository.findAll();
  }
}

module.exports = NotificationService;
