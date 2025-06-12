const express = require("express");
const router = express.Router();
const solicitudController = require("../controllers/solicitudController");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

/**
 * @swagger
 * tags:
 *   name: Solicitudes
 *   description: Endpoints para solicitudes de trámite
 */



/**
 * @swagger
 * /solicitud:
 *   post:
 *     summary: Crear una nueva solicitud de trámite
 *     tags: [Solicitudes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - dniSolicitante
 *               - nombreSolicitante
 *               - correoSolicitante
 *               - celularSolicitante
 *               - direccionSolicitante
 *               - fechaMatrimonio
 *               - municipalidad
 *               - distrito
 *             properties:
 *               dniSolicitante:
 *                 type: string
 *                 example: "70369866"
 *               nombreSolicitante:
 *                 type: string
 *                 example: "Neisser Arilson Moreno Sanchez"
 *               correoSolicitante:
 *                 type: string
 *                 example: "neisser261995@gmail.com"
 *               celularSolicitante:
 *                 type: string
 *                 example: "929552761"
 *               direccionSolicitante:
 *                 type: string
 *                 example: "Pasaje tumi 111 el cortijo"
 *               dniConyuge:
 *                 type: string
 *                 example: "12345678"
 *               nombreConyuge:
 *                 type: string
 *                 example: "Mayra Couto"
 *               correoConyuge:
 *                 type: string
 *                 example: "mayra2025@gmail.com"
 *               celularConyuge:
 *                 type: string
 *                 example: "987654321"
 *               fechaMatrimonio:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-05-31T05:00:00.000Z"
 *               municipalidad:
 *                 type: number
 *                 example: 1
 *               distrito:
 *                 type: number
 *                 example: 10
 *               id:
 *                 type: string
 *                 example: ""
 *     responses:
 *       201:
 *         description: Solicitud creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Solicitud creada exitosamente
 *       400:
 *         description: Error en los datos enviados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Faltan campos requeridos
 *       500:
 *         description: Error en el servidor
 */

router.post("/", solicitudController.crearSolicitud);

/**
 * @swagger
 * /solicitud:
 *   get:
 *     summary: Obtener todas las solicitudes
 *     tags: [Solicitudes]
 *     responses:
 *       200:
 *         description: Lista de solicitudes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Error del servidor
 */

router.get("/", solicitudController.listarSolicitudes);

/**
 * @swagger
 * /solicitud/{id}/estado:
 *   put:
 *     summary: Actualizar el estado de una solicitud
 *     tags: [Solicitudes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la solicitud
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               estado:
 *                 type: number
 *                 example: 2
 *     responses:
 *       200:
 *         description: Estado actualizado correctamente
 *       404:
 *         description: Solicitud no encontrada
 *       500:
 *         description: Error al actualizar el estado
 */

router.put("/:id/estado", solicitudController.actualizarEstado);

router.put("/:id", solicitudController.actualizarSolicitud);

/**
 * @swagger
 * /solicitud/extraer-recibo:
 *   post:
 *     summary: Extrae texto de una imagen de recibo y devuelve los datos detectados
 *     tags: [Solicitudes]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               recibo:
 *                 type: string
 *                 format: binary
 *                 description: Imagen del recibo de pago
 *     responses:
 *       200:
 *         description: Texto extraído correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 texto:
 *                   type: string
 *                 monto:
 *                   type: string
 *                 fecha:
 *                   type: string
 *                 codigo:
 *                   type: string
 *       400:
 *         description: Error en los datos enviados
 *       500:
 *         description: Error en el servidor
 */
router.post(
  "/extraer-recibo",
  upload.single("recibo"),
  solicitudController.extraerTextoRecibo
);

module.exports = router;
