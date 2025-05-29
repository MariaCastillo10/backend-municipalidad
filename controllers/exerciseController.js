// backend/controllers/exerciseController.js
const Exercise = require("../models/Exercise");
const Solution = require("../models/Solution");
const User = require("../models/User");
const mongoose = require("mongoose");
const axios = require("axios");

const predefinedExercises = {
  1: [
    { title: "Ejercicio 1: Crear una Clase", description: "Crea una clase llamada Persona con los atributos nombre y edad, y además incluye el método main para ejecutar el ejercicio,y por ultimo que no considere los métodos get y set, toString u otros porque no se pide." },
    { title: "Ejercicio 2: Métodos Getters y Setters", description: "Añade métodos getters y setters para los atributos nombre y edad en la clase Persona. Por ultimo no consideres otros métodos como toString o constructor." },
    { title: "Ejercicio 3: Constructor", description: "Añade un constructor a la clase Persona que inicialice los atributos nombre y edad." },
    { title: "Ejercicio 4: Método toString", description: "Añade un método toString a la clase Persona que devuelva una cadena con el nombre y la edad de la persona." },
    { title: "Ejercicio 5: Herencia", description: "Crea una clase Estudiante que herede de Persona y añada el atributo matricula." },
    { title: "Ejercicio 6: Sobrescribir Métodos", description: "Sobrescribe el método toString en la clase Estudiante para incluir la matrícula." },
    { title: "Ejercicio 7: Polimorfismo", description: "Crea una clase Profesor que herede de Persona y añada el atributo departamento. Crea un método impartirClase en Profesor." },
    { title: "Ejercicio 8: Interfaces", description: "Crea una interfaz Trabajador con el método trabajar. Implementa la interfaz en las clases Estudiante y Profesor." },
    { title: "Ejercicio 9: Clases Abstractas", description: "Crea una clase abstracta Animal con el método abstracto hacerSonido. Crea clases Perro y Gato que hereden de Animal e implementen el método hacerSonido." },
    { title: "Ejercicio 10: Manejo de Excepciones", description: "Añade manejo de excepciones a la clase Persona para validar que la edad sea un número positivo." },
  ],
  2: [
    { title: "Ejercicio 1: Encapsulación y Visibilidad", description: "Aplica modificadores de acceso en los atributos de la clase Persona (private para nombre y edad). Crea métodos getNombre y getEdad." },
    { title: "Ejercicio 2: Métodos Estáticos", description: "Añade un método estático en Persona, totalPersonas(), que devuelva el número total de instancias creadas." },
    { title: "Ejercicio 3: Sobrecarga de Constructores", description: "Crea dos constructores en Persona, uno que reciba solo nombre y otro que reciba nombre y edad." },
    { title: "Ejercicio 4: Sobrecarga de Métodos", description: "Implementa un método mostrarInfo en Persona que devuelva la información de nombre o nombre y edad según los parámetros pasados." },
    { title: "Ejercicio 5: Clases Internas", description: "Crea una clase interna Direccion en Persona, con atributos calle y ciudad. Método getDireccion() debe devolver la dirección completa." },
    { title: "Ejercicio 6: Excepciones Personalizadas", description: "Crea una excepción personalizada EdadNegativaException. Lanza esta excepción si la edad en Persona es negativa." },
    { title: "Ejercicio 7: Colecciones y Generics", description: "Crea una lista de objetos Persona y ordena por edad usando una función de comparación." },
    { title: "Ejercicio 8: Manejo de Archivos (Sin librerías externas)", description: "Descripción: Implementa un programa que guarde información de objetos en un archivo de texto y los lea posteriormente. Entrada: Datos de varias personas proporcionados como cadenas. Salida: Contenido del archivo leído y desglosado." },
    { title: "Ejercicio 9: Estructuras en Texto (Serialización manual)", description: "Serializa manualmente un objeto Persona a un formato similar a JSON (usando solo cadenas) y luego deserialízalo. Entrada: Un objeto Persona (representado por tres atributos: nombre, edad y pais). Salida: Cadena similar a JSON y recuperación del objeto." },
    { title: "Ejercicio 10: Filtrado con funciones personalizadas", description: "Implementa una función para filtrar manualmente personas mayores de cierta edad en una lista sin usar lambdas ni funciones predefinidas como filter. Entrada: Lista de personas representadas como tuplas (nombre, edad, pais) y un entero como límite de edad. Salida: Lista filtrada de personas mayores a la edad dada." },
  ],
  3: [
    { title: "Ejercicio 1: Singleton", description: "Implementa Singleton en PersonaManager y prueba que solo se crea una instancia." },
    { title: "Ejercicio 2: Factory", description: "Crea una fábrica para instanciar Persona o sus subclases." },
    { title: "Ejercicio 3: Observer", description: "Usa Observer para notificar cambios de nombre en Persona a un registro de cambios." },
    { title: "Ejercicio 4: Multihilo", description: "Calcula promedio de edades en paralelo en una lista grande de Persona." },
    { title: "Ejercicio 5: Comunicación entre Procesos", description: "Implementa una comunicación entre dos procesos (hilos) donde uno envía un objeto Persona a otro para que lo imprima. Entrada: Un objeto Persona con los campos nombre y edad. Salida: El hilo receptor debe imprimir los detalles del objeto Persona recibido." },
    { title: "Ejercicio 6: Refactoring", description: "Mejora el código de la clase Persona para seguir principios de diseño limpio, como la cohesión y la separación de responsabilidades. Entrada: Código inicial de la clase Persona, que puede tener métodos que realicen múltiples tareas (por ejemplo, lógica de validación de edad, y la creación del objeto). Salida: Código refactorizado con los principios de diseño limpio, donde se separan las responsabilidades y se mejora la legibilidad." },
    { title: "Ejercicio 7: Pruebas Unitarias", description: "Descripción: Crea pruebas unitarias manuales para la clase Persona. Esta clase tiene métodos que calculan o validan datos, como un método que verifica si la edad es válida. La prueba debe ejecutarse sin usar bibliotecas externas de pruebas (como JUnit). Para realizar las pruebas, debes invocar directamente los métodos y comparar los resultados con los valores esperados. Métodos:  Persona(String nombre, int edad): Constructor que inicializa el nombre y la edad. int getEdad(): Método que devuelve la edad de la persona. boolean esEdadValida(): Método que devuelve true si la edad es válida (número positivo y menor o igual a 120); de lo contrario, devuelve false. Métodos a probar: getEdad(): Verifica que este método devuelva la edad correcta. esEdadValida(): Verifica que el método devuelva true para edades válidas (de 0 a 120), y false para edades inválidas (por ejemplo, -1 o 121)." },
    { title: "Ejercicio 8: Inversión de Dependencias", description: "Usa interfaces para que la clase Persona dependa de abstracciones y no de implementaciones concretas. Entrada: La clase Persona que depende directamente de otras clases. Salida: Código refactorizado donde se utiliza una interfaz para reducir el acoplamiento." },
    { title: "Ejercicio 9: Refactorización de Código según Principios SOLID", description: "Refactoriza una clase Persona que contiene tanto los atributos de la persona como el cálculo de la edad y la validación de datos. Tu objetivo es aplicar los principios SOLID para hacer el código más limpio, mantenible y escalable. Entrada: Un código de la clase Persona que contiene tanto los datos de la persona como las validaciones y cálculos dentro de la misma clase." },
    { title: "Ejercicio 10: CRUD Básico en Java", description: "Implementa un sistema CRUD (Crear, Leer, Actualizar, Eliminar) simple para gestionar objetos Persona. No necesitas usar bases de datos ni frameworks externos, solo listas en memoria. Entrada: Un conjunto de acciones que puedes realizar sobre una lista de personas, como agregar nuevas personas, mostrar todas las personas, actualizar datos de una persona o eliminarla. Salida: El sistema debe permitir las siguientes operaciones: Crear una persona. Leer (mostrar) todas las personas. Actualizar los detalles de una persona. Eliminar a una persona de la lista." },
  ]
};

