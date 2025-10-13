// TODO: conectar con tablas "comunicados", "departamentos" y "usuarios" cuando BD esté activa.

export const comunicadosMock = [
  {
    id: 1,
    titulo: "Plan de Acción Post Clima360",
    tipo: "Plan de mejora",
    fecha_envio: "2025-10-10",
    destinatarios: ["RRHH", "Marketing", "Ventas"],
    roles: ["Todos los empleados"],
    estado: "Enviado",
    interacciones: 86,
    contenido: "Tras los resultados de la encuesta Clima360, implementaremos acciones específicas para fortalecer el liderazgo y la comunicación interna. Estas medidas incluyen talleres de liderazgo consciente, mejora de canales de comunicación y espacios de feedback continuo.",
    fecha_creacion: "2025-10-09",
    creador: "Admin Sistema"
  },
  {
    id: 2,
    titulo: "Reconocimiento del Equipo de Producción",
    tipo: "Felicitación",
    fecha_envio: "2025-09-22",
    destinatarios: ["Producción"],
    roles: ["Todos los empleados"],
    estado: "Enviado",
    interacciones: 91,
    contenido: "Felicitamos al equipo de Producción por su excelente clima laboral y compromiso demostrado durante el último trimestre. Los resultados de la encuesta reflejan un alto nivel de satisfacción y cohesión de equipo. ¡Gracias por vuestro trabajo!",
    fecha_creacion: "2025-09-21",
    creador: "Admin Sistema"
  },
  {
    id: 3,
    titulo: "Nuevas Iniciativas de Bienestar 2025",
    tipo: "Comunicación General",
    fecha_envio: "2025-11-01",
    destinatarios: ["RRHH", "Marketing", "Ventas", "Producción", "Tecnología"],
    roles: ["Todos los empleados"],
    estado: "Programado",
    interacciones: 0,
    contenido: "Agradecemos la participación en las encuestas de clima laboral. A partir de noviembre, lanzaremos nuevos programas de bienestar mental, talleres de liderazgo y espacios de reconocimiento entre equipos. Pronto compartiremos el calendario completo.",
    fecha_creacion: "2025-10-12",
    creador: "Admin Sistema"
  },
  {
    id: 4,
    titulo: "Resultados Encuesta Q3 - Borrador",
    tipo: "Plan de mejora",
    fecha_envio: null,
    destinatarios: ["RRHH"],
    roles: ["Líderes de área"],
    estado: "Borrador",
    interacciones: 0,
    contenido: "Borrador del comunicado con los resultados principales del tercer trimestre. Pendiente de revisión y aprobación antes de envío.",
    fecha_creacion: "2025-10-13",
    creador: "Admin Sistema"
  },
  {
    id: 5,
    titulo: "Lanzamiento Programa Balance Vida-Trabajo",
    tipo: "Comunicación General",
    fecha_envio: "2025-09-15",
    destinatarios: ["RRHH", "Marketing", "Tecnología"],
    roles: ["Todos los empleados"],
    estado: "Enviado",
    interacciones: 78,
    contenido: "Estamos encantados de anunciar el lanzamiento del Programa de Balance Vida-Trabajo, diseñado para ayudar a gestionar el tiempo de manera efectiva y establecer límites saludables. Incluye talleres virtuales, sesiones presenciales y coaching individual.",
    fecha_creacion: "2025-09-14",
    creador: "Admin Sistema"
  }
];

export const plantillasComunicado = [
  {
    id: "mejora",
    nombre: "Plan de Mejora",
    icono: "📊",
    cuerpo: "Tras los resultados de {encuesta}, implementaremos medidas para fortalecer el bienestar organizacional.\n\nEstas acciones incluyen:\n- Talleres de desarrollo\n- Mejora de procesos internos\n- Espacios de feedback continuo\n\nAgradecer vuestra participación y compromiso."
  },
  {
    id: "felicitacion",
    nombre: "Felicitación",
    icono: "🎉",
    cuerpo: "¡Enhorabuena!\n\nLos resultados de {encuesta} reflejan un alto compromiso y excelente clima laboral. Gracias por vuestra participación y dedicación.\n\nSeguiremos trabajando juntos para mantener este nivel de excelencia."
  },
  {
    id: "general",
    nombre: "Comunicación General",
    icono: "📢",
    cuerpo: "Agradecemos la participación en la encuesta {encuesta}.\n\nEn breve compartiremos:\n- Resultados principales\n- Nuevas iniciativas\n- Calendario de actividades\n\nGracias por vuestra colaboración."
  },
  {
    id: "resultados",
    nombre: "Resultados de Encuesta",
    icono: "📈",
    cuerpo: "Compartimos los resultados de {encuesta}:\n\nPuntos destacados:\n- Fortalezas identificadas\n- Áreas de oportunidad\n- Próximos pasos\n\nGracias a todos los participantes por vuestros valiosos aportes."
  },
  {
    id: "accion",
    nombre: "Plan de Acción",
    icono: "✅",
    cuerpo: "Basándonos en los resultados de {encuesta}, hemos diseñado un plan de acción:\n\n1. Implementación de talleres específicos\n2. Mejora de canales de comunicación\n3. Programas de reconocimiento\n4. Seguimiento trimestral\n\nCada departamento recibirá información específica."
  }
];

