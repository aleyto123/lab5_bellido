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
  async create({ ticketId, message, type = "info", to = process.env.MAILER_TO || process.env.MAILER_EMAIL }) {
    const notification = {
      id: uuidv4(),
      ticketId,
      message,
      type,
      createdAt: new Date().toISOString(),
    };

    const saved = this.notificationRepository.save(notification);

    // Se envia el correo en segundo plano para no bloquear la respuesta HTTP.
    void this.emailService.sendEmail({
      to,
      subject: `Alerta del Sistema de Tickets: ${message}`,
      htmlBody: `<p>Se ha generado una nueva notificación:</p><h3>${message}</h3><p>Ticket ID: ${ticketId}</p>`,
    });

    return saved;
  }

  // Lista todas las notificaciones
  list() {
    return this.notificationRepository.findAll();
  }

  // Lista las notificaciones relacionadas a un ticket
  listByTicketId(ticketId) {
    return this.notificationRepository
      .findAll()
      .filter((notification) => notification.ticketId === ticketId);
  }
}

module.exports = NotificationService;
