require("dotenv").config();
const cron = require("node-cron");
const nodemailer = require("nodemailer");
const { MongoClient } = require("mongodb");
const twilio = require("twilio");
const mongoose = require("mongoose");
const generarPDFCompromiso = require("../utils/generarPDFCompromiso");
const NotificacionInterna = require("../models/NotificacionInterna");

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

cron.schedule("0 9 * * *", async () => {
  // cron.schedule("*/2 * * * *", async () => {
  const client = new MongoClient(MONGO_URI);
  try {
    await client.connect();
    const db = client.db("test");
    const permisos = db.collection("permisos");

    const hoy = new Date();
    const aprobados = await permisos.find({ estado: 2 }).toArray();

    await Promise.all(
      aprobados.map(async (permiso) => {
        const fechaAprobado = new Date(permiso.creadoEn);
        const diasPasados = Math.floor(
          (hoy - fechaAprobado) / (1000 * 60 * 60 * 24)
        );

        // 📄 Enviar PDF el mismo día (día 0)
        // if (diasPasados === 0) {
          await new Promise((resolve) => {
            generarPDFCompromiso(permiso, async (err, filePath) => {
              if (err) {
                console.error("❌ Error generando PDF:", err);
                return resolve();
              }

              const mensajeCorreo = `Adjunto encontrará el documento de compromiso. Debe realizar el pago correspondiente en los próximos 3 días y adjuntar el comprobante en su solicitud.`;

              try {
                await transporter.sendMail({
                  from: GMAIL_USER,
                  to: permiso.correo,
                  subject: "Permiso aprobado - Documento de compromiso",
                  text: mensajeCorreo,
                  attachments: [
                    {
                      filename: "compromiso.pdf",
                      path: filePath,
                    },
                  ],
                });

                let prioridad = "Baja";
                if (total >= 5 && total <= 8) prioridad = "Media";
                else if (total >= 9) prioridad = "Alta";

                await NotificacionInterna.create({
                  ciudadanoDNI: permiso.dni,
                  nombres: permiso.nombreSolicitante || "No especificado",
                  correo: permiso.correo,
                  tipo: "Permiso Aprobado",
                  modulo: "Permisos",
                  mensaje: mensajeCorreo,
                  via: "correo",
                  prioridad,
                  areaDestino: "Eventos y Seguridad",
                  meta: {
                    idReferencia: permiso._id,
                    tipoReferencia: "Permiso",
                  },
                });

                console.log(`📩 PDF enviado a ${permiso.correo}`);
              } catch (error) {
                console.error("❌ Error enviando correo:", error);
              }

              resolve();
            });
          });
        // }

        // 🔔 Recordatorio al día 3
        if (diasPasados === 3) {
          const mensajeCorreo = `Han pasado 3 días desde la aprobación de su permiso y aún no se ha registrado el pago. Por favor, realice el pago usando el QR adjunto o su solicitud será cancelada.`;
          const mensajeWA = "⚠️ Último recordatorio: Su permiso aprobado aún no ha sido pagado. Realice el pago en las próximas 24h para evitar la cancelación.";

          try {
            await transporter.sendMail({
              from: GMAIL_USER,
              to: permiso.correo,
              subject: "Pago pendiente - Último recordatorio",
              text: mensajeCorreo,
              attachments: [
                {
                  filename: "pagoQR.png",
                  path: "./documentos/qr_pago.png",
                },
              ],
            });

          const total = await NotificacionInterna.countDocuments({
            ciudadanoDNI: permiso.dni,
            modulo: "Permisos",
          });

          let prioridad = "Baja";
          if (total >= 5 && total <= 8) prioridad = "Media";
          else if (total >= 9) prioridad = "Alta";

            await NotificacionInterna.create({
              ciudadanoDNI: permiso.dni,
              nombres: permiso.nombreSolicitante || "No especificado",
              correo: permiso.correo,
              tipo: "Recordatorio de Pago",
              modulo: "Permisos",
              mensaje: mensajeCorreo,
              via: "correo",
              prioridad,
              areaDestino: "Eventos y Seguridad",
              meta: {
                idReferencia: permiso._id,
                tipoReferencia: "Permiso",
              },
            });

            await twilioClient.messages.create({
              from: `whatsapp:${TWILIO_WHATSAPP_FROM}`,
              to: `whatsapp:+51${permiso.celularSolicitante}`,
              body: mensajeWA,
            });

            await NotificacionInterna.create({
              ciudadanoDNI: permiso.dni,
              nombres: permiso.nombreSolicitante || "No especificado",
              celular: permiso.celularSolicitante,
              tipo: "Recordatorio de Pago",
              modulo: "Permisos",
              mensaje: mensajeWA,
              via: "whatsapp",
              prioridad,
              areaDestino: "Eventos y Seguridad",
              meta: {
                idReferencia: permiso._id,
                tipoReferencia: "Permiso",
              },
            });

            console.log(`🚨 Recordatorio de pago enviado a ${permiso.correo}`);
          } catch (error) {
            console.error("❌ Error enviando recordatorio:", error);
          }
        }
      })
    );
  } catch (err) {
    console.error("❌ Error en cron de permisos:", err);
  } finally {
    await client.close();
  }
});
