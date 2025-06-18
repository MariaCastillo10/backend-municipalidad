const Deuda = require("../models/Deuda");
const generatePDFDeuda = require("../utils/generatePDFDeuda");
const sendDeudaEmail = require("../utils/sendDeudaEmail");

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

exports.enviarCorreoConDeuda = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("ID de deuda:", id);

    const deuda = await Deuda.findById(id);
    console.log("Deuda encontrada:", deuda);
    if (!deuda) {
      return res.status(404).json({ error: "Deuda no encontrada" });
    }

    generatePDFDeuda(deuda, async (err, filePath) => {
      if (err) {
        console.error("❌ Error al generar PDF:", err);
        return res.status(500).json({ error: "Error al generar el PDF" });
      }

      const mensaje = `Estimado(a) ${deuda.nombres}, se le informa que posee una deuda pendiente con la Municipalidad del Porvenir por el concepto de ${deuda.concepto}. Adjunto encontrará el detalle y código QR para el pago vía Yape.`;

      await sendDeudaEmail(
        deuda.correo,
        "Municipalidad del Porvenir - Notificación de Deuda",
        mensaje,
        filePath
      );

      console.log("✅ Correo enviado a:", deuda.correo);

      res.status(200).json({ message: "Correo enviado con éxito" });
    });
  } catch (error) {
    console.error("❌ Error al enviar correo:", error);
    res.status(500).json({ error: "Error del servidor" });
  }
};