exports.getAllExercises = async (req, res) => {
  try {
    const exercises = await Exercise.find().sort({ difficulty: 1 });
    res.json(exercises);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los ejercicios" });
  }
};

exports.getExercisesByUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    const exercises = await Exercise.find({ user: userId, active: true }).sort({ createdAt: -1 });
    res.json(exercises);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los ejercicios del usuario" });
  }
};

exports.getExerciseById = async (req, res) => {
  const exerciseId = req.params.id;

  try {
    const exercise = await Exercise.findOne({ _id: exerciseId, active: true });
    if (!exercise) {
      return res.status(404).json({ error: "Ejercicio no encontrado" });
    }
    res.json(exercise); 
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el ejercicio" });
  }
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const retryRequest = async (fn, retries = 3, delayTime = 1000) => {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) throw error;
    await delay(delayTime);
    return retryRequest(fn, retries - 1, delayTime);
  }
};

exports.generateExercise = async (req, res) => {
  const { difficulty, userId } = req.body; 

  if (!predefinedExercises[difficulty]) {
    return res.status(400).json({ error: "Nivel de dificultad no válido" });
  }

  try {


    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Verificar si el puntaje del usuario es menor a 350
    if (user.points < 350) {
      // Restablecer los ejercicios del usuario
      await Exercise.updateMany({ user: userId, difficulty }, { active: false });

      // Restablecer el puntaje del usuario
      user.points = 600;
      await user.save();

      return res.status(400).json({ error: "Tu puntaje es menor a 350, por lo tanto se ha restablecido el nivel." });
    }

    const unfinishedExercise = await Exercise.findOne({
      user: userId,
      status: { $in: ["En proceso", "Requiere revisión"] },
      active: true,
    });

    if (unfinishedExercise) {
      return res.status(400).json({
        error: `Debes de terminar el ejercicio actual.`,
      });
    }

    if (difficulty === 2) {
      const completedLevel1Count = await Exercise.countDocuments({
        difficulty: 1,
        user: userId,
        status: "Completado",
        active: true,
      });
      if (completedLevel1Count < 10) {
        return res.status(400).json({ error: "Debes completar el nivel Básico" });
      }
    }

    if (difficulty === 3) {
      const completedLevel1Count = await Exercise.countDocuments({
        difficulty: 1,
        user: userId,
        status: "Completado",
        active: true,
      });

      const completedLevel2Count = await Exercise.countDocuments({
        difficulty: 2,
        user: userId,
        status: "Completado",
        active: true,
      });
      if (completedLevel1Count < 10 || completedLevel2Count < 10) {
        return res.status(400).json({ error: "Debes completar el nivel Intermedio" });
      }
    }

    const existingExercisesCount = await Exercise.countDocuments({
      difficulty,
      user: userId,
      active: true,
    });

    if (existingExercisesCount >= 10) {
      return res.status(400).json({
        error: "Se ha alcanzado el límite de 10 ejercicios para este nivel",
      });
    }

    const nextExercise = predefinedExercises[difficulty][existingExercisesCount];

    const prompt = `Genera un ejercicio de Programación Orientada a Objetos en Java con el siguiente título y descripción:\n\nTítulo: ${nextExercise.title}\nDescripción: ${nextExercise.description}\n\nAsegúrate de incluir todas las importaciones necesarias para que el código pueda compilarse correctamente, y no incluyas la solución (código fuente), solo plantea el ejercicio.`;

    const response = await retryRequest(() =>
      axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 600,
          temperature: 0.5
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            "OpenAI-Organization": process.env.OPENAI_ORG_ID,
            "OpenAI-Project": process.env.OPENAI_PROJECT_ID,
          },
        }
      )
    );

    const exerciseContent = response.data.choices[0].message.content.trim();
    const [subtitle, ...descriptionParts] = exerciseContent.split('\n');
    const exerciseDescription = descriptionParts.join('\n').trim();

    const newExercise = new Exercise({
      title: nextExercise.title,
      subtitle: subtitle.trim(), // Guardar el subtítulo
      description: exerciseDescription,
      difficulty,
      user: userId,
      status: "En proceso", // Establecer el estado inicial
      active: true,
    });

    await newExercise.save();

    res.status(201).json({
      exercise: {
        title: newExercise.title,
        subtitle: newExercise.subtitle,
        description: newExercise.description,
        difficulty: newExercise.difficulty,
        status: newExercise.status,
        id: newExercise._id,
      }
    });
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Error al generar el ejercicio" });
  }
};

