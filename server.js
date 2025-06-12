const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swaggerConfig");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    ssl: true,
  })
  .then(() => console.log("Conectado a MongoDB"))
  .catch((err) => {
    console.error("Error de conexión:", err);
    process.exit(1);
  });

const authRoutes = require("./routes/authRoutes");
const exerciseRoutes = require("./routes/exerciseRoutes");
const solicitudRoutes = require("./routes/solicitudRoutes");
const licenciaRoutes = require("./routes/licenciaRoutes");
const notificacionRoutes = require("./routes/notificacionRoutes");
const permisoRoutes = require("./routes/permisoRoutes");
const deudaRoutes = require("./routes/deudaRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/exercises", exerciseRoutes);
app.use("/api/solicitud", solicitudRoutes);
app.use("/api/licencia", licenciaRoutes);
app.use("/api/pendientes", notificacionRoutes);
app.use("/api/permiso", permisoRoutes);
app.use("/api/deuda", deudaRoutes);

app.get("/", (req, res) => {
  res.send("API Municipalidad el Porvenir");
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
require("./job/recordatorioFirma");
require("./job/recordatorioPermiso");

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
  console.log(
    `Documentación de Swagger disponible en http://localhost:${PORT}/api-docs`
  );
});
