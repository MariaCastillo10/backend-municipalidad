const NotificacionInterna = require("../models/NotificacionInterna");

// Crear nueva notificación interna
exports.crearNotificacion = async (req, res) => {
  try {
    const {
      ciudadanoDNI,
      nombres,
      correo,
      celular,
      tipo,
      modulo,
      mensaje,
      via,
      prioridad,
      fueRespondido,
      areaDestino,
      estado,
      meta,
    } = req.body;

    const nuevaNotificacion = new NotificacionInterna({
      ciudadanoDNI,
      nombres,
      correo,
      celular,
      tipo,
      modulo,
      mensaje,
      via,
      prioridad,
      fueRespondido,
      areaDestino,
      estado,
      meta,
    });

    await nuevaNotificacion.save();

    res.status(201).json({ message: "Notificación registrada con éxito" });
  } catch (error) {
    console.error("Error al registrar la notificación:", error);
    res.status(500).json({ error: "Error al registrar la notificación" });
  }
};

// Listar todas las notificaciones
exports.listarNotificaciones = async (req, res) => {
  try {
    const notificaciones = await NotificacionInterna.find().sort({ createdAt: -1 });
    res.status(200).json(notificaciones);
  } catch (error) {
    console.error("Error al obtener las notificaciones:", error);
    res.status(500).json({ error: "Error al obtener las notificaciones" });
  }
};
