const mongoose = require("mongoose");

const LicenciaSchema = new mongoose.Schema(
  {
    razonSocial: { type: String, required: true },
    ruc: { type: String, required: true },
    representanteLegal: { type: String, required: true },
    dni: { type: String, required: true },
    direccion: { type: String, required: true },
    giroNegocio: { type: String, required: true },
    telefono: { type: String, required: true },
    correo: { type: String, required: true },
    fechaSolicitud: { type: Date, required: true },
    estado: { type: Number, required: true },
    observaciones: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("licencia", LicenciaSchema);