export const departamentosDisponibles = [
  "RRHH",
  "Marketing",
  "Ventas",
  "Producción",
  "Tecnología",
  "Finanzas",
  "Operaciones",
  "Atención al Cliente"
];

export const rolesDisponibles = [
  "Todos los empleados",
  "Líderes de área",
  "Solo RRHH",
  "Mandos intermedios",
  "Dirección"
];

let nextId = 6;

export const agregarComunicado = (comunicado) => {
  const nuevoComunicado = {
    id: nextId++,
    ...comunicado,
    fecha_creacion: new Date().toISOString().split('T')[0],
    creador: "Admin Sistema",
    interacciones: 0
  };
  comunicadosMock.push(nuevoComunicado);
  return nuevoComunicado;
};

export const actualizarComunicado = (id, cambios) => {
  const comunicado = comunicadosMock.find(c => c.id === id);
  if (comunicado) {
    Object.assign(comunicado, cambios);
    return comunicado;
  }
  return null;
};

export const eliminarComunicado = (id) => {
  const index = comunicadosMock.findIndex(c => c.id === id);
  if (index !== -1) {
    comunicadosMock.splice(index, 1);
    return true;
  }
  return false;
};

export const obtenerComunicadoPorId = (id) => {
  return comunicadosMock.find(c => c.id === id);
};

export const duplicarComunicado = (id) => {
  const original = obtenerComunicadoPorId(id);
  if (original) {
    const duplicado = {
      ...original,
      id: nextId++,
      titulo: `${original.titulo} (Copia)`,
      estado: "Borrador",
      fecha_envio: null,
      fecha_creacion: new Date().toISOString().split('T')[0],
      interacciones: 0
    };
    comunicadosMock.push(duplicado);
    return duplicado;
  }
  return null;
};

export const obtenerColorEstado = (estado) => {
  const colores = {
    'Enviado': { bg: 'bg-green-50', text: 'text-green-700', badge: 'bg-green-100 text-green-800', border: 'border-green-200' },
    'Borrador': { bg: 'bg-gray-50', text: 'text-gray-700', badge: 'bg-gray-100 text-gray-800', border: 'border-gray-200' },
    'Programado': { bg: 'bg-yellow-50', text: 'text-yellow-700', badge: 'bg-yellow-100 text-yellow-800', border: 'border-yellow-200' }
  };
  return colores[estado] || { bg: 'bg-gray-50', text: 'text-gray-700', badge: 'bg-gray-100 text-gray-800', border: 'border-gray-200' };
};

export const obtenerColorInteraccion = (porcentaje) => {
  if (porcentaje >= 80) return 'text-green-600';
  if (porcentaje >= 60) return 'text-orange-600';
  return 'text-red-600';
};

export const calcularEstadisticas = () => {
  const enviados = comunicadosMock.filter(c => c.estado === 'Enviado');
  const totalInteracciones = enviados.reduce((sum, c) => sum + c.interacciones, 0);
  const promedioLectura = enviados.length > 0 ? Math.round(totalInteracciones / enviados.length) : 0;

  const departamentosActivos = {};
  comunicadosMock.forEach(c => {
    c.destinatarios.forEach(dept => {
      departamentosActivos[dept] = (departamentosActivos[dept] || 0) + c.interacciones;
    });
  });

  const topDepartamentos = Object.entries(departamentosActivos)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([dept]) => dept);

  return {
    totalEnviados: enviados.length,
    totalProgramados: comunicadosMock.filter(c => c.estado === 'Programado').length,
    totalBorradores: comunicadosMock.filter(c => c.estado === 'Borrador').length,
    promedioLectura,
    departamentosActivos: topDepartamentos.join(' y ') || 'N/A',
    datosGrafico: enviados.map(c => ({
      titulo: c.titulo.substring(0, 30) + '...',
      interacciones: c.interacciones
    }))
  };
};
