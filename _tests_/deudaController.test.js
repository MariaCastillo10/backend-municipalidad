const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const Deuda = require("../models/Deuda");
const deudaController = require("../controllers/deudaController");

const app = express();
app.use(express.json());

// ⚙️ Rutas simuladas
app.post("/api/deuda", deudaController.crearDeuda);
app.get("/api/deuda/:dni", deudaController.buscarPorDNI);

beforeAll(async () => {
  const { MongoMemoryServer } = require("mongodb-memory-server");
  const mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoose.connection.close();
});

afterEach(async () => {
  await Deuda.deleteMany();
});

describe("POST /api/deuda", () => {
  jest.setTimeout(15000);
  it("debería registrar una nueva deuda", async () => {
    const deuda = {
      dni: "12345678",
      nombres: "Juan Perez",
      concepto: "Pago matrícula",
      monto: 100,
      fechaEmision: "2024-06-01",
      fechaVencimiento: "2024-07-01",
      estado: 1,
      observaciones: "",
      correo: "juan@mail.com",
    };

    const res = await request(app).post("/api/deuda").send(deuda);
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("Deuda registrada con éxito");

    const dbDeuda = await Deuda.findOne({ dni: "12345678" });
    expect(dbDeuda).not.toBeNull();
    expect(dbDeuda.nombres).toBe("Juan Perez");
  }, 10000);
});

describe("GET /api/deuda/:dni", () => {
  it("debería devolver deudas para un DNI existente", async () => {
    await Deuda.create({
      dni: "87654321",
      nombres: "Maria Lopez",
      concepto: "Pago de trámite",
      monto: 80,
      fechaEmision: "2024-06-10",
      fechaVencimiento: "2024-07-10",
      estado: 1,
      observaciones: "",
      correo: "maria@mail.com",
    });

    const res = await request(app).get("/api/deuda/87654321");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].nombres).toBe("Maria Lopez");
  });

  it("debería devolver 404 si no hay deudas para el DNI", async () => {
    const res = await request(app).get("/api/deuda/00000000");
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe("No se encontraron deudas para este DNI");
  });
});
