// Solicitudes de servicios específicas para FitCorp basadas en resultados de encuestas

export const departamentosMock = [
  "Entrenamiento Deportivo",
  "Fisioterapia",
  "Nutrición Deportiva",
  "Psicología Deportiva",
  "Administración",
  "Servicios Generales"
];

export const solicitudesMock = [
  {
    id: 1,
    servicio: {
      id: "formacion_continua_deportiva",
      nombre: "Programa de Formación Continua Deportiva",
      icono: "🎓"
    },
    departamento: "Entrenamiento Deportivo",
    fecha_implementacion: "2024-12-15",
    objetivos: "Actualizar conocimientos del equipo en técnicas de entrenamiento de última generación y obtener certificaciones internacionales. Responde a la necesidad identificada en la encuesta de Clima Laboral donde Desarrollo obtuvo 4.1/5.0.",
    comentarios: "Priorizar formación en periodización avanzada y nuevas metodologías de entrenamiento funcional. Incluir certificaciones NSCA o similares.",
    estado: "En curso",
    fecha_solicitud: "2024-11-26",
    solicitante: "Carlos Mendoza - Director Deportivo",
    encuestaRelacionada: "Clima Laboral - Noviembre 2024",
    prioridad: "Alta"
  },
  {
    id: 2,
    servicio: {
      id: "mindfulness_deportivo",
      nombre: "Programa de Mindfulness y Gestión del Estrés Deportivo",
      icono: "🧘"
    },
    departamento: "Psicología Deportiva",
    fecha_implementacion: "2024-12-01",
    objetivos: "Implementar sesiones de mindfulness y gestión del estrés para todo el equipo. Según encuesta, el trabajo con atletas de élite genera alta demanda emocional. Score general: 4.4/5.0",
    comentarios: "Enfoque en técnicas adaptadas al entorno deportivo. Sesiones semanales para todo el personal. Priorizar Entrenamiento y Psicología.",
    estado: "Aprobado",
    fecha_solicitud: "2024-11-24",
    solicitante: "Dra. Patricia Ruiz - Psicología Deportiva",
    encuestaRelacionada: "Clima Laboral - Noviembre 2024",
    prioridad: "Alta"
  },
  {
    id: 3,
    servicio: {
      id: "comunicacion_interdepartamental",
      nombre: "Taller de Comunicación Interdepartamental",
      icono: "💬"
    },
    departamento: "Administración",
    fecha_implementacion: "2024-12-08",
    objetivos: "Mejorar la coordinación entre Entrenamiento, Nutrición y Fisioterapia para crear programas integrados más efectivos. Dimensión Comunicación: 4.2/5.0 en encuesta.",
    comentarios: "Varios comentarios en la encuesta mencionan la necesidad de mejor alineación entre departamentos. Implementar reuniones semanales de coordinación.",
    estado: "Pendiente",
    fecha_solicitud: "2024-11-25",
    solicitante: "Laura Fernández - Gerente de Operaciones",
    encuestaRelacionada: "Clima Laboral - Noviembre 2024",
    prioridad: "Media"
  },
  {
    id: 4,
    servicio: {
      id: "yoga_deportivo",
      nombre: "Programa de Yoga para Alto Rendimiento",
      icono: "🧘‍♂️"
    },
    departamento: "Entrenamiento Deportivo",
    fecha_implementacion: "2025-01-15",
    objetivos: "Implementar yoga deportivo como nuevo servicio. Solicitud surgió en encuesta de Servicios (score 4.5/5.0). Diversifica oferta y mejora recuperación de atletas.",
    comentarios: "Iniciar con programa piloto. Certificar a 2 instructores internos. Evaluar resultados antes de expansión completa.",
    estado: "En evaluación",
    fecha_solicitud: "2024-11-27",
    solicitante: "Diego Torres - Coordinador de Innovación",
    encuestaRelacionada: "Evaluación de Servicios Deportivos",
    prioridad: "Media"
  },
  {
    id: 5,
    servicio: {
      id: "nutricion_plant_based",
      nombre: "Especialización en Nutrición Plant-Based para Alto Rendimiento",
      icono: "🥗"
    },
    departamento: "Nutrición Deportiva",
    fecha_implementacion: "2025-01-20",
    objetivos: "Capacitar al equipo en nutrición vegana/vegetariana de alto rendimiento. Comentarios en encuesta de Servicios solicitaron más opciones plant-based. Score Nutrición: 4.5/5.0",
    comentarios: "Demanda creciente de atletas con dietas plant-based. Necesitamos expertise para no comprometer performance. Certificación internacional preferible.",
    estado: "Pendiente",
    fecha_solicitud: "2024-11-26",
    solicitante: "Lic. Andrea Gómez - Jefa de Nutrición",
    encuestaRelacionada: "Evaluación de Servicios Deportivos",
    prioridad: "Media"
  },
  {
    id: 6,
    servicio: {
      id: "formacion_continua_deportiva",
      nombre: "Programa de Formación Continua Deportiva",
      icono: "🎓"
    },
    departamento: "Fisioterapia",
    fecha_implementacion: "2025-02-01",
    objetivos: "Actualizar al equipo de fisioterapia en técnicas de recuperación avanzadas y nuevas metodologías de tratamiento deportivo.",
    comentarios: "Complementa la formación del equipo de entrenamiento. Enfoque en recuperación post-lesión y prevención. Departamento de Fisioterapia tuvo 100% de participación en encuesta.",
    estado: "Pendiente",
    fecha_solicitud: "2024-11-28",
    solicitante: "Ft. Roberto Vega - Coordinador de Fisioterapia",
    encuestaRelacionada: "Clima Laboral - Noviembre 2024",
    prioridad: "Media"
  }
];

let nextId = 7;

// Función para agregar nueva solicitud
export const agregarSolicitud = (solicitud) => {
  const nuevaSolicitud = {
    id: nextId++,
    ...solicitud,
    fecha_solicitud: new Date().toISOString().split('T')[0],
    solicitante: "Usuario Admin"
  };
  solicitudesMock.push(nuevaSolicitud);
  return nuevaSolicitud;
};

// Función para actualizar estado de solicitud
export const actualizarEstadoSolicitud = (id, nuevoEstado) => {
  const solicitud = solicitudesMock.find(s => s.id === id);
  if (solicitud) {
    solicitud.estado = nuevoEstado;
    return solicitud;
  }
  return null;
};

// Función para eliminar solicitud
export const eliminarSolicitud = (id) => {
  const index = solicitudesMock.findIndex(s => s.id === id);
  if (index !== -1) {
    solicitudesMock.splice(index, 1);
    return true;
  }
  return false;
};

// Función para obtener solicitud por ID
export const obtenerSolicitudPorId = (id) => {
  return solicitudesMock.find(s => s.id === id);
};

// Función para obtener color de estado
export const obtenerColorEstado = (estado) => {
  const colores = {
    'Pendiente': { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', badge: 'bg-yellow-100 text-yellow-800' },
    'En curso': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-800' },
    'Completado': { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', badge: 'bg-green-100 text-green-800' },
    'Cancelado': { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', badge: 'bg-red-100 text-red-800' }
  };
  return colores[estado] || { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', badge: 'bg-gray-100 text-gray-800' };
};

// Estados disponibles
export const estadosDisponibles = ['Pendiente', 'En curso', 'Completado', 'Cancelado'];