exports.getHelp = async (req, res) => {
  const exerciseId = req.params.id;
  const userId = req.params.userId;

  try {
    const exercise = await Exercise.findById(exerciseId);
    if (!exercise) {
      return res.status(404).json({ error: "Ejercicio no encontrado" });
    }

    if (exercise.numberHelp >= 2) {
      return res.status(400).json({ error: "Ya superaste la ayuda para este ejercicio" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Reducir puntos del usuario
    user.points -= 10;
    await user.save();

    let prompt;
    if (exercise.numberHelp === 0) {
      prompt = `
        Proporciona solo la estructura inicial de la clase para este ejercicio de Programación Orientada a Objetos en Java (Código fuente, si el ejercicio es pequeño aun asi solo considera la parte inicial, no resuelvas todo), sin resolver completamente el ejercicio.
        
        Título: ${exercise.title}
        Descripción: ${exercise.description}
        
        Ejemplo:
        public class Persona {
            // Atributos
            String nombre;
            int edad;

            public static void main(String[] args) {
                // Método main vacío para que el usuario lo complete.
            }
        }
      `;
    } else if (exercise.numberHelp === 1) {
      prompt = `
        Proporciona una solución más completa para que se diferencie de la primera ayuda, centraté mas en proporcionar el codgio fuente y no tanto en explicar la solución. El codigo
        debe ser funcional por lo que debes de considerar el método Main, puedes dar la solución casi al 90%.
        
        Título: ${exercise.title}
        Descripción: ${exercise.description}
        
        Ejemplo:
        public class Persona {
            String nombre;
            int edad;

            public static void main(String[] args) {
                Persona persona1 = new Persona();
                persona1.nombre = "Juan"; // Asignar nombre
                persona1.edad = 25;       // Asignar edad

                System.out.println("Nombre: " + persona1.nombre);
                System.out.println("Edad: " + persona1.edad);
            }
        }
      `;
    } else {
      prompt = `
        Proporciona un ejemplo más detallado que incluya buenas prácticas o expansiones opcionales del código, sin resolver completamente el ejercicio.
        
        Título: ${exercise.title}
        Descripción: ${exercise.description}
        
        Ejemplo:
        public class Persona {
            String nombre;
            int edad;

            public Persona(String nombre, int edad) {
                this.nombre = nombre;
                this.edad = edad;
            }

            public static void main(String[] args) {
                Persona persona1 = new Persona("Juan", 25);
                Persona persona2 = new Persona("María", 30);

                System.out.println("Nombre: " + persona1.nombre + ", Edad: " + persona1.edad);
                System.out.println("Nombre: " + persona2.nombre + ", Edad: " + persona2.edad);
            }
        }
      `;
    }

    // Solicitar a OpenAI el contenido de la ayuda
    const response = await retryRequest(() =>
      axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 500,
          temperature: 0.5,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            "OpenAI-Organization": process.env.OPENAI_ORG_ID,
            "OpenAI-Project": process.env.OPENAI_PROJECT_ID,
          },
        }
      )
    );

    const helpContent = response.data.choices[0].message.content.trim();

    exercise.numberHelp += 1;
    await exercise.save();

        // Guardar la ayuda generada en la base de datos
        const newSolution = new Solution({
          user: userId,
          exercise: exerciseId,
          code: "", // No hay código en la ayuda, solo feedback
          feedback: helpContent,
          stdout: "",
          stderr: "",
          compile_output: "",
        });
    
        await newSolution.save();

    res.status(200).json({ help: helpContent, points: user.points });
  } catch (error) {
    console.error("Error al obtener la ayuda:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Error al obtener la ayuda", details: error.message });
  }
};

