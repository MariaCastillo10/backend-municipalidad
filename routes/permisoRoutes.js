const express = require("express");
const router = express.Router();
const permisoController = require("../controllers/permisoController");

// @route POST /api/permiso
router.post("/", permisoController.crearPermiso);

// @route GET /api/permiso
router.get("/", permisoController.listarPermisos);

// @route PUT /api/permiso/:id
router.put("/:id", permisoController.actualizarPermiso);

// @route PUT /api/permiso/:id/estado
router.put("/:id/estado", permisoController.actualizarEstado);

module.exports = router;
