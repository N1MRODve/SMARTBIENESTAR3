// TODO: conectar con tabla "servicios" y lógica de recomendaciones personalizada en futuras iteraciones.

export const serviciosSmart = [
  {
    id: 'clima-laboral',
    nombre: 'Programa de Clima Laboral Positivo',
    descripcion: 'Talleres y dinámicas para mejorar el ambiente de trabajo y las relaciones interpersonales.',
    icono: '🌟',
    dimensiones: ['clima_laboral', 'ambiente_trabajo'],
    umbralActivacion: 3.5,
    categoria: 'bienestar_organizacional'
  },
  {
    id: 'liderazgo-efectivo',
    nombre: 'Capacitación en Liderazgo Efectivo',
    descripcion: 'Programa de desarrollo de habilidades de liderazgo para mandos medios y directivos.',
    icono: '👥',
    dimensiones: ['liderazgo', 'supervision', 'gestion_equipos'],
    umbralActivacion: 3.5,
    categoria: 'desarrollo_liderazgo'
  },
  {
    id: 'balance-vida',
    nombre: 'Equilibrio Vida-Trabajo',
    descripcion: 'Estrategias de gestión del tiempo, flexibilidad laboral y bienestar personal.',
    icono: '⚖️',
    dimensiones: ['balance_vida_trabajo', 'carga_trabajo', 'horarios'],
    umbralActivacion: 3.3,
    categoria: 'bienestar_personal'
  },
  {
    id: 'comunicacion-interna',
    nombre: 'Mejora de Comunicación Organizacional',
    descripcion: 'Herramientas y canales para optimizar la comunicación entre equipos y niveles.',
    icono: '💬',
    dimensiones: ['comunicacion', 'transparencia', 'informacion'],
    umbralActivacion: 3.5,
    categoria: 'comunicacion'
  },
  {
    id: 'reconocimiento',
    nombre: 'Sistema de Reconocimiento y Recompensas',
    descripcion: 'Programa para valorar logros, esfuerzos y contribuciones del equipo.',
    icono: '🏆',
    dimensiones: ['reconocimiento', 'motivacion', 'valoracion'],
    umbralActivacion: 3.5,
    categoria: 'motivacion'
  },
  {
    id: 'desarrollo-profesional',
    nombre: 'Plan de Desarrollo y Crecimiento',
    descripcion: 'Rutas de carrera, capacitaciones y oportunidades de crecimiento profesional.',
    icono: '📈',
    dimensiones: ['desarrollo', 'crecimiento', 'capacitacion', 'carrera'],
    umbralActivacion: 3.5,
    categoria: 'desarrollo_profesional'
  },
  {
    id: 'salud-mental',
    nombre: 'Apoyo en Salud Mental y Bienestar',
    descripcion: 'Sesiones de psicología, mindfulness y gestión del estrés.',
    icono: '🧘',
    dimensiones: ['estres', 'salud_mental', 'bienestar_emocional', 'presion'],
    umbralActivacion: 3.3,
    categoria: 'salud_bienestar'
  },
  {
    id: 'trabajo-equipo',
    nombre: 'Fortalecimiento de Trabajo en Equipo',
    descripcion: 'Dinámicas de team building y colaboración efectiva entre áreas.',
    icono: '🤝',
    dimensiones: ['colaboracion', 'trabajo_equipo', 'coordinacion'],
    umbralActivacion: 3.5,
    categoria: 'trabajo_equipo'
  },
  {
    id: 'gestion-conflictos',
    nombre: 'Gestión de Conflictos y Mediación',
    descripcion: 'Herramientas para resolver conflictos de manera constructiva.',
    icono: '🤲',
    dimensiones: ['conflictos', 'relaciones_laborales', 'resolucion'],
    umbralActivacion: 3.3,
    categoria: 'resolucion_conflictos'
  },
  {
    id: 'autonomia-empoderamiento',
    nombre: 'Autonomía y Empoderamiento',
    descripcion: 'Promover la toma de decisiones y la responsabilidad individual.',
    icono: '💪',
    dimensiones: ['autonomia', 'empoderamiento', 'participacion', 'decision'],
    umbralActivacion: 3.5,
    categoria: 'empoderamiento'
  },
  {
    id: 'recursos-condiciones',
    nombre: 'Optimización de Recursos y Condiciones',
    descripcion: 'Mejora de infraestructura, herramientas y condiciones físicas de trabajo.',
    icono: '🛠️',
    dimensiones: ['recursos', 'herramientas', 'condiciones_fisicas', 'infraestructura'],
    umbralActivacion: 3.5,
    categoria: 'recursos_infraestructura'
  },
  {
    id: 'cultura-innovacion',
    nombre: 'Cultura de Innovación y Creatividad',
    descripcion: 'Espacios y programas para fomentar la innovación y nuevas ideas.',
    icono: '💡',
    dimensiones: ['innovacion', 'creatividad', 'propuestas'],
    umbralActivacion: 3.5,
    categoria: 'innovacion'
  }
];