exports.getSolutionByExerciseAndUser = async (req, res) => {
  const { exerciseId, userId } = req.params;

  try {
    const solutions = await Solution.find({
      exercise: new mongoose.Types.ObjectId(exerciseId),
      user: new mongoose.Types.ObjectId(userId),
    })
      .sort({ createdAt: 1 }) 
      .select("code feedback createdAt"); 

    if (!solutions || solutions.length === 0) {
      const exercise = await Exercise.findById(exerciseId);
      if (!exercise) {
        return res.status(404).json({ error: "Ejercicio no encontrado" });
      }

      return res.json({
        exercise: {
          id: exercise._id,
          title: exercise.title,
          description: exercise.description,
          subtitle: exercise.subtitle,
          difficulty: exercise.difficulty,
        },
        solutions: [], 
      });
    }

    const exercise = await Exercise.findById(exerciseId);
    if (!exercise) {
      return res.status(404).json({ error: "Ejercicio no encontrado" });
    }

    const combinedResult = {
      exercise: {
        id: exercise._id,
        title: exercise.title,
        description: exercise.description,
        subtitle: exercise.subtitle,
        difficulty: exercise.difficulty,
      },
      solutions, 
    };

    return res.json(combinedResult);
  } catch (error) {
    console.error("Error al obtener las soluciones:", error);
    res.status(500).json({ error: "Error al obtener las soluciones o el ejercicio" });
  }
};

