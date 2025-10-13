// TODO: al activar BD, vincular con tabla "plantillas_encuestas" y "encuestas_creadas".

export const plantillas = [
  {
    id: "clima360",
    nombre: "Clima360 Insight",
    descripcion: "Diagnóstico integral del clima laboral y bienestar organizacional.",
    categoria: "Clima laboral",
    icon: "🌡️",
    preguntas: [
      {
        id: 1,
        texto: "La tasa de rotación está dentro de los estándares aceptables.",
        tipo: "escala_1_5",
        variable: "rotacion",
        opciones: []
      },
      {
        id: 2,
        texto: "El absentismo no afecta significativamente la productividad.",
        tipo: "escala_1_5",
        variable: "absentismo",
        opciones: []
      },
      {
        id: 3,
        texto: "Los empleados alcanzan consistentemente los objetivos de productividad establecidos.",
        tipo: "escala_1_5",
        variable: "productividad",
        opciones: []
      },
      {
        id: 4,
        texto: "El liderazgo contribuye positivamente a la retención de talento.",
        tipo: "escala_1_5",
        variable: "liderazgo",
        opciones: []
      },
      {
        id: 5,
        texto: "La comunicación interna es clara, transparente y efectiva.",
        tipo: "escala_1_5",
        variable: "comunicacion",
        opciones: []
      },
      {
        id: 6,
        texto: "Ofrecemos oportunidades de desarrollo profesional y movilidad interna.",
        tipo: "escala_1_5",
        variable: "desarrollo",
        opciones: []
      },
      {
        id: 7,
        texto: "Los empleados reciben reconocimiento oportuno y feedback constructivo.",
        tipo: "escala_1_5",
        variable: "reconocimiento",
        opciones: []
      },
      {
        id: 8,
        texto: "Promovemos una cultura de bienestar y equilibrio vida-trabajo.",
        tipo: "escala_1_5",
        variable: "bienestar",
        opciones: []
      },
      {
        id: 9,
        texto: "La empresa se adapta eficazmente a los cambios.",
        tipo: "escala_1_5",
        variable: "adaptabilidad",
        opciones: []
      },
      {
        id: 10,
        texto: "Los empleados muestran sentido de pertenencia y compromiso.",
        tipo: "escala_1_5",
        variable: "pertenencia",
        opciones: []
      }
    ],
    metricas: [
      {
        id: 11,
        texto: "Tasa de rotación anual",
        tipo: "opcion_multiple",
        opciones: ["<5%", "5–10%", "11–15%", ">15%"],
        valores: [5, 4, 3, 1]
      },
      {
        id: 12,
        texto: "Tasa de absentismo",
        tipo: "opcion_multiple",
        opciones: ["Bajo", "Medio", "Alto"],
        valores: [5, 3, 1]
      },
      {
        id: 13,
        texto: "Índice de productividad",
        tipo: "opcion_multiple",
        opciones: ["Muy alta", "Alta", "Media", "Baja", "Muy baja"],
        valores: [5, 4, 3, 2, 1]
      }
    ]
  },
  {
    id: "bienestarBasico",
    nombre: "Pulse Bienestar Básico",
    descripcion: "Mini encuesta mensual sobre bienestar y motivación general.",
    categoria: "Bienestar emocional",
    icon: "💚",
    preguntas: [
      {
        id: 1,
        texto: "¿Cómo te sientes en general con tu trabajo esta semana?",
        tipo: "escala_1_5",
        variable: "satisfaccion_semanal",
        opciones: []
      },
      {
        id: 2,
        texto: "¿Te sientes motivado y comprometido con tus tareas?",
        tipo: "escala_1_5",
        variable: "motivacion",
        opciones: []
      },
      {
        id: 3,
        texto: "¿Sientes que tu carga de trabajo es manejable?",
        tipo: "si_no",
        variable: "carga_manejable",
        opciones: []
      },
      {
        id: 4,
        texto: "¿Qué es lo que más afecta tu bienestar laboral actualmente?",
        tipo: "opcion_multiple",
        variable: "factor_bienestar",
        opciones: ["Estrés", "Carga de trabajo", "Ambiente laboral", "Falta de reconocimiento", "Otro"]
      },
      {
        id: 5,
        texto: "¿Tienes algún comentario o sugerencia sobre tu bienestar en el trabajo?",
        tipo: "texto_abierto",
        variable: "comentarios",
        opciones: []
      }
    ],
    metricas: []
  },
  {
    id: "satisfaccionLaboral",
    nombre: "Satisfacción Laboral Integral",
    descripcion: "Evaluación completa de la satisfacción del empleado en diferentes áreas.",
    categoria: "Satisfacción general",
    icon: "⭐",
    preguntas: [
      {
        id: 1,
        texto: "¿Qué tan satisfecho estás con tu rol actual?",
        tipo: "escala_1_5",
        variable: "satisfaccion_rol",
        opciones: []
      },
      {
        id: 2,
        texto: "¿Consideras que recibes un salario justo por tu trabajo?",
        tipo: "si_no",
        variable: "salario_justo",
        opciones: []
      },
      {
        id: 3,
        texto: "¿Cómo calificarías la relación con tu supervisor inmediato?",
        tipo: "escala_1_5",
        variable: "relacion_supervisor",
        opciones: []
      },
      {
        id: 4,
        texto: "¿Te sientes valorado por tu trabajo y contribución?",
        tipo: "escala_1_5",
        variable: "sentido_valor",
        opciones: []
      },
      {
        id: 5,
        texto: "¿Qué aspecto de tu trabajo te genera mayor satisfacción?",
        tipo: "opcion_multiple",
        variable: "aspecto_satisfactorio",
        opciones: ["Desafíos del puesto", "Compañeros de trabajo", "Autonomía", "Impacto del trabajo", "Beneficios y compensación"]
      },
      {
        id: 6,
        texto: "¿Recomendarías esta empresa como un lugar para trabajar?",
        tipo: "si_no",
        variable: "recomendaria_empresa",
        opciones: []
      },
      {
        id: 7,
        texto: "¿Qué cambio tendría el mayor impacto positivo en tu satisfacción laboral?",
        tipo: "texto_abierto",
        variable: "cambio_sugerido",
        opciones: []
      }
    ],
    metricas: []
  }
];
