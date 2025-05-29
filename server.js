// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swaggerConfig"); // Importar la configuración de Swagger

// Cargar las variables de entorno
dotenv.config();

// Crear la aplicación de Express
const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Conectar a MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    ssl: true,
  })
  .then(() => console.log("Conectado a MongoDB"))
  .catch((err) => {
    console.error("Error de conexión:", err);
    process.exit(1); // Salir del proceso si no se puede conectar a la base de datos
  });

// Rutas de la API
const authRoutes = require("./routes/authRoutes");
const exerciseRoutes = require("./routes/exerciseRoutes");

// Definir las rutas
app.use("/api/auth", authRoutes);
app.use("/api/exercises", exerciseRoutes);

// Ruta principal para probar el servidor
app.get("/", (req, res) => {
  res.send("API Educativa POO con IA");
});
// Ruta para la documentación de Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
  console.log(
    `Documentación de Swagger disponible en http://localhost:${PORT}/api-docs`
  );
});
