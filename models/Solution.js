// backend/models/Solution.js

const mongoose = require("mongoose");

/**
 * @swagger
 * components:
 *   schemas:
 *     Solution:
 *       type: object
 *       required:
 *         - user
 *         - exercise
 *         - code
 *         - feedback
 *       properties:
 *         _id:
 *           type: string
 *           description: ID único de la solución
 *           example: 60d0fe4f5311236168a109cc
 *         user:
 *           type: string
 *           description: ID del usuario que envió la solución
 *           example: 60d0fe4f5311236168a109ca
 *         exercise:
 *           type: string
 *           description: ID del ejercicio al que pertenece la solución
 *           example: 60d0fe4f5311236168a109cb
 *         code:
 *           type: string
 *           description: Código enviado por el usuario
 *           example: |
 *             public class Main {
 *                 public static void main(String[] args) {
 *                     // Código de ejemplo
 *                 }
 *             }
 *         feedback:
 *           type: string
 *           description: Feedback recibido tras la evaluación
 *           example: "Solución correcta. Buen uso de la encapsulación."
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación de la solución
 *           example: 2023-09-23T07:00:00.000Z
 */

const SolutionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  exercise: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exercise",
    required: true,
  },
  code: { type: String, default: ""  },
  feedback: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  stdout: { type: String }, 
  stderr: { type: String }, 
  compile_output: { type: String }, 
  messages: [
    {
      sender: { type: String, required: true }, 
      content: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model("Solution", SolutionSchema);
