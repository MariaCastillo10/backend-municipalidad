// utils/generarPDFCompromiso.js
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const lugares = {
  1: "Plaza de Armas",
  2: "Coliseo Inca Roca",
  3: "Estadio Municipal",
  4: "Parque 12 de Noviembre",
  5: "Parque Los Milagros",
  6: "Auditorio Municipal",
  7: "Frontis de la Municipalidad",
  8: "Parque Industrial",
  9: "Mercado Central",
  10: "Calle o Avenida",
};

const tiposEventos = {
  1: "Evento Publico",
  2: "Feria Comercial",
  3: "Actividad Religiosa",
  4: "Obra Construccion",
  5: "Manifestacion",
  6: "Actividad Deportiva",
  7: "Espectaculo Artistico",
  8: "Instalacion Temporal",
  9: "Rodaje Cinematografico",
};

function generarPDFCompromiso(permiso, callback) {
  const doc = new PDFDocument();
  const filePath = path.join(
    __dirname,
    "../documentos",
    `compromiso-${permiso._id}.pdf`
  );
  const stream = fs.createWriteStream(filePath);

  doc.pipe(stream);

  doc
    .fontSize(18)
    .text("Municipalidad del Porvenir", { align: "center" })
    .moveDown();

  doc
    .fontSize(14)
    .text("Documento de Compromiso", { align: "center" })
    .moveDown(2);

  doc.fontSize(12).text(`ID de Permiso: ${permiso._id}`);
  doc.text(`Correo del solicitante: ${permiso.correo}`);
  doc.text(
    `Tipo de evento: ${tiposEventos[permiso.tipo] || "Tipo desconocido"}`
  );
  doc.text(`Fecha: ${new Date(permiso.fecha).toLocaleDateString()}`);
  doc.text(`Lugar: ${lugares[permiso.lugar] || "Lugar desconocido"}`);
  doc.text(`Horario: ${new Date(permiso.horario).toLocaleTimeString()}`);
  doc.text(`Aforo autorizado: ${permiso.aforo} personas`);
  doc.text(`Costo: S/. ${permiso.costo}`);
  doc.moveDown();

  doc.text(
    "El solicitante se compromete a respetar todas las normas establecidas por la municipalidad para la realización del evento."
  );

  doc.end();

  stream.on("finish", () => {
    callback(null, filePath);
  });

  stream.on("error", (err) => {
    callback(err, null);
  });
}

module.exports = generarPDFCompromiso;
