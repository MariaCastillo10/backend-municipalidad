const nodemailer = require("nodemailer");
const { GMAIL_USER, GMAIL_PASS } = process.env;

/**
 * Envía un correo con el PDF adjunto.
 * @param {String} to - Correo del destinatario.
 * @param {String} subject - Asunto.
 * @param {String} text - Texto del mensaje.
 * @param {String} filePath - Ruta absoluta del archivo PDF.
 */
async function sendDeudaEmail(to, subject, text, filePath) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_PASS,
    },
  });

  const mailOptions = {
    from: GMAIL_USER,
    to,
    subject,
    text,
    attachments: [
      {
        filename: "detalle-deuda.pdf",
        path: filePath,
      },
    ],
  };

  await transporter.sendMail(mailOptions);
}

module.exports = sendDeudaEmail;
