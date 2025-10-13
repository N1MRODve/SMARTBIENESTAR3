// TODO: conectar con tabla "servicios" y endpoint de recomendación dinámica en futuras iteraciones.

export const serviciosMock = [
  {
    id: "liderazgo_consciente",
    nombre: "Programa de Liderazgo Consciente",
    categoria: "Liderazgo",
    duracion: "4 semanas",
    formato: "Híbrido",
    descripcion: "Desarrolla habilidades de liderazgo empático y comunicación efectiva en mandos intermedios.",
    impacto: "Mejora la retención de talento y la cohesión de equipos.",
    imagen: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800",
    objetivos: [
      "Desarrollar competencias de liderazgo empático y situacional",
      "Fortalecer la comunicación efectiva entre líderes y equipos",
      "Implementar técnicas de gestión de conflictos constructivos",
      "Crear una cultura de feedback continuo y desarrollo"
    ],
    impactoDetallado: [
      "Incremento del 40% en la satisfacción del equipo",
      "Reducción del 30% en la rotación de talento clave",
      "Mejora del 35% en la productividad de equipos liderados",
      "Mayor cohesión y colaboración interdepartamental"
    ],
    modalidad: "8 sesiones presenciales + 4 talleres virtuales + seguimiento personalizado",
    participantes: "Hasta 20 mandos intermedios por cohorte",
    icono: "👥"
  },
  {
    id: "bienestar_mental",
    nombre: "Programa de Bienestar Mental",
    categoria: "Bienestar Emocional",
    duracion: "6 semanas",
    formato: "Online",
    descripcion: "Sesiones individuales y grupales para reducir el estrés y mejorar la gestión emocional.",
    impacto: "Reduce el absentismo y mejora el clima emocional.",
    imagen: "https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=800",
    objetivos: [
      "Reducir niveles de estrés y burnout en la organización",
      "Desarrollar herramientas de gestión emocional",
      "Fomentar prácticas de autocuidado y mindfulness",
      "Crear espacios seguros para el bienestar mental"
    ],
    impactoDetallado: [
      "Reducción del 45% en el absentismo por causas emocionales",
      "Mejora del 50% en indicadores de clima laboral",
      "Incremento del 38% en la percepción de bienestar",
      "Disminución del 42% en niveles de estrés reportados"
    ],
    modalidad: "12 sesiones virtuales grupales + 3 sesiones individuales + acceso a app de meditación",
    participantes: "Abierto a todos los colaboradores",
    icono: "🧘"
  },
  {
    id: "cultura_feedback",
    nombre: "Taller Cultura de Feedback",
    categoria: "Reconocimiento",
    duracion: "1 jornada",
    formato: "Presencial",
    descripcion: "Fomenta la comunicación constructiva y el reconocimiento mutuo entre equipos.",
    impacto: "Incrementa la satisfacción laboral y la colaboración.",
    imagen: "https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=800",
    objetivos: [
      "Establecer una cultura de feedback continuo y constructivo",
      "Desarrollar habilidades de comunicación efectiva",
      "Implementar prácticas de reconocimiento peer-to-peer",
      "Crear un ambiente de confianza y apertura"
    ],
    impactoDetallado: [
      "Aumento del 55% en la frecuencia de feedback positivo",
      "Mejora del 48% en la satisfacción con el reconocimiento",
      "Incremento del 40% en la colaboración entre áreas",
      "Reducción del 35% en conflictos interpersonales"
    ],
    modalidad: "Taller intensivo de 8 horas + kit de herramientas + sesión de seguimiento",
    participantes: "Equipos completos o departamentos (15-30 personas)",
    icono: "🏆"
  },
  {
    id: "comunicacion_interna",
    nombre: "Formación en Comunicación Interna",
    categoria: "Comunicación",
    duracion: "3 semanas",
    formato: "Online",
    descripcion: "Fortalece la transparencia y los canales de comunicación entre áreas.",
    impacto: "Aumenta la confianza organizacional.",
    imagen: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800",
    objetivos: [
      "Optimizar los canales de comunicación organizacional",
      "Desarrollar estrategias de comunicación transparente",
      "Mejorar la difusión de información estratégica",
      "Fortalecer la comunicación ascendente y descendente"
    ],
    impactoDetallado: [
      "Incremento del 60% en la percepción de transparencia",
      "Mejora del 45% en la efectividad de la comunicación",
      "Reducción del 50% en malentendidos organizacionales",
      "Aumento del 52% en el engagement con comunicados internos"
    ],
    modalidad: "6 módulos online + talleres prácticos + diagnóstico de comunicación",
    participantes: "Líderes de comunicación y mandos directivos",
    icono: "💬"
  },
  {
    id: "retencion_talento",
    nombre: "Plan Retención y Desarrollo de Talento",
    categoria: "Desarrollo Profesional",
    duracion: "8 semanas",
    formato: "Consultoría + Formación",
    descripcion: "Diseña rutas de crecimiento profesional y planes de carrera adaptados a la empresa.",
    impacto: "Fortalece la motivación y reduce la rotación.",
    imagen: "https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg?auto=compress&cs=tinysrgb&w=800",
    objetivos: [
      "Diseñar rutas de carrera personalizadas",
      "Implementar programas de desarrollo continuo",
      "Crear planes de sucesión y retención de talento clave",
      "Fortalecer el employer branding interno"
    ],
    impactoDetallado: [
      "Reducción del 58% en la rotación voluntaria",
      "Incremento del 65% en la satisfacción con desarrollo profesional",
      "Mejora del 47% en la retención de alto potencial",
      "Aumento del 55% en la movilidad interna efectiva"
    ],
    modalidad: "Diagnóstico organizacional + diseño de rutas + talleres + seguimiento trimestral",
    participantes: "RRHH y líderes de todas las áreas",
    icono: "📈"
  },
  {
    id: "balance_vida_trabajo",
    nombre: "Programa Equilibrio Vida-Trabajo",
    categoria: "Bienestar Personal",
    duracion: "5 semanas",
    formato: "Híbrido",
    descripcion: "Estrategias prácticas para gestionar el tiempo, establecer límites saludables y promover el bienestar integral.",
    impacto: "Reduce el burnout y mejora la productividad sostenible.",
    imagen: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800",
    objetivos: [
      "Desarrollar habilidades de gestión efectiva del tiempo",
      "Establecer límites saludables entre trabajo y vida personal",
      "Implementar prácticas de desconexión digital",
      "Promover hábitos de vida saludable"
    ],
    impactoDetallado: [
      "Reducción del 52% en casos de burnout",
      "Mejora del 44% en la satisfacción con el balance vida-trabajo",
      "Incremento del 38% en la productividad sostenida",
      "Disminución del 40% en horas extra no planificadas"
    ],
    modalidad: "10 talleres virtuales + 2 jornadas presenciales + coaching individual",
    participantes: "Abierto a todos los niveles organizacionales",
    icono: "⚖️"
  },
  {
    id: "trabajo_equipo",
    nombre: "Fortalecimiento de Trabajo en Equipo",
    categoria: "Colaboración",
    duracion: "2 semanas",
    formato: "Presencial",
    descripcion: "Dinámicas de team building y desarrollo de habilidades de colaboración efectiva.",
    impacto: "Mejora la sinergia y resultados de equipos.",
    imagen: "https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg?auto=compress&cs=tinysrgb&w=800",
    objetivos: [
      "Fortalecer la cohesión y confianza entre miembros del equipo",
      "Desarrollar habilidades de colaboración efectiva",
      "Mejorar la resolución conjunta de problemas",
      "Crear rituales y dinámicas de equipo positivas"
    ],
    impactoDetallado: [
      "Incremento del 62% en la cohesión de equipos",
      "Mejora del 48% en la efectividad colaborativa",
      "Aumento del 55% en la satisfacción con el ambiente de equipo",
      "Reducción del 43% en conflictos internos"
    ],
    modalidad: "4 jornadas de team building + talleres prácticos + plan de acción conjunto",
    participantes: "Equipos completos (8-15 personas por grupo)",
    icono: "🤝"
  },
  {
    id: "gestion_cambio",
    nombre: "Gestión del Cambio Organizacional",
    categoria: "Transformación",
    duracion: "6 semanas",
    formato: "Consultoría",
    descripcion: "Acompaña procesos de transformación organizacional minimizando resistencias y maximizando el engagement.",
    impacto: "Facilita transiciones exitosas y reduce la incertidumbre.",
    imagen: "https://images.pexels.com/photos/3184639/pexels-photo-3184639.jpeg?auto=compress&cs=tinysrgb&w=800",
    objetivos: [
      "Diseñar estrategias de gestión del cambio efectivas",
      "Reducir resistencias y miedos ante transformaciones",
      "Comunicar claramente la visión del cambio",
      "Desarrollar agentes de cambio internos"
    ],
    impactoDetallado: [
      "Reducción del 65% en resistencia al cambio",
      "Incremento del 70% en la adopción de nuevas prácticas",
      "Mejora del 58% en la percepción de liderazgo durante cambios",
      "Disminución del 50% en el tiempo de adaptación"
    ],
    modalidad: "Diagnóstico + plan de cambio + talleres + coaching ejecutivo + seguimiento",
    participantes: "Comité de cambio y líderes clave",
    icono: "🔄"
  }
];

// Función para obtener servicio por ID
export const obtenerServicioPorId = (id) => {
  return serviciosMock.find(servicio => servicio.id === id);
};

// Función para obtener categorías únicas
export const obtenerCategorias = () => {
  const categorias = [...new Set(serviciosMock.map(s => s.categoria))];
  return ['Todos', ...categorias];
};

// Función para filtrar servicios por categoría
export const filtrarPorCategoria = (categoria) => {
  if (categoria === 'Todos') return serviciosMock;
  return serviciosMock.map(s => s.categoria === categoria);
};

// Función para obtener color de categoría
export const obtenerColorCategoria = (categoria) => {
  const colores = {
    'Liderazgo': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
    'Bienestar Emocional': { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
    'Reconocimiento': { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
    'Comunicación': { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' },
    'Desarrollo Profesional': { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
    'Bienestar Personal': { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
    'Colaboración': { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
    'Transformación': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' }
  };
  return colores[categoria] || { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' };
};
