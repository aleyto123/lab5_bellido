// services/email/EmailService.js
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

class EmailService {
  constructor() {
    // El transporter se construye con las credenciales del archivo .env
    this.transporter = nodemailer.createTransport({
      service: process.env.MAILER_SERVICE,
      auth: {
        user: process.env.MAILER_EMAIL,
        pass: process.env.MAILER_SECRET_KEY,
      },
    });
  }

  // Envía un correo. options = { to, subject, htmlBody }
  async sendEmail({ to, subject, htmlBody }) {
    return this.transporter.sendMail({
      from: process.env.MAILER_EMAIL,
      to,
      subject,
      html: htmlBody,
    });
  }
}

module.exports = EmailService;
