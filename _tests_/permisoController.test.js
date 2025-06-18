const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const Permiso = require("../models/Permiso");
const permisoController = require("../controllers/permisoController");

const app = express();
app.use(express.json());

// ⚙️ Rutas simuladas
app.post("/api/permiso", permisoController.crearPermiso);

let mongoServer;

beforeAll(async () => {
  const { MongoMemoryServer } = require("mongodb-memory-server");
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Permiso.deleteMany();
});

describe("POST /api/permiso", () => {
  jest.setTimeout(15000);

  it("debería registrar un nuevo permiso correctamente", async () => {
    const permiso = {
      tipo: 1,
      fecha: "2025-06-17T10:00:00Z",
      lugar: 1,
      horario: "2025-06-17T10:15:00Z",
      aforo: 150,
      estado: 1,
      correo: "test@correo.com",
    };

    const res = await request(app).post("/api/permiso").send(permiso);

    expect(res.statusCode).toBe(201);
    expect(res.body.mensaje).toBe("Permiso registrado con éxito");

    const permisosEnBD = await Permiso.find();
    expect(permisosEnBD.length).toBe(1);
    expect(permisosEnBD[0].correo).toBe("test@correo.com");
  });

  it("debería rechazar un permiso si ya hay uno en esa hora y lugar", async () => {
    const permiso1 = {
      tipo: 2,
      fecha: "2025-06-17T14:00:00Z",
      lugar: 2,
      horario: "2025-06-17T14:30:00Z",
      aforo: 120,
      estado: 1,
      correo: "correo1@test.com",
    };

    const permiso2 = {
      tipo: 1,
      fecha: "2025-06-17T14:00:00Z",
      lugar: 2,
      horario: "2025-06-17T14:45:00Z",
      aforo: 50,
      estado: 1,
      correo: "correo2@test.com",
    };

    await request(app).post("/api/permiso").send(permiso1);
    const res = await request(app).post("/api/permiso").send(permiso2);

    expect(res.statusCode).toBe(400);
    expect(res.body.mensaje).toBe("El espacio ya está reservado en esa hora.");
  });
});
