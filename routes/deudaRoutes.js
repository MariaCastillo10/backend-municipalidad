const express = require("express");
const router = express.Router();
const deudaController = require("../controllers/deudaController");

router.post("/", deudaController.crearDeuda);
router.get("/:dni", deudaController.buscarPorDNI);

module.exports = router;
