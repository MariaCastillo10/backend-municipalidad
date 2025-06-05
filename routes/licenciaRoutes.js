const express = require("express");
const router = express.Router();
const licenciaController = require("../controllers/licenciaController");

/**
 * @swagger
 * tags:
 *   name: Licencias
 *   description: Endpoints para gestionar licencias de funcionamiento
 */

/**
 * @swagger
 * /api/licencias:
 *   post:
 *     summary: Crear una nueva licencia de funcionamiento
 *     tags: [Licencias]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - razonSocial
 *               - ruc
 *               - representanteLegal
 *               - dni
 *               - direccion
 *               - giroNegocio
 *               - telefono
 *               - correo
 *               - fechaSolicitud
 *               - estado
 *               - observaciones
 *             properties:
 *               razonSocial:
 *                 type: string
 *               ruc:
 *                 type: string
 *               representanteLegal:
 *                 type: string
 *               dni:
 *                 type: string
 *               direccion:
 *                 type: string
 *               giroNegocio:
 *                 type: string
 *               telefono:
 *                 type: string
 *               correo:
 *                 type: string
 *               fechaSolicitud:
 *                 type: string
 *                 format: date
 *               estado:
 *                 type: number
 *               observaciones:
 *                 type: string
 *     responses:
 *       201:
 *         description: Licencia registrada con éxito
 *       500:
 *         description: Error al registrar la licencia
 */
router.post("/", licenciaController.crearLicencia);

/**
 * @swagger
 * /api/licencias:
 *   get:
 *     summary: Listar todas las licencias
 *     tags: [Licencias]
 *     responses:
 *       200:
 *         description: Lista de licencias
 *       500:
 *         description: Error al obtener las licencias
 */
router.get("/", licenciaController.listarLicencias);

/**
 * @swagger
 * /api/licencias/{id}/estado:
 *   put:
 *     summary: Actualizar el estado de una licencia
 *     tags: [Licencias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la licencia
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - estado
 *             properties:
 *               estado:
 *                 type: number
 *     responses:
 *       200:
 *         description: Estado actualizado correctamente
 *       404:
 *         description: Licencia no encontrada
 *       500:
 *         description: Error al actualizar el estado
 */
router.put("/:id/estado", licenciaController.actualizarEstado);

/**
 * @swagger
 * /api/licencias/{id}:
 *   put:
 *     summary: Editar una licencia de funcionamiento
 *     tags: [Licencias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la licencia a editar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               razonSocial:
 *                 type: string
 *               ruc:
 *                 type: string
 *               representanteLegal:
 *                 type: string
 *               dni:
 *                 type: string
 *               direccion:
 *                 type: string
 *               giroNegocio:
 *                 type: string
 *               telefono:
 *                 type: string
 *               correo:
 *                 type: string
 *               fechaSolicitud:
 *                 type: string
 *                 format: date
 *               estado:
 *                 type: number
 *               observaciones:
 *                 type: string
 *     responses:
 *       200:
 *         description: Licencia actualizada correctamente
 *       404:
 *         description: Licencia no encontrada
 *       500:
 *         description: Error al actualizar la licencia
 */
router.put("/:id", licenciaController.editarLicencia);

module.exports = router;
