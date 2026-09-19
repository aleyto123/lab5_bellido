// services/email/EmailService.js
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

class EmailService {
  constructor() {
    // El transporter se construye con las credenciales del archivo .env.
    // Los timeouts evitan que la API se quede colgada si el SMTP no responde.
    this.transporter = nodemailer.createTransport({
      service: process.env.MAILER_SERVICE,
      auth: {
        user: process.env.MAILER_EMAIL,
        pass: process.env.MAILER_SECRET_KEY,
      },
      connectionTimeout: 10000, // 10s para conectar
      greetingTimeout: 10000, // 10s para el saludo del servidor
      socketTimeout: 15000, // 15s de inactividad del socket
    });
  }

  // Envía un correo. options = { to, subject, htmlBody }
  // Nunca lanza la excepción hacia arriba: devuelve true/false.
  async sendEmail({ to, subject, htmlBody }) {
    try {
      const info = await this.transporter.sendMail({
        from: process.env.MAILER_EMAIL,
        to,
        subject,
        html: htmlBody,
      });
      return { success: true, info };
    } catch (error) {
      console.error(
        `No se pudo enviar el correo (${error.code || "error"}): ${error.message}`,
      );
      return { success: false, error: error.message };
    }
  }
}

module.exports = EmailService;