// Función para normalizar nombres de dimensiones
const normalizarDimension = (dimension) => {
  return dimension
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '_')
    .replace(/[áàäâ]/g, 'a')
    .replace(/[éèëê]/g, 'e')
    .replace(/[íìïî]/g, 'i')
    .replace(/[óòöô]/g, 'o')
    .replace(/[úùüû]/g, 'u')
    .replace(/[ñ]/g, 'n');
};

// Función para obtener recomendaciones basadas en resultados
export const obtenerRecomendaciones = (resultados) => {
  if (!resultados || !resultados.porDimension) {
    return [];
  }

  const recomendacionesMap = new Map();
  const promedioGlobal = resultados.promedioGlobal || 0;

  // Analizar cada dimensión
  Object.entries(resultados.porDimension).forEach(([dimension, datos]) => {
    const valor = datos.promedio || 0;
    const dimensionNormalizada = normalizarDimension(dimension);

    // Buscar servicios que coincidan con esta dimensión
    serviciosSmart.forEach(servicio => {
      // Verificar si el servicio aplica a esta dimensión
      const aplicaServicio = servicio.dimensiones.some(dimServicio => {
        const dimServicioNormalizada = normalizarDimension(dimServicio);
        return (
          dimensionNormalizada.includes(dimServicioNormalizada) ||
          dimServicioNormalizada.includes(dimensionNormalizada) ||
          dimension.toLowerCase().includes(dimServicio.toLowerCase()) ||
          dimServicio.toLowerCase().includes(dimension.toLowerCase())
        );
      });

      // Si el valor está por debajo del umbral, recomendar el servicio
      if (aplicaServicio && valor < servicio.umbralActivacion) {
        if (!recomendacionesMap.has(servicio.id)) {
          recomendacionesMap.set(servicio.id, {
            ...servicio,
            prioridad: servicio.umbralActivacion - valor,
            dimensionesAfectadas: [dimension],
            valorMinimo: valor
          });
        } else {
          const rec = recomendacionesMap.get(servicio.id);
          rec.dimensionesAfectadas.push(dimension);
          rec.valorMinimo = Math.min(rec.valorMinimo, valor);
          rec.prioridad = Math.max(rec.prioridad, servicio.umbralActivacion - valor);
        }
      }
    });
  });

  // Si el promedio global es bajo, agregar servicios generales
  if (promedioGlobal < 3.5) {
    const serviciosGenerales = ['clima-laboral', 'salud-mental', 'trabajo-equipo'];
    serviciosGenerales.forEach(servicioId => {
      const servicio = serviciosSmart.find(s => s.id === servicioId);
      if (servicio && !recomendacionesMap.has(servicioId)) {
        recomendacionesMap.set(servicioId, {
          ...servicio,
          prioridad: 3.5 - promedioGlobal,
          dimensionesAfectadas: ['General'],
          valorMinimo: promedioGlobal
        });
      }
    });
  }

  // Convertir a array y ordenar por prioridad
  const recomendaciones = Array.from(recomendacionesMap.values())
    .sort((a, b) => b.prioridad - a.prioridad)
    .slice(0, 6); // Máximo 6 recomendaciones

  return recomendaciones;
};

// Función para obtener texto de prioridad
export const obtenerTextoPrioridad = (prioridad) => {
  if (prioridad >= 1.5) return { texto: 'Alta', color: 'text-red-600', bg: 'bg-red-100' };
  if (prioridad >= 0.8) return { texto: 'Media', color: 'text-orange-600', bg: 'bg-orange-100' };
  return { texto: 'Baja', color: 'text-yellow-600', bg: 'bg-yellow-100' };
};

// Función para obtener color de categoría
export const obtenerColorCategoria = (categoria) => {
  const colores = {
    bienestar_organizacional: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' },
    desarrollo_liderazgo: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700' },
    bienestar_personal: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700' },
    comunicacion: { bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-700' },
    motivacion: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700' },
    desarrollo_profesional: { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700' },
    salud_bienestar: { bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-700' },
    trabajo_equipo: { bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-700' },
    resolucion_conflictos: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700' },
    empoderamiento: { bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-700' },
    recursos_infraestructura: { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700' },
    innovacion: { bg: 'bg-fuchsia-50', border: 'border-fuchsia-200', text: 'text-fuchsia-700' }
  };
  return colores[categoria] || { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700' };
};
