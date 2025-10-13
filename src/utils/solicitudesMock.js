// TODO: conectar con tablas "solicitudes_servicios" y "departamentos" en futuras iteraciones.

export const departamentosMock = [
  "RRHH",
  "Marketing",
  "Ventas",
  "Producción",
  "Tecnología",
  "Finanzas",
  "Operaciones",
  "Atención al Cliente"
];

export const solicitudesMock = [
  {
    id: 1,
    servicio: {
      id: "bienestar_mental",
      nombre: "Programa de Bienestar Mental",
      icono: "🧘"
    },
    departamento: "RRHH",
    fecha_implementacion: "2025-11-15",
    objetivos: "Reducir niveles de estrés del equipo y mejorar el clima laboral general.",
    comentarios: "Priorizar talleres de mindfulness y gestión emocional.",
    estado: "En curso",
    fecha_solicitud: "2025-10-01",
    solicitante: "María González"
  },
  {
    id: 2,
    servicio: {
      id: "liderazgo_consciente",
      nombre: "Programa de Liderazgo Consciente",
      icono: "👥"
    },
    departamento: "Marketing",
    fecha_implementacion: "2025-12-01",
    objetivos: "Desarrollar competencias de liderazgo empático en mandos medios.",
    comentarios: "Incluir seguimiento trimestral post-formación.",
    estado: "Pendiente",
    fecha_solicitud: "2025-10-05",
    solicitante: "Carlos Ramírez"
  },
  {
    id: 3,
    servicio: {
      id: "cultura_feedback",
      nombre: "Taller Cultura de Feedback",
      icono: "🏆"
    },
    departamento: "Ventas",
    fecha_implementacion: "2025-10-20",
    objetivos: "Establecer prácticas de reconocimiento peer-to-peer en el equipo comercial.",
    comentarios: "",
    estado: "Completado",
    fecha_solicitud: "2025-09-15",
    solicitante: "Ana Martínez"
  },
  {
    id: 4,
    servicio: {
      id: "comunicacion_interna",
      nombre: "Formación en Comunicación Interna",
      icono: "💬"
    },
    departamento: "Producción",
    fecha_implementacion: "2025-11-10",
    objetivos: "Mejorar la comunicación entre turnos y reducir malentendidos operativos.",
    comentarios: "Adaptar ejemplos a contexto de planta de producción.",
    estado: "Pendiente",
    fecha_solicitud: "2025-10-08",
    solicitante: "Roberto Silva"
  }
];

let nextId = 5;

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
