// models/Solicitud.js
const mongoose = require("mongoose");

const SolicitudSchema = new mongoose.Schema(
  {
    dniSolicitante: { type: String, required: true },
    nombreSolicitante: { type: String, required: true },
    correoSolicitante: { type: String, required: true },
    celularSolicitante: { type: String, required: true },
    direccionSolicitante: { type: String, required: true },
    dniConyuge: { type: String, required: true },
    nombreConyuge: { type: String, required: true },
    correoConyuge: { type: String, required: true },
    celularConyuge: { type: String, required: true },
    fechaMatrimonio: { type: Date, required: true },
    municipalidad: { type: Number, required: true },
    distrito: { type: Number, required: true },
    estado: { type: Number, required: true },
    archivoAdjunto: {
      filename: String,
      path: String,
      mimetype: String,
      size: Number,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("solicitudes", SolicitudSchema);
