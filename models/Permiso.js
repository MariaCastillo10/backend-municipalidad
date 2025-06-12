const mongoose = require("mongoose");

const PermisoSchema = new mongoose.Schema(
  {
    tipo: { type: Number, required: true },
    fecha: { type: Date, required: true },
    lugar: { type: Number, required: true },
    horario: { type: Date, required: true },
    aforo: { type: Number, required: true },
    estado: { type: Number, required: true },
    costo: { type: Number, required: false },
    requiereAutorizacion: { type: Boolean, required: false },
    creadoEn: { type: Date, required: false },
    correo: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("permisos", PermisoSchema);
