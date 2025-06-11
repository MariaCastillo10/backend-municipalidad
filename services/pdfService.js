const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

const generateLicenciaPDF = async (licenciaData, funcionarioFirma) => {
    return new Promise(async (resolve, reject) => {
        try {
            const doc = new PDFDocument({
                size: 'A4',
                margin: 50
            });

            // Generar QR con los datos de verificación
            const qrData = JSON.stringify({
                id: licenciaData._id,
                ruc: licenciaData.ruc,
                fechaAprobacion: new Date().toISOString()
            });
            
            const qrImage = await QRCode.toDataURL(qrData);

            // Configurar el documento
            doc.font('Helvetica-Bold')
                .fontSize(16)
                .text('MUNICIPALIDAD DISTRITAL', { align: 'center' })
                .moveDown()
                .text('RESOLUCIÓN DE LICENCIA DE FUNCIONAMIENTO', { align: 'center' })
                .moveDown()
                .font('Helvetica')
                .fontSize(12)
                .text(`Número de Expediente: ${licenciaData._id}`, { align: 'right' })
                .text(`Fecha de Aprobación: ${new Date().toLocaleDateString()}`, { align: 'right' })
                .moveDown()
                .moveDown();

            // Datos del solicitante
            doc.font('Helvetica-Bold')
                .text('DATOS DEL SOLICITANTE:')
                .moveDown()
                .font('Helvetica')
                .text(`Razón Social: ${licenciaData.razonSocial}`)
                .text(`RUC: ${licenciaData.ruc}`)
                .text(`Representante Legal: ${licenciaData.representanteLegal}`)
                .text(`DNI: ${licenciaData.dni}`)
                .text(`Dirección: ${licenciaData.direccion}`)
                .text(`Giro del Negocio: ${licenciaData.giroNegocio}`)
                .moveDown()
                .moveDown();

            // Contenido de la resolución
            doc.font('Helvetica')
                .text('Por medio de la presente, se otorga la Licencia de Funcionamiento al establecimiento antes mencionado, habiendo cumplido con todos los requisitos establecidos por ley y las ordenanzas municipales vigentes.', { align: 'justify' })
                .moveDown()
                .moveDown();

            // Agregar QR
            doc.image(qrImage, {
                fit: [100, 100],
                align: 'center'
            });

            // Firma del funcionario
            if (funcionarioFirma) {
                doc.image(funcionarioFirma, {
                    fit: [150, 50],
                    align: 'right'
                });
            }

            // Generar nombre único para el archivo
            const fileName = `licencia_${licenciaData._id}_${Date.now()}.pdf`;
            const filePath = path.join(__dirname, '../temp', fileName);

            // Asegurar que el directorio temp existe
            if (!fs.existsSync(path.join(__dirname, '../temp'))) {
                fs.mkdirSync(path.join(__dirname, '../temp'));
            }

            // Guardar el PDF
            const writeStream = fs.createWriteStream(filePath);
            doc.pipe(writeStream);
            doc.end();

            writeStream.on('finish', () => {
                resolve(filePath);
            });

            writeStream.on('error', (error) => {
                reject(error);
            });

        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    generateLicenciaPDF
}; 