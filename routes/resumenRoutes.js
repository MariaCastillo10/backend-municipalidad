const express = require("express");
const router = express.Router();
const controller = require("../controllers/resumenController");

router.post("/", controller.crearNotificacion);
router.get("/", controller.listarNotificaciones);

module.exports = router;
