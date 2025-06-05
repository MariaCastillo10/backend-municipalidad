const Solicitud = require("../models/Solicitud");
const Licencia = require("../models/Licencia");

exports.obtenerPendientes = async (req, res) => {
  try {
    const divorciosPendientes = await Solicitud.countDocuments({ estado: 1 });
    const licenciasPendientes = await Licencia.countDocuments({ estado: 1 });

    res.status(200).json({ divorciosPendientes, licenciasPendientes });
  } catch (error) {
    console.error("Error al obtener pendientes:", error);
    res.status(500).json({ error: "Error al obtener notificaciones" });
  }
};
