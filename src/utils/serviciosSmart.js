// Catálogo oficial de servicios SMART Bienestar
// Fuente: Catálogo de servicios detallados SMART Bienestar (Google Docs)
// Última actualización: Marzo 2026

export const serviciosSmart = [
  // ── SALUD MENTAL ──
  {
    id: 'liderazgo-consciente',
    nombre: 'Liderazgo Consciente',
    descripcion: 'Un programa de formación diseñado para dotar a los líderes de herramientas prácticas que les permitan gestionarse emocionalmente, pero sobre todo detectar señales tempranas de estrés, ansiedad, depresión o agotamiento en sus equipos y buscar soluciones sin necesidad de asumir funciones terapéuticas. Evitando así bajas o rotación de talento.',
    icono: '🧠',
    dimensiones: ['estres', 'salud_mental', 'bienestar_emocional', 'burnout', 'liderazgo', 'gestion_equipos'],
    umbralActivacion: 3.3,
    categoria: 'salud_mental',
    incluidoEnPrecio: true,
    duracion: '180 min (2 sesiones de 90 min)',
    formato: 'Programa grupal',
    participantes: 'Líderes y mandos medios'
  },
  {
    id: 'smart-care',
    nombre: 'SMART Care',
    descripcion: 'Servicio de orientación y apoyo psicológico externo que ofrece a todos los colaboradores un espacio seguro y profesional para abordar retos emocionales o personales que impactan en su vida laboral.',
    icono: '💜',
    dimensiones: ['salud_mental', 'bienestar_emocional', 'estres', 'ansiedad', 'depresion', 'presion'],
    umbralActivacion: 3.3,
    categoria: 'salud_mental',
    incluidoEnPrecio: true,
    duracion: '2 sesiones/mes por empresa',
    formato: 'Sesiones individuales',
    participantes: 'Todos los colaboradores'
  },

  // ── CLIMA LABORAL ──
  {
    id: 'coaching-lideres',
    nombre: 'Coaching Personalizado para Líderes',
    descripcion: 'Un acompañamiento individualizado para los mandos medios y gerentes de la organización, enfocado en potenciar sus habilidades de gestión de personas y resolución de conflictos dentro de sus equipos.',
    icono: '🎯',
    dimensiones: ['clima_laboral', 'liderazgo', 'supervision', 'conflictos', 'relaciones_laborales', 'gestion_equipos'],
    umbralActivacion: 3.5,
    categoria: 'clima_laboral',
    incluidoEnPrecio: true,
    duracion: '4 sesiones/mes por empresa',
    formato: 'Sesiones individuales',
    participantes: 'Mandos medios y gerentes'
  },
  {
    id: 'transformacion-cultural',
    nombre: 'Transformación Cultura Organizacional',
    descripcion: 'Servicio de consultoría estratégica y facilitación grupal orientado a redefinir los valores y comportamientos de la empresa, eliminando silos y promoviendo una cultura de colaboración real.',
    icono: '🏛️',
    dimensiones: ['clima_laboral', 'ambiente_trabajo', 'colaboracion', 'trabajo_equipo', 'pertenencia', 'valores'],
    umbralActivacion: 3.5,
    categoria: 'clima_laboral',
    incluidoEnPrecio: false,
    duracion: 'Según necesidad',
    formato: 'Consultoría estratégica',
    participantes: 'Toda la organización'
  },

  // ── CARGA DE TRABAJO ──
  {
    id: 'gestion-prioridades',
    nombre: 'Multiplica el Tiempo Gestionando Prioridades',
    descripcion: 'En este taller práctico los participantes aprenderán a diferenciar lo urgente de lo importante, utilizando herramientas de planificación que permiten organizar la carga laboral de manera inteligente y realista para reducir la sensación de caos.',
    icono: '⏰',
    dimensiones: ['carga_trabajo', 'estres', 'horarios', 'balance_vida_trabajo', 'organizacion', 'eficiencia'],
    umbralActivacion: 3.3,
    categoria: 'carga_trabajo',
    incluidoEnPrecio: true,
    duracion: '90 minutos',
    formato: 'Programa grupal',
    participantes: 'Todos los colaboradores'
  },
  {
    id: 'cliente-dificil',
    nombre: 'Identificando y Gestionando al Cliente Difícil',
    descripcion: 'En este taller práctico los equipos aprenderán a identificar los diferentes perfiles de clientes difíciles, entender las razones detrás de sus comportamientos y aplicar herramientas efectivas para manejarlos.',
    icono: '🤝',
    dimensiones: ['carga_trabajo', 'estres', 'comunicacion', 'conflictos', 'resolucion', 'bienestar_emocional'],
    umbralActivacion: 3.3,
    categoria: 'carga_trabajo',
    incluidoEnPrecio: true,
    duracion: '90 minutos',
    formato: 'Programa grupal',
    participantes: 'Equipos de servicio y atención al cliente'
  },

  // ── COMUNICACIÓN ──
  {
    id: 'comunicacion-360',
    nombre: 'Comunicación 360°',
    descripcion: 'Este programa está diseñado para transformar la forma en que los líderes transmiten la estrategia a sus equipos. Se enfoca en eliminar el ruido informativo y asegurar que cada mensaje inspire acción, seguridad y confianza.',
    icono: '💬',
    dimensiones: ['comunicacion', 'transparencia', 'informacion', 'liderazgo', 'confianza'],
    umbralActivacion: 3.5,
    categoria: 'comunicacion',
    incluidoEnPrecio: true,
    duracion: '6 horas (4 sesiones de 90 min)',
    formato: 'Programa grupal',
    participantes: 'Líderes y mandos medios'
  },

  // ── DESARROLLO PROFESIONAL ──
  {
    id: 'smart-skills',
    nombre: 'SMART Skills',
    descripcion: 'Programas de capacitación especializada en habilidades de alta demanda diseñados de forma personalizada para mantener a los colaboradores a la vanguardia de su sector.',
    icono: '🚀',
    dimensiones: ['desarrollo', 'crecimiento', 'capacitacion', 'carrera', 'competencias'],
    umbralActivacion: 3.5,
    categoria: 'desarrollo_profesional',
    incluidoEnPrecio: false,
    duracion: 'Según programa',
    formato: 'Capacitación especializada',
    participantes: 'Colaboradores según necesidad'
  },
  {
    id: 'habilidades-blandas',
    nombre: 'El Poder de las Habilidades Blandas',
    descripcion: 'Talleres enfocados en la inteligencia emocional, gestión del cambio, liderazgo, gestión del estrés y otros programas enfocados a desarrollar habilidades que permitan a los miembros del equipo fortalecer su liderazgo personal.',
    icono: '💡',
    dimensiones: ['desarrollo', 'crecimiento', 'liderazgo', 'inteligencia_emocional', 'resiliencia', 'colaboracion'],
    umbralActivacion: 3.5,
    categoria: 'desarrollo_profesional',
    incluidoEnPrecio: true,
    duracion: 'Según programa',
    formato: 'Programa grupal',
    participantes: 'Todos los colaboradores'
  },

  // ── BIENESTAR GENERAL ──
  {
    id: 'gestion-energia',
    nombre: 'De Gestión del Tiempo a la Gestión de Energía',
    descripcion: 'Un programa práctico que enseña a los colaboradores a optimizar su jornada laboral basándose en sus picos de energía biológica, permitiéndoles trabajar de forma más fluida y sin agotamiento.',
    icono: '⚡',
    dimensiones: ['balance_vida_trabajo', 'carga_trabajo', 'estres', 'bienestar_emocional', 'horarios'],
    umbralActivacion: 3.3,
    categoria: 'bienestar_general',
    incluidoEnPrecio: true,
    duracion: '2 sesiones mensuales',
    formato: 'Programa grupal',
    participantes: 'Todos los colaboradores'
  },
  {
    id: 'pausa-consciente',
    nombre: 'Pausa Consciente para tu Calma Laboral',
    descripcion: 'Actividades como sesiones guiadas de estiramientos ergonómicos, respiración y relajación diseñadas para realizarse fuera y/o dentro del entorno laboral, ayudando a liberar la tensión física y mental.',
    icono: '🧘',
    dimensiones: ['estres', 'salud_mental', 'bienestar_emocional', 'presion', 'condiciones_fisicas'],
    umbralActivacion: 3.3,
    categoria: 'bienestar_general',
    incluidoEnPrecio: true,
    duracion: 'Sesiones periódicas',
    formato: 'Programa grupal',
    participantes: 'Todos los colaboradores'
  },

  // ── CONSULTORÍA ──
  {
    id: 'smart-advisory',
    nombre: 'SMART Advisory',
    descripcion: 'Un servicio de acompañamiento experto diseñado para ayudar a las empresas a interpretar los datos de la plataforma, obtener una visión externa y objetiva de su situación actual y diseñar planes de acción a medida que mejoren la experiencia de cada colaborador.',
    icono: '📊',
    dimensiones: ['clima_laboral', 'ambiente_trabajo', 'liderazgo', 'comunicacion', 'desarrollo'],
    umbralActivacion: 3.5,
    categoria: 'consultoria',
    incluidoEnPrecio: true,
    duracion: '2 sesiones de 30 min/mes',
    formato: 'Consultoría estratégica',
    participantes: 'Dirección y RRHH'
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
    const serviciosGenerales = ['liderazgo-consciente', 'smart-care', 'pausa-consciente'];
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
    salud_mental: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700' },
    clima_laboral: { bg: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-700' },
    carga_trabajo: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700' },
    comunicacion: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' },
    desarrollo_profesional: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700' },
    bienestar_general: { bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-700' },
    consultoria: { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700' }
  };
  return colores[categoria] || { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700' };
};
