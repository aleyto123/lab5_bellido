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

    // Se envia el correo SIEMPRE, pero protegido: si falla, la API NO se cae.
    try {
      const result = await this.emailService.sendEmail({
        to: process.env.MAILER_EMAIL,
        subject: `Alerta del Sistema de Tickets: ${message}`,
        htmlBody: `<p>Se ha generado una nueva notificación:</p><h3>${message}</h3><p>Ticket ID: ${ticketId}</p>`,
      });

      if (result && result.success) {
        console.log("Correo enviado exitosamente");
      } else {
        console.error(
          "No se pudo enviar el correo:",
          result ? result.error : "respuesta vacía"
        );
      }
    } catch (error) {
      // Red de seguridad extra: nunca debe propagarse y tumbar la API
      console.error("No se pudo enviar el correo:", error.message);
    }

    return saved;
  }

  // Lista todas las notificaciones
  list() {
    return this.notificationRepository.findAll();
  }
}

module.exports = NotificationService;
