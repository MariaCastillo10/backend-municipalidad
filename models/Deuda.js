const mongoose = require("mongoose");

const DeudaSchema = new mongoose.Schema(
  {
    dni: { type: String, required: true },
    nombres: { type: String, required: true },
    concepto: { type: String, required: true },
    monto: { type: Number, required: true },
    fechaEmision: { type: Date, required: true },
    fechaVencimiento: { type: Date, required: true },
    estado: { type: Number, required: true },
    observaciones: { type: String },
    correo: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("deuda", DeudaSchema);
