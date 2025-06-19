const mongoose = require("mongoose");

const NotificacionInternaSchema = new mongoose.Schema(
  {
    ciudadanoDNI: { type: String, required: false },
    nombres: { type: String },
    correo: { type: String },
    celular: { type: String },

    tipo: { type: String, required: true }, 
    modulo: { type: String, required: true }, 
    mensaje: { type: String, required: true },

    via: { type: String, enum: ["correo", "whatsapp"], required: true },

    prioridad: { type: String, enum: ["Alta", "Media", "Baja"], default: "Media" },
    fueRespondido: { type: Boolean, default: false },

    areaDestino: { type: String, required: true }, 
    estado: { type: String, enum: ["Pendiente", "Resuelto"], default: "Pendiente" },

    meta: {
      idReferencia: { type: mongoose.Schema.Types.ObjectId }, 
      tipoReferencia: { type: String }, 
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("NotificacionInterna", NotificacionInternaSchema);
