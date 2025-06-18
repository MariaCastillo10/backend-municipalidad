const express = require("express");
const router = express.Router();
const deudaController = require("../controllers/deudaController");

router.post("/", deudaController.crearDeuda);
router.get("/:dni", deudaController.buscarPorDNI);
router.get("/enviar-correo/:id", deudaController.enviarCorreoConDeuda);

module.exports = router;
