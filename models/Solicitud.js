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
    codigoPago: { type: String, required: false },
    fechaPago: { type: String, required: false },
    montoPago: { type: String, required: false },
    nombrePago: { type: String, required: false },
    nroOperacionPago: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("solicitudes", SolicitudSchema);
