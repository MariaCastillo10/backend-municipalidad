const Licencia = require("../models/Licencia");

exports.crearLicencia = async (req, res) => {
  try {
    const {
      razonSocial,
      ruc,
      representanteLegal,
      dni,
      direccion,
      giroNegocio,
      telefono,
      correo,
      fechaSolicitud,
      estado,
      observaciones,
    } = req.body;

    const nuevaLicencia = new Licencia({
      razonSocial,
      ruc,
      representanteLegal,
      dni,
      direccion,
      giroNegocio,
      telefono,
      correo,
      fechaSolicitud,
      estado,
      observaciones,
    });

    await nuevaLicencia.save();

    res.status(201).json({ message: "Licencia registrada con éxito" });
  } catch (error) {
    console.error("Error al registrar la licencia:", error);
    res.status(500).json({ error: "Error al registrar la licencia" });
  }
};

exports.listarLicencias = async (req, res) => {
  try {
    const licencias = await Licencia.find().sort({ createdAt: -1 });
    res.status(200).json(licencias);
  } catch (error) {
    console.error("Error al obtener las licencias:", error);
    res.status(500).json({ error: "Error al obtener las licencias" });
  }
};

exports.actualizarEstado = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  try {
    const licencia = await Licencia.findById(id);

    if (!licencia) {
      return res.status(404).json({ error: "Licencia no encontrada" });
    }

    licencia.estado = estado;
    await licencia.save();

    res.status(200).json({ message: "Estado actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar el estado:", error);
    res.status(500).json({ error: "Error al actualizar el estado" });
  }
};

exports.editarLicencia = async (req, res) => {
  const { id } = req.params;
  const {
    razonSocial,
    ruc,
    representanteLegal,
    dni,
    direccion,
    giroNegocio,
    telefono,
    correo,
    fechaSolicitud,
    estado,
    observaciones,
  } = req.body;

  try {
    const licencia = await Licencia.findById(id);

    if (!licencia) {
      return res.status(404).json({ error: "Licencia no encontrada" });
    }

    licencia.razonSocial = razonSocial;
    licencia.ruc = ruc;
    licencia.representanteLegal = representanteLegal;
    licencia.dni = dni;
    licencia.direccion = direccion;
    licencia.giroNegocio = giroNegocio;
    licencia.telefono = telefono;
    licencia.correo = correo;
    licencia.fechaSolicitud = fechaSolicitud;
    licencia.estado = estado;
    licencia.observaciones = observaciones;

    await licencia.save();

    res.status(200).json({ message: "Licencia actualizada correctamente" });
  } catch (error) {
    console.error("Error al actualizar la licencia:", error);
    res.status(500).json({ error: "Error al actualizar la licencia" });
  }
};
