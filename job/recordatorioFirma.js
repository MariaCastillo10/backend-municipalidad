require("dotenv").config();
const cron = require("node-cron");
const nodemailer = require("nodemailer");
const { MongoClient } = require("mongodb");
const twilio = require("twilio");
const mongoose = require("mongoose");

const NotificacionInterna = require("../models/NotificacionInterna");
const Solicitud = require("../models/Solicitud"); 

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
    const solicitudes = db.collection("solicitudes");

    const hoy = new Date();
    const solicitudesPendientes = await solicitudes
      .find({ estado: 2 })
      .toArray();

    for (const solicitud of solicitudesPendientes) {
      const fechaCreacion = new Date(solicitud.fechaCreacion);
      const diasPasados = Math.floor(
        (hoy - fechaCreacion) / (1000 * 60 * 60 * 24)
      );

      // if (diasPasados < 5) {
        const correos = [
          solicitud.correoSolicitante,
          solicitud.correoConyuge,
        ].filter(Boolean);

        for (const correo of correos) {

           const mensajeCorreo = `Estimado(a), le recordamos que debe acercarse a la municipalidad para firmar su trámite de divorcio.`;

          await transporter.sendMail({
            from: GMAIL_USER,
            to: correo,
            subject: "Municipalidad Porvenir - Recordatorio de firma",
            text: mensajeCorreo
          });
          
          await NotificacionInterna.create({
            ciudadanoDNI: solicitud.dniSolicitante || "SIN_DNI",
            nombres: solicitud.nombreSolicitante,
            correo,
            tipo: "Recordatorio de Firma",
            modulo: "Divorcios",
            mensaje: mensajeCorreo,
            via: "correo",
            prioridad: "Media",
            areaDestino: "Área Legal",
            meta: {
              idReferencia: solicitud._id,
              tipoReferencia: "Solicitud",
            },
          });
        }
      // }

      if (diasPasados >= 5) {
        // if (true) {
        const celulares = [
          solicitud.celularSolicitante,
          solicitud.celularConyuge,
        ].filter(Boolean);
        for (const celular of celulares) {
           const mensajeWA = "⚠️ Recordatorio: Han pasado 5 días sin firmar el trámite de divorcio. Por favor, acérquese a la Municipalidad del Porvenir.";
          await twilioClient.messages.create({
            from: `whatsapp:${TWILIO_WHATSAPP_FROM}`,
            to: `whatsapp:+51${celular}`,
            body: mensajeWA
          });

          await NotificacionInterna.create({
            ciudadanoDNI: solicitud.dniSolicitante || "SIN_DNI",
            nombres: solicitud.nombreSolicitante,
            celular,
            tipo: "Recordatorio de Firma (5 días)",
            modulo: "Divorcios",
            mensaje: mensajeWA,
            via: "whatsapp",
            prioridad: "Alta",
            areaDestino: "Área Legal",
            meta: {
              idReferencia: solicitud._id,
              tipoReferencia: "Solicitud",
            },
          });
        }
      }
    }
  } catch (err) {
    console.error("❌ Error en cron job:", err);
  } finally {
    await client.close();
  }
});
