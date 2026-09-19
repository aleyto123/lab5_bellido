// services/NotificationService.js
const { v4: uuidv4 } = require("uuid");
const NotificationRepository = require("../repositories/NotificationRepository");
const EmailService = require("./email/EmailService");

class NotificationService {
  constructor() {
    this.notificationRepository = new NotificationRepository();
    this.emailService = new EmailService();
  }

  // Crea una nueva notificacion con UUID
  async create({ ticketId, message, type = "info" }) {
    const notification = {
      id: uuidv4(),
      ticketId,
      message,
      type,
      createdAt: new Date().toISOString(),
    };

    const saved = this.notificationRepository.save(notification);

    // Si la notificacion es de tipo "email", se envia un correo real
    if (type === "email") {
      try {
        await this.emailService.sendEmail({
          to: "rony.bellido@tecsup.edu.pe",
          subject: "API RESTful - Alertas del sistema de Tickets",
          htmlBody: `<p>${message}</p>`,
        });
      } catch (error) {
        console.error("Error al enviar el correo:", error.message);
      }
    }

    return saved;
  }

  // Lista todas las notificaciones
  list() {
    return this.notificationRepository.findAll();
  }
}

module.exports = NotificationService;