exports.submitSolution = async (req, res) => {
  const exerciseId = req.params.id;
  const { code } = req.body;
  const userId = req.user._id;

  try {
    const exercise = await Exercise.findById(exerciseId);
    if (!exercise)
      return res.status(404).json({ error: "Ejercicio no encontrado" });

    const adjustedCode = code.replace(/public\s+class/g, 'class');

    const base64Code = Buffer.from(adjustedCode).toString('base64');

    const expectedOutput = exercise.expected_output
      ? Buffer.from(exercise.expected_output).toString('base64')
      : "";

    const submissionResponse = await axios.post(
      `${process.env.JUDGE0_API_URL}/submissions?base64_encoded=true`,
      {
        source_code: base64Code,
        language_id: 62,
        stdin: "",
        expected_output: expectedOutput,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
          "x-rapidapi-key": process.env.JUDGE0_API_KEY,
        },
      }
    );

    const token = submissionResponse.data.token;

    let evaluation;
    while (true) {
      const evaluationResponse = await axios.get(
        `${process.env.JUDGE0_API_URL}/submissions/${token}?base64_encoded=true`,
        {
          headers: {
            "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
            "x-rapidapi-key": process.env.JUDGE0_API_KEY,
          },
        }
      );

      evaluation = evaluationResponse.data;

      if (evaluation.status.id >= 3) break; 
      await new Promise((resolve) => setTimeout(resolve, 1000)); 
    }

    const decodeBase64 = (data) => (data ? Buffer.from(data, 'base64').toString('utf-8') : null);
    const stdout = decodeBase64(evaluation.stdout);
    const stderr = decodeBase64(evaluation.stderr);
    const compileOutput = decodeBase64(evaluation.compile_output);

    const openaiPrompt = `
    Aquí tienes la descripción del problema:
      ${exercise.description}

      Salida generada por el código:
      - stdout: ${stdout}
      - stderr: ${stderr}
      - compile_output: ${compileOutput}

      Si el resultado es correcto, proporciona una respuesta de éxito con un breve (muy corto) feedback positivo.
      Si el resultado es incorrecto, explica en lenguaje sencillo el problema en el código, 
      proporciona posibles sugerencias para mejorarlo y comenta si hay errores de sintaxis o lógica (que la respuesta sea corta).
      No proporciones la solución completa, solo orientación y consejos para mejorar el código.
    `;

    const openaiResponse = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: openaiPrompt }],
        max_tokens: 800,
        temperature: 0.7,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const feedback = openaiResponse.data.choices[0].message.content.trim();

    let newStatus = "En proceso";
    if (!stderr && !compileOutput) {
      newStatus = "Completado";
    } else {
      newStatus = "Requiere revisión";
    }
    
    exercise.status = newStatus;
    await exercise.save();

    const newSolution = new Solution({
      user: userId,
      exercise: exerciseId,
      code,
      feedback,
      stdout,
      stderr,
      compile_output: compileOutput,
    });

    await newSolution.save();

        // Verificar el puntaje del usuario después de evaluar la solución
        const user = await User.findById(userId);
        if (user.points < 350) {
          // Restablecer los ejercicios del usuario
          await Exercise.updateMany({ user: userId }, { active: false });
    
          // Restablecer el puntaje del usuario
          user.points = 600;
          await user.save();
    
          return res.status(400).json({ error: "Tu puntaje es menor a 350, por lo tanto se ha restablecido el nivel y puntación." });
        }

    // Responder al cliente
    res.json({
      message: evaluation.status.description,
      feedback,
      stdout,
      stderr,
      compile_output: compileOutput,
      status: newStatus, 
    });
  } catch (error) {
    console.error("Error al evaluar la solución:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Error al evaluar la solución" });
  }
};

exports.getUserPoints = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId).select("points");
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json({ points: user.points });
  } catch (error) {
    console.error("Error al obtener los puntos del usuario:", error);
    res.status(500).json({ error: "Error al obtener los puntos del usuario" });
  }
};