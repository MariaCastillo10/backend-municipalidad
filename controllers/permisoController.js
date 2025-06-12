const Permiso = require("../models/Permiso");

function calcularCosto(tipo, aforo) {
  let costoBase = 0;

  switch (tipo) {
    case 1:
      costoBase = 50;
      break;
    case 2:
      costoBase = 100;
      break;
    default:
      costoBase = 70;
      break;
  }

  if (aforo > 100) costoBase += 30;
  if (aforo > 200) costoBase += 50;

  return costoBase;
}

exports.crearPermiso = async (req, res) => {
  try {
    const { tipo, fecha, lugar, horario, aforo, estado, correo } = req.body;

    const horarioDate = new Date(horario);

    // Obtener hora local y redondear al inicio de la hora
    const horarioLocal = new Date(horarioDate);
    horarioLocal.setMinutes(0, 0, 0); // Redondear al inicio de la hora

    const siguienteHora = new Date(horarioLocal);
    siguienteHora.setHours(siguienteHora.getHours() + 1); // Límite superior

    // Verificar si ya existe otro permiso en la misma hora (rango [hh:00, hh+1:00))
    const duplicado = await Permiso.findOne({
      lugar: Number(lugar),
      horario: {
        $gte: horarioLocal,
        $lt: siguienteHora,
      },
    });

    if (duplicado) {
      return res.status(400).json({
        mensaje: "El espacio ya está reservado en esa hora.",
      });
    }

    const requiereAutorizacion = aforo > 200;
    const costo = calcularCosto(tipo, aforo);

    const nuevoPermiso = new Permiso({
      tipo,
      fecha: horarioDate,
      lugar,
      horario: horarioDate,
      aforo,
      estado,
      correo,
      requiereAutorizacion,
      costo,
      creadoEn: new Date(),
    });

    console.log("Nuevo permiso:", nuevoPermiso);

    await nuevoPermiso.save();
    res.status(201).json({ mensaje: "Permiso registrado con éxito" });
  } catch (error) {
    console.error("Error al registrar el permiso:", error);
    res.status(500).json({ error: "Error al registrar el permiso" });
  }
};

exports.listarPermisos = async (req, res) => {
  try {
    const permisos = await Permiso.find().sort({ createdAt: -1 });
    res.status(200).json(permisos);
  } catch (error) {
    console.error("Error al obtener permisos:", error);
    res.status(500).json({ error: "Error al obtener permisos" });
  }
};

exports.actualizarPermiso = async (req, res) => {
  const { id } = req.params;
  const { tipo, fecha, lugar, horario, aforo, estado } = req.body;

  try {
    const permiso = await Permiso.findById(id);
    if (!permiso) {
      return res.status(404).json({ error: "Permiso no encontrado" });
    }

    permiso.tipo = tipo;
    permiso.fecha = fecha;
    permiso.lugar = lugar;
    permiso.horario = horario;
    permiso.aforo = aforo;
    permiso.estado = estado;

    await permiso.save();
    res.status(200).json({ message: "Permiso actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar permiso:", error);
    res.status(500).json({ error: "Error al actualizar permiso" });
  }
};

exports.actualizarEstado = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  try {
    const permiso = await Permiso.findById(id);
    if (!permiso) {
      return res.status(404).json({ error: "Permiso no encontrado" });
    }

    permiso.estado = estado;
    await permiso.save();

    res.status(200).json({ message: "Estado actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar estado:", error);
    res.status(500).json({ error: "Error al actualizar estado" });
  }
};
