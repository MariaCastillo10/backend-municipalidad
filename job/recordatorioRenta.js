require("dotenv").config();
const cron = require("node-cron");
const { MongoClient } = require("mongodb");
const mongoose = require("mongoose");
const generatePDFDeuda = require("../utils/generatePDFDeuda");
const sendDeudaEmail = require("../utils/sendDeudaEmail");
const NotificacionInterna = require("../models/NotificacionInterna");

const {
  MONGO_URI,
  GMAIL_USER,
} = process.env;

// cron.schedule("*/5 * * * *", async () => {
cron.schedule("0 9 * * *", async () => {
  console.log("📬 Ejecutando job de envío de deudas vencidas");

  const client = new MongoClient(MONGO_URI);
  try {
    await client.connect();
    const db = client.db("test");
    const deudas = db.collection("deudas");

    const hoy = new Date();

    const vencidas = await deudas
      .find({
        estado: 1,
        correo: { $ne: null },
      })
      .toArray();

    for (const deuda of vencidas) {
      const mensaje = `Estimado(a) ${deuda.nombres}, se le informa que tiene una deuda pendiente de S/. ${deuda.monto.toFixed(
        2
      )} por concepto de ${deuda.concepto}. Adjuntamos el detalle con código QR para su pago vía Yape.`;

      // 1. Generar PDF
      await new Promise((resolve) => {
        generatePDFDeuda(deuda, async (err, filePath) => {
          if (err) {
            console.error("❌ Error generando PDF:", err);
            return resolve();
          }

          try {
            // 2. Enviar correo
            await sendDeudaEmail(
              deuda.correo,
              "Municipalidad - Notificación de deuda vencida",
              mensaje,
              filePath
            );

            const totalNotificaciones = await NotificacionInterna.countDocuments({
              ciudadanoDNI: deuda.dni,
              modulo: "Rentas",
            });

            let prioridad = "Baja";
            if (totalNotificaciones >= 5 && totalNotificaciones <= 8) {
              prioridad = "Media";
            } else if (totalNotificaciones >= 9) {
              prioridad = "Alta";
            }

            await NotificacionInterna.create({
              ciudadanoDNI: deuda.dni,
              nombres: deuda.nombres,
              correo: deuda.correo,
              tipo: "Aviso de Deuda",
              modulo: "Rentas",
              mensaje,
              via: "correo",
                prioridad,
              areaDestino: "Tesorería",
              meta: {
                idReferencia: deuda._id,
                tipoReferencia: "Deuda",
              },
            });

            console.log(`📩 Deuda enviada a ${deuda.correo}`);
          } catch (error) {
            console.error("❌ Error enviando correo o guardando notificación:", error);
          }

          resolve();
        });
      });
    }
  } catch (err) {
    console.error("❌ Error en job de deudas vencidas:", err);
  } finally {
    await client.close();
  }
});
