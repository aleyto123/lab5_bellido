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

    // Se envia el correo SIEMPRE, sin importar el tipo de notificacion
    try {
      await this.emailService.sendEmail({
        to: process.env.MAILER_EMAIL,
        subject: `Alerta del Sistema de Tickets: ${message}`,
        htmlBody: `<p>Se ha generado una nueva notificación:</p><h3>${message}</h3><p>Ticket ID: ${ticketId}</p>`,
      });
      console.log(`Correo enviado con éxito a ${process.env.MAILER_EMAIL}: ${message}`);
    } catch (error) {
      console.error(`Error al enviar el correo (${error.code || "auth"}): ${error.message}`);
    }

    return saved;
  }

  // Lista todas las notificaciones
  list() {
    return this.notificationRepository.findAll();
  }
}

module.exports = NotificationService;
