// backend/config/swaggerConfig.js

const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Municipalidad El Porvenir",
      version: "1.0.0",
      description:
        "Documentación de la API para la aplicación educativa de POO con IA",
    },
    servers: [
      {
        url: "http://localhost:5001/api",
        description: "Servidor de Desarrollo",
      },
      {
        url: "https://tu-dominio-production.com/api",
        description: "Servidor de Producción",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: {
              type: "string",
              example: "60d0fe4f5311236168a109ca",
            },
            nombres: {
              type: "string",
              example: "Juan",
            },
            apellidos: {
              type: "string",
              example: "Perez",
            },
            email: {
              type: "string",
              example: "juanperez@example.com",
            },
            role: {
              type: "string",
              enum: ["student", "instructor"],
              example: "student",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2023-09-23T06:57:20.975Z",
            },
          },
        },
        Exercise: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "60d0fe4f5311236168a109cb",
            },
            title: {
              type: "string",
              example: "Ejercicio Nivel 2",
            },
            description: {
              type: "string",
              example: "Descripción detallada del ejercicio de POO en Java.",
            },
            difficulty: {
              type: "integer",
              enum: [1, 2, 3],
              example: 2,
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2023-09-23T06:57:20.975Z",
            },
            expected_output: {
              type: "string",
              example: "Salida esperada del ejercicio.",
            },
          },
        },
        Solution: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "60d0fe4f5311236168a109cc",
            },
            user: {
              $ref: "#/components/schemas/User",
            },
            exercise: {
              $ref: "#/components/schemas/Exercise",
            },
            code: {
              type: "string",
              example:
                "public class Main { public static void main(String[] args) { /* Código */ } }",
            },
            feedback: {
              type: "string",
              example: "Solución correcta.",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2023-09-23T07:00:00.000Z",
            },
          },
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js", "./models/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
