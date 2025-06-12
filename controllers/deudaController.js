const Deuda = require("../models/Deuda");

// Crear deuda
exports.crearDeuda = async (req, res) => {
  try {
    const {
      dni,
      nombres,
      concepto,
      monto,
      fechaEmision,
      fechaVencimiento,
      estado,
      observaciones,
      correo,
    } = req.body;

    const nuevaDeuda = new Deuda({
      dni,
      nombres,
      concepto,
      monto,
      fechaEmision,
      fechaVencimiento,
      estado,
      observaciones,
      correo,
    });

    await nuevaDeuda.save();

    res.status(201).json({ message: "Deuda registrada con éxito" });
  } catch (error) {
    console.error("Error al registrar la deuda:", error);
    res.status(500).json({ error: "Error al registrar la deuda" });
  }
};

// Buscar deudas por DNI
exports.buscarPorDNI = async (req, res) => {
  try {
    const { dni } = req.params;

    const deudas = await Deuda.find({ dni }).sort({ createdAt: -1 });

    if (!deudas.length) {
      return res
        .status(404)
        .json({ error: "No se encontraron deudas para este DNI" });
    }

    res.status(200).json(deudas);
  } catch (error) {
    console.error("Error al buscar deudas por DNI:", error);
    res.status(500).json({ error: "Error al buscar deudas" });
  }
};
