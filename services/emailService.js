const nodemailer = require('nodemailer');
const config = require('../config');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.email,
        pass: config.password
    }
});

const sendLicenciaEmail = async (to, licenciaData, pdfPath) => {
    try {
        const mailOptions = {
            from: config.email,
            to: to,
            subject: 'Licencia de Funcionamiento Aprobada',
            text: `
Estimado(a) ${licenciaData.representanteLegal},

Nos complace informarle que su Licencia de Funcionamiento ha sido APROBADA.

Detalles de la Licencia:
- Razón Social: ${licenciaData.razonSocial}
- RUC: ${licenciaData.ruc}
- Dirección: ${licenciaData.direccion}
- Giro del Negocio: ${licenciaData.giroNegocio}

Adjunto encontrará el documento oficial de su Licencia de Funcionamiento.

Atentamente,
Municipalidad Distrital
            `,
            attachments: [
                {
                    filename: 'licencia_funcionamiento.pdf',
                    path: pdfPath
                }
            ]
        };

        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        throw error;
    }
};

module.exports = {
    sendLicenciaEmail
}; 