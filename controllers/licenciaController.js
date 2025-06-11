const Licencia = require("../models/Licencia");
const { generateLicenciaPDF } = require("../services/pdfService");
const { sendLicenciaEmail } = require("../services/emailService");
const fs = require('fs').promises;

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

    // Si el estado es aprobado (asumiendo que estado 2 es aprobado)
    if (estado === 2) {
      try {
        // Generar el PDF
        const pdfPath = await generateLicenciaPDF(licencia);
        
        // Enviar el correo con el PDF
        await sendLicenciaEmail(licencia.correo, licencia, pdfPath);
        
        // Eliminar el archivo temporal después de enviarlo
        await fs.unlink(pdfPath);
        
        return res.status(200).json({ 
          message: "Estado actualizado y PDF enviado correctamente",
          licenciaId: id
        });
      } catch (error) {
        console.error("Error al generar/enviar PDF:", error);
        return res.status(200).json({ 
          message: "Estado actualizado pero hubo un error al enviar el PDF",
          error: error.message
        });
      }
    }

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

// Nuevo endpoint para descargar el PDF
exports.descargarPDF = async (req, res) => {
  const { id } = req.params;

  try {
    const licencia = await Licencia.findById(id);

    if (!licencia) {
      return res.status(404).json({ error: "Licencia no encontrada" });
    }

    // Generar el PDF
    const pdfPath = await generateLicenciaPDF(licencia);

    // Configurar la respuesta
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=licencia_${id}.pdf`);

    // Enviar el archivo
    const fileStream = fs.createReadStream(pdfPath);
    fileStream.pipe(res);

    // Eliminar el archivo temporal después de enviarlo
    fileStream.on('end', async () => {
      await fs.unlink(pdfPath);
    });

  } catch (error) {
    console.error("Error al generar el PDF:", error);
    res.status(500).json({ error: "Error al generar el PDF" });
  }
};
