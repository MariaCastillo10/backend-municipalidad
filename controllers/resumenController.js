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

// exports.listarNotificaciones = async (req, res) => {
//   try {
//     const notificaciones = await NotificacionInterna.find().sort({ createdAt: -1 });
//     res.status(200).json(notificaciones);
//   } catch (error) {
//     console.error("Error al obtener las notificaciones:", error);
//     res.status(500).json({ error: "Error al obtener las notificaciones" });
//   }
// };

exports.listarNotificaciones = async (req, res) => {
  try {
    const agrupadas = await NotificacionInterna.aggregate([
      {
        $group: {
          _id: {
            ciudadanoDNI: "$ciudadanoDNI",
            modulo: "$modulo",
            tipo: "$tipo",
          },
          nombres: { $first: "$nombres" },
          correo: { $first: "$correo" },
          celular: { $first: "$celular" },
          mensaje: { $last: "$mensaje" },
          via: { $last: "$via" },
          areaDestino: { $last: "$areaDestino" },
          prioridad: { $last: "$prioridad" },
          fueRespondido: { $last: "$fueRespondido" },
          estado: { $last: "$estado" },
          meta: { $last: "$meta" },
          ultimaFecha: { $max: "$createdAt" },
          totalEnviados: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          ciudadanoDNI: "$_id.ciudadanoDNI",
          modulo: "$_id.modulo",
          tipo: "$_id.tipo",
          nombres: 1,
          correo: 1,
          celular: 1,
          mensaje: 1,
          via: 1,
          areaDestino: 1,
          prioridad: 1,
          fueRespondido: 1,
          estado: 1,
          meta: 1,
          totalEnviados: 1,
          ultimaFecha: 1,
        },
      },
      {
        $sort: { ultimaFecha: -1 }
      }
    ]);

    res.status(200).json(agrupadas);
  } catch (error) {
    console.error("❌ Error al obtener notificaciones agrupadas:", error);
    res.status(500).json({ error: "Error al obtener notificaciones" });
  }
};

