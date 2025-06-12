require("dotenv").config();
const cron = require("node-cron");
const nodemailer = require("nodemailer");
const { MongoClient } = require("mongodb");
const twilio = require("twilio");
const generarPDFCompromiso = require("../utils/generarPDFCompromiso");

const {
  MONGO_URI,
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_WHATSAPP_FROM,
  GMAIL_USER,
  GMAIL_PASS,
} = process.env;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_PASS,
  },
});

const twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// cron.schedule("0 9 * * *", async () => {

  cron.schedule("*/3 * * * *", async () => {
  console.log("🔁 Ejecutando recordatorio de permisos aprobados");

  const client = new MongoClient(MONGO_URI);
  try {
    await client.connect();
    const db = client.db("test");
    const permisos = db.collection("permisos");

    const hoy = new Date();
    const aprobados = await permisos.find({ estado: 2 }).toArray();

    for (const permiso of aprobados) {
      const fechaAprobado = new Date(permiso.creadoEn); // o permiso.fechaAprobado
      const diasPasados = Math.floor(
        (hoy - fechaAprobado) / (1000 * 60 * 60 * 24)
      );

      //   if (diasPasados === 0) {
      // Generar PDF dinámicamente
      generarPDFCompromiso(permiso, async (err, filePath) => {
        if (err) {
          console.error("❌ Error generando PDF:", err);
          return;
        }

        try {
          await transporter.sendMail({
            from: GMAIL_USER,
            to: permiso.correo,
            subject: "Permiso aprobado - Documento de compromiso",
            text: "Adjunto encontrará el documento de compromiso. Debe realizar el pago correspondiente en los próximos 3 días y adjuntarlo el comprobante en su solicitud en el sistema. Una  vez realizado se le volverá a enviar el documento firmado.",
            attachments: [
              {
                filename: "compromiso.pdf",
                path: filePath,
              },
            ],
          });

          console.log(`📩 PDF enviado a ${permiso.correo}`);
        } catch (error) {
          console.error("❌ Error enviando correo:", error);
        }
      });
      //   }

      if (diasPasados === 3) {
        // Enviar recordatorio con QR de pago
        await transporter.sendMail({
          from: GMAIL_USER,
          to: permiso.correo,
          subject: "Pago pendiente - Último recordatorio",
          text: `Han pasado 3 días desde la aprobación de su permiso y aún no se ha registrado el pago. Por favor, realice el pago usando el QR adjunto o su solicitud será cancelada.`,
          attachments: [
            {
              filename: "pagoQR.png",
              path: "./documentos/qr_pago.png",
            },
          ],
        });

        await twilioClient.messages.create({
          from: `whatsapp:${TWILIO_WHATSAPP_FROM}`,
          to: `whatsapp:+51${permiso.celularSolicitante}`, // asegúrate de guardar este campo
          body: "⚠️ Último recordatorio: Su permiso aprobado aún no ha sido pagado. Realice el pago en las próximas 24h para evitar la cancelación.",
        });

        console.log(`🚨 Recordatorio de pago enviado a ${permiso.correo}`);
      }
    }
  } catch (err) {
    console.error("❌ Error en cron de permisos:", err);
  } finally {
    await client.close();
  }
});
