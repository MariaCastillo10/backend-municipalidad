// controllers/solicitudController.js
const Solicitud = require("../models/Solicitud");

exports.crearSolicitud = async (req, res) => {
  try {
    const {
      dniSolicitante,
      nombreSolicitante,
      correoSolicitante,
      celularSolicitante,
      direccionSolicitante,
      dniConyuge,
      nombreConyuge,
      correoConyuge,
      celularConyuge,
      fechaMatrimonio,
      municipalidad,
      distrito,
      estado,
    } = req.body;

    //const archivo = req.file;

    const nuevaSolicitud = new Solicitud({
      dniSolicitante,
      nombreSolicitante,
      correoSolicitante,
      celularSolicitante,
      direccionSolicitante,
      dniConyuge,
      nombreConyuge,
      correoConyuge,
      celularConyuge,
      fechaMatrimonio,
      municipalidad,
      distrito,
      estado,
      // archivoAdjunto: archivo
      //   ? {
      //       filename: archivo.filename,
      //       path: archivo.path,
      //       mimetype: archivo.mimetype,
      //       size: archivo.size,
      //     }
      //   : null,
    });

    await nuevaSolicitud.save();

    res.status(201).json({ message: "Solicitud registrada con éxito" });
  } catch (error) {
    console.error("Error al registrar la solicitud:", error);
    res.status(500).json({ error: "Error al registrar la solicitud" });
  }
};

exports.listarSolicitudes = async (req, res) => {
  try {
    const solicitudes = await Solicitud.find().sort({ createdAt: -1 });
    res.status(200).json(solicitudes);
  } catch (error) {
    console.error("Error al obtener las solicitudes:", error);
    res.status(500).json({ error: "Error al obtener las solicitudes" });
  }
};

exports.actualizarEstado = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  try {
    const solicitud = await Solicitud.findById(id);

    if (!solicitud) {
      return res.status(404).json({ error: "Solicitud no encontrada" });
    }

    solicitud.estado = estado;
    await solicitud.save();

    res.status(200).json({ message: "Estado actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar el estado:", error);
    res.status(500).json({ error: "Error al actualizar el estado" });
  }
};
