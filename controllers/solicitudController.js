// controllers/solicitudController.js
const Solicitud = require("../models/Solicitud");
const Tesseract = require("tesseract.js");
const fs = require("fs");

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
      codigoPago,
      fechaPago,
      montoPago,
      nombrePago,
      nroOperacionPago,
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
      codigoPago,
      fechaPago,
      montoPago,
      nombrePago,
      nroOperacionPago,
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

exports.actualizarSolicitud = async (req, res) => {
  const { id } = req.params;

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
    codigoPago,
    fechaPago,
    montoPago,
    nombrePago,
    nroOperacionPago,
  } = req.body;

  try {
    const solicitud = await Solicitud.findById(id);

    if (!solicitud) {
      return res.status(404).json({ error: "Solicitud no encontrada" });
    }

    solicitud.dniSolicitante = dniSolicitante;
    solicitud.nombreSolicitante = nombreSolicitante;
    solicitud.correoSolicitante = correoSolicitante;
    solicitud.celularSolicitante = celularSolicitante;
    solicitud.direccionSolicitante = direccionSolicitante;
    solicitud.dniConyuge = dniConyuge;
    solicitud.nombreConyuge = nombreConyuge;
    solicitud.correoConyuge = correoConyuge;
    solicitud.celularConyuge = celularConyuge;
    solicitud.fechaMatrimonio = fechaMatrimonio;
    solicitud.municipalidad = municipalidad;
    solicitud.distrito = distrito;
    solicitud.estado = estado;
    solicitud.codigoPago = codigoPago;
    solicitud.fechaPago = fechaPago;
    solicitud.montoPago = montoPago;
    solicitud.nombrePago = nombrePago;
    solicitud.nroOperacionPago = nroOperacionPago;

    await solicitud.save();

    res.status(200).json({ message: "Solicitud actualizada correctamente" });
  } catch (error) {
    console.error("Error al actualizar la solicitud:", error);
    res.status(500).json({ error: "Error al actualizar la solicitud" });
  }
};

exports.extraerTextoRecibo = async (req, res) => {
  try {
    const resultado = await Tesseract.recognize(req.file.path, "spa");
    const texto = resultado.data.text;

    let montoFinal = null;
    const lineas = texto.split("\n");

    // Busca la línea que contiene "¡Yapeaste!"
    let idxYapeaste = lineas.findIndex((linea) =>
      linea.toLowerCase().includes("yapeaste")
    );
    if (idxYapeaste !== -1) {
      // Busca en las siguientes 2 líneas después de "¡Yapeaste!"
      for (
        let i = idxYapeaste + 1;
        i <= idxYapeaste + 2 && i < lineas.length;
        i++
      ) {
        // Busca un número (puede estar solo, por el tamaño grande)
        const match = lineas[i].match(/([0-9]{1,6})/);
        if (match) {
          montoFinal = `S/ ${match[1]}`;
          break;
        }
      }
    }

    // Si no encuentra, busca en todas las líneas que tengan S/
    if (!montoFinal) {
      for (let linea of lineas) {
        const match = linea.match(/S\/\s*([0-9]{1,6})/);
        if (match) {
          montoFinal = `S/ ${match[1]}`;
          break;
        }
      }
    }

    // Si aún no encuentra, busca el número más grande como fallback
    if (!montoFinal) {
      const numeros = texto.match(/\d{2,}/g);
      if (numeros && numeros.length > 0) {
        montoFinal = `S/ ${Math.max(
          ...numeros.map((n) => parseInt(n.replace(/\s/g, ""), 10))
        )}`;
      }
    }

    const fecha = texto.match(/\d{2}\s\w{3}\.\s\d{4}/i);
    const codigo = texto.match(
      /C[oó]DIGO\s+DE\s+SEGURIDAD\s+\w*\s*([A-Z0-9 ]+)/i
    );

    fs.unlinkSync(req.file.path);

    res.status(200).json({
      texto,
      monto: montoFinal,
      fecha: fecha ? fecha[0] : null,
      codigo: codigo ? codigo[1] : null,
    });
  } catch (error) {
    console.error("Error al extraer texto del recibo:", error);
    res.status(500).json({ error: "Error al extraer texto del recibo" });
  }
};
