export const FITCORP_MOCK_DATA = {
  empresa: {
    id: 'fitcorp-demo-001',
    nombre: 'FitCorp High Performance',
    dominio_email: 'fitcorp.com',
    logo_url: null,
    direccion: 'Av. Olímpica 2024, Madrid',
    telefono: '+34 91 555 0123',
    activo: true,
    fecha_registro: '2024-01-15T00:00:00Z'
  },

  estadisticas: {
    dashboard: {
      totalEmpleados: 45,
      comunicadosActivos: 8,
      encuestasActivas: 2,
      recompensasDisponibles: 12,
      participacionGeneral: 92,
      satisfaccionGeneral: 9.1
    }
  },

  metricas: {
    saludMental: 9.2,
    ergonomia: 8.8,
    satisfaccionLaboral: 9.0,
    balanceVidaTrabajo: 8.5,
    ambienteLaboral: 9.3
  },

  departamentos: [
    { id: 'dep-001', nombre: 'Entrenamiento Deportivo', empresa_id: 'fitcorp-demo-001', color: '#FF5722' },
    { id: 'dep-002', nombre: 'Fisioterapia', empresa_id: 'fitcorp-demo-001', color: '#2196F3' },
    { id: 'dep-003', nombre: 'Nutrición Deportiva', empresa_id: 'fitcorp-demo-001', color: '#4CAF50' },
    { id: 'dep-004', nombre: 'Psicología Deportiva', empresa_id: 'fitcorp-demo-001', color: '#9C27B0' },
    { id: 'dep-005', nombre: 'Administración', empresa_id: 'fitcorp-demo-001', color: '#607D8B' }
  ],

  empleados: [
    {
      id: 'emp-001',
      nombre: 'Carlos',
      apellidos: 'Martínez García',
      email: 'carlos.martinez@fitcorp.com',
      cargo: 'Director Técnico',
      departamento_id: 'dep-001',
      departamento_nombre: 'Entrenamiento Deportivo',
      estado: 'Activo',
      fecha_ingreso: '2023-01-10',
      puntos_bienestar: 2450,
      telefono: '+34 600 111 001'
    },
    {
      id: 'emp-002',
      nombre: 'María',
      apellidos: 'Rodríguez López',
      email: 'maria.rodriguez@fitcorp.com',
      cargo: 'Entrenadora Senior',
      departamento_id: 'dep-001',
      departamento_nombre: 'Entrenamiento Deportivo',
      estado: 'Activo',
      fecha_ingreso: '2023-03-15',
      puntos_bienestar: 2180,
      telefono: '+34 600 111 002'
    },
    {
      id: 'emp-003',
      nombre: 'David',
      apellidos: 'Hernández Ruiz',
      email: 'david.hernandez@fitcorp.com',
      cargo: 'Fisioterapeuta Deportivo',
      departamento_id: 'dep-002',
      departamento_nombre: 'Fisioterapia',
      estado: 'Activo',
      fecha_ingreso: '2023-02-20',
      puntos_bienestar: 1980,
      telefono: '+34 600 111 003'
    },
    {
      id: 'emp-004',
      nombre: 'Laura',
      apellidos: 'González Sánchez',
      email: 'laura.gonzalez@fitcorp.com',
      cargo: 'Nutricionista Deportiva',
      departamento_id: 'dep-003',
      departamento_nombre: 'Nutrición Deportiva',
      estado: 'Activo',
      fecha_ingreso: '2023-04-01',
      puntos_bienestar: 2340,
      telefono: '+34 600 111 004'
    },
    {
      id: 'emp-005',
      nombre: 'Javier',
      apellidos: 'Pérez Moreno',
      email: 'javier.perez@fitcorp.com',
      cargo: 'Psicólogo Deportivo',
      departamento_id: 'dep-004',
      departamento_nombre: 'Psicología Deportiva',
      estado: 'Activo',
      fecha_ingreso: '2023-05-10',
      puntos_bienestar: 2120,
      telefono: '+34 600 111 005'
    },
    {
      id: 'emp-006',
      nombre: 'Ana',
      apellidos: 'Jiménez Torres',
      email: 'ana.jimenez@fitcorp.com',
      cargo: 'Preparadora Física',
      departamento_id: 'dep-001',
      departamento_nombre: 'Entrenamiento Deportivo',
      estado: 'Activo',
      fecha_ingreso: '2023-06-15',
      puntos_bienestar: 1850,
      telefono: '+34 600 111 006'
    },
    {
      id: 'emp-007',
      nombre: 'Roberto',
      apellidos: 'Fernández Castro',
      email: 'roberto.fernandez@fitcorp.com',
      cargo: 'Coordinador de Bienestar',
      departamento_id: 'dep-005',
      departamento_nombre: 'Administración',
      estado: 'Activo',
      fecha_ingreso: '2023-01-05',
      puntos_bienestar: 2650,
      telefono: '+34 600 111 007'
    },
    {
      id: 'emp-008',
      nombre: 'Elena',
      apellidos: 'Ramírez Ortiz',
      email: 'elena.ramirez@fitcorp.com',
      cargo: 'Entrenadora Personal',
      departamento_id: 'dep-001',
      departamento_nombre: 'Entrenamiento Deportivo',
      estado: 'Activo',
      fecha_ingreso: '2023-07-20',
      puntos_bienestar: 1920,
      telefono: '+34 600 111 008'
    },
    {
      id: 'emp-009',
      nombre: 'Miguel',
      apellidos: 'Torres Vega',
      email: 'miguel.torres@fitcorp.com',
      cargo: 'Fisioterapeuta',
      departamento_id: 'dep-002',
      departamento_nombre: 'Fisioterapia',
      estado: 'Activo',
      fecha_ingreso: '2023-08-01',
      puntos_bienestar: 1760,
      telefono: '+34 600 111 009'
    },
    {
      id: 'emp-010',
      nombre: 'Carmen',
      apellidos: 'Álvarez Romero',
      email: 'carmen.alvarez@fitcorp.com',
      cargo: 'Nutricionista',
      departamento_id: 'dep-003',
      departamento_nombre: 'Nutrición Deportiva',
      estado: 'Activo',
      fecha_ingreso: '2023-09-10',
      puntos_bienestar: 2050,
      telefono: '+34 600 111 010'
    },
    {
      id: 'emp-011',
      nombre: 'Alberto',
      apellidos: 'Navarro Gil',
      email: 'alberto.navarro@fitcorp.com',
      cargo: 'Entrenador de Alto Rendimiento',
      departamento_id: 'dep-001',
      departamento_nombre: 'Entrenamiento Deportivo',
      estado: 'Activo',
      fecha_ingreso: '2023-02-28',
      puntos_bienestar: 2280,
      telefono: '+34 600 111 011'
    },
    {
      id: 'emp-012',
      nombre: 'Patricia',
      apellidos: 'Molina Serrano',
      email: 'patricia.molina@fitcorp.com',
      cargo: 'Coordinadora de Psicología',
      departamento_id: 'dep-004',
      departamento_nombre: 'Psicología Deportiva',
      estado: 'Activo',
      fecha_ingreso: '2023-03-05',
      puntos_bienestar: 2410,
      telefono: '+34 600 111 012'
    },
    {
      id: 'emp-013',
      nombre: 'Francisco',
      apellidos: 'Cabrera Ruiz',
      email: 'francisco.cabrera@fitcorp.com',
      cargo: 'Asistente Técnico',
      departamento_id: 'dep-001',
      departamento_nombre: 'Entrenamiento Deportivo',
      estado: 'Activo',
      fecha_ingreso: '2023-10-01',
      puntos_bienestar: 1650,
      telefono: '+34 600 111 013'
    },
    {
      id: 'emp-014',
      nombre: 'Beatriz',
      apellidos: 'Mendoza Prieto',
      email: 'beatriz.mendoza@fitcorp.com',
      cargo: 'Responsable de Operaciones',
      departamento_id: 'dep-005',
      departamento_nombre: 'Administración',
      estado: 'Activo',
      fecha_ingreso: '2023-01-20',
      puntos_bienestar: 2320,
      telefono: '+34 600 111 014'
    },
    {
      id: 'emp-015',
      nombre: 'Sergio',
      apellidos: 'Campos Herrera',
      email: 'sergio.campos@fitcorp.com',
      cargo: 'Especialista en Recuperación',
      departamento_id: 'dep-002',
      departamento_nombre: 'Fisioterapia',
      estado: 'Activo',
      fecha_ingreso: '2023-11-15',
      puntos_bienestar: 1540,
      telefono: '+34 600 111 015'
    }
  ],

  servicios: [
    {
      id: 'srv-001',
      titulo: 'Entrenamiento Funcional',
      descripcion: 'Sesiones personalizadas de entrenamiento funcional para mejorar fuerza, movilidad y rendimiento deportivo.',
      categoria: 'fitness',
      proveedor: 'FitCorp Training Team',
      duracion: 60,
      precio: 0,
      modalidad: 'presencial',
      ubicacion: 'Centro de Alto Rendimiento - Sala A',
      imagen_url: null,
      activo: true,
      cupos_disponibles: 8,
      fecha_inicio: '2024-12-01',
      fecha_fin: '2024-12-31'
    },
    {
      id: 'srv-002',
      titulo: 'Fisioterapia Deportiva',
      descripcion: 'Tratamiento especializado para prevención y recuperación de lesiones deportivas.',
      categoria: 'salud',
      proveedor: 'Equipo de Fisioterapia FitCorp',
      duracion: 45,
      precio: 0,
      modalidad: 'presencial',
      ubicacion: 'Clínica FitCorp',
      imagen_url: null,
      activo: true,
      cupos_disponibles: 6,
      fecha_inicio: '2024-12-01',
      fecha_fin: '2024-12-31'
    },
    {
      id: 'srv-003',
      titulo: 'Nutrición para Atletas',
      descripcion: 'Asesoramiento nutricional personalizado para optimizar el rendimiento deportivo y la recuperación.',
      categoria: 'nutricion',
      proveedor: 'Departamento de Nutrición',
      duracion: 50,
      precio: 0,
      modalidad: 'presencial',
      ubicacion: 'Consultorio Nutrición',
      imagen_url: null,
      activo: true,
      cupos_disponibles: 5,
      fecha_inicio: '2024-12-01',
      fecha_fin: '2024-12-31'
    },
    {
      id: 'srv-004',
      titulo: 'Mindfulness para la Competición',
      descripcion: 'Técnicas de concentración y gestión del estrés pre-competitivo.',
      categoria: 'psicologia',
      proveedor: 'Psicología Deportiva FitCorp',
      duracion: 45,
      precio: 0,
      modalidad: 'online',
      ubicacion: 'Plataforma Virtual',
      imagen_url: null,
      activo: true,
      cupos_disponibles: 12,
      fecha_inicio: '2024-12-01',
      fecha_fin: '2024-12-31'
    },
    {
      id: 'srv-005',
      titulo: 'Evaluación de Rendimiento',
      descripcion: 'Análisis completo de capacidades físicas con tecnología de vanguardia.',
      categoria: 'evaluacion',
      proveedor: 'Laboratorio de Rendimiento',
      duracion: 90,
      precio: 0,
      modalidad: 'presencial',
      ubicacion: 'Laboratorio - Planta 2',
      imagen_url: null,
      activo: true,
      cupos_disponibles: 4,
      fecha_inicio: '2024-12-01',
      fecha_fin: '2024-12-31'
    },
    {
      id: 'srv-006',
      titulo: 'Yoga para Deportistas',
      descripcion: 'Sesiones de yoga enfocadas en flexibilidad y recuperación activa.',
      categoria: 'bienestar',
      proveedor: 'Instructor Certificado',
      duracion: 60,
      precio: 0,
      modalidad: 'presencial',
      ubicacion: 'Sala de Actividades Grupales',
      imagen_url: null,
      activo: true,
      cupos_disponibles: 15,
      fecha_inicio: '2024-12-01',
      fecha_fin: '2024-12-31'
    },
    {
      id: 'srv-007',
      titulo: 'Masaje Deportivo',
      descripcion: 'Terapia manual para recuperación muscular post-entrenamiento.',
      categoria: 'recuperacion',
      proveedor: 'Equipo de Recuperación',
      duracion: 45,
      precio: 0,
      modalidad: 'presencial',
      ubicacion: 'Sala de Masajes',
      imagen_url: null,
      activo: true,
      cupos_disponibles: 6,
      fecha_inicio: '2024-12-01',
      fecha_fin: '2024-12-31'
    }
  ],

  comunicados: [
    {
      id: 'com-001',
      titulo: 'Nuevo Reto: Carrera 10K de Verano',
      contenido: 'Únete al desafío colectivo de completar 10 kilómetros. ¡Premios para los primeros 10 finalistas!',
      tipo: 'anuncio',
      prioridad: 'alta',
      fecha_publicacion: '2024-11-20T09:00:00Z',
      activo: true,
      leido: false
    },
    {
      id: 'com-002',
      titulo: 'Nuevos Horarios de Fisioterapia',
      contenido: 'A partir del próximo lunes, la clínica de fisioterapia ampliará su horario de 7:00 a 21:00.',
      tipo: 'informacion',
      prioridad: 'media',
      fecha_publicacion: '2024-11-18T14:30:00Z',
      activo: true,
      leido: true
    },
    {
      id: 'com-003',
      titulo: 'Taller de Nutrición Deportiva',
      contenido: 'Este viernes 24 a las 17:00, taller gratuito sobre alimentación pre y post competición.',
      tipo: 'evento',
      prioridad: 'media',
      fecha_publicacion: '2024-11-19T10:00:00Z',
      activo: true,
      leido: false
    },
    {
      id: 'com-004',
      titulo: 'Resultados Encuesta de Clima',
      contenido: 'Ya están disponibles los resultados de la última encuesta. ¡Gracias por vuestra participación!',
      tipo: 'resultado',
      prioridad: 'baja',
      fecha_publicacion: '2024-11-15T11:00:00Z',
      activo: true,
      leido: true
    },
    {
      id: 'com-005',
      titulo: 'Incorporación de Nuevo Entrenador',
      contenido: 'Damos la bienvenida a Jorge Martín, especialista en alto rendimiento con 15 años de experiencia.',
      tipo: 'anuncio',
      prioridad: 'media',
      fecha_publicacion: '2024-11-17T12:00:00Z',
      activo: true,
      leido: true
    }
  ],

  encuestas: [
    {
      id: 'enc-001',
      titulo: 'Clima Laboral - Noviembre 2024',
      descripcion: 'Encuesta trimestral sobre satisfacción y bienestar en FitCorp',
      tipo: 'clima_laboral',
      estado: 'activa',
      fecha_inicio: '2024-11-20',
      fecha_fin: '2024-11-30',
      respuestas_totales: 38,
      respuestas_objetivo: 45,
      participacion: 84
    },
    {
      id: 'enc-002',
      titulo: 'Evaluación de Servicios Deportivos',
      descripcion: 'Tu opinión sobre nuestros programas de entrenamiento y recuperación',
      tipo: 'satisfaccion',
      estado: 'activa',
      fecha_inicio: '2024-11-21',
      fecha_fin: '2024-11-27',
      respuestas_totales: 29,
      respuestas_objetivo: 45,
      participacion: 64
    }
  ],

  recompensas: [
    {
      id: 'rec-001',
      nombre: 'Sesión Premium de Crioterapia',
      descripcion: 'Tratamiento de recuperación con tecnología de vanguardia',
      puntos_requeridos: 500,
      categoria: 'recuperacion',
      stock: 8,
      imagen_url: null,
      activa: true
    },
    {
      id: 'rec-002',
      nombre: 'Kit de Suplementación Mensual',
      descripcion: 'Pack personalizado de vitaminas y suplementos deportivos',
      puntos_requeridos: 750,
      categoria: 'nutricion',
      stock: 12,
      imagen_url: null,
      activa: true
    },
    {
      id: 'rec-003',
      nombre: 'Entrada Doble para Evento Deportivo',
      descripcion: 'Acceso VIP a competiciones nacionales',
      puntos_requeridos: 1200,
      categoria: 'experiencia',
      stock: 4,
      imagen_url: null,
      activa: true
    },
    {
      id: 'rec-004',
      nombre: 'Equipamiento Deportivo Premium',
      descripcion: 'Elige entre ropa técnica, calzado o accesorios de entrenamiento',
      puntos_requeridos: 1000,
      categoria: 'equipamiento',
      stock: 10,
      imagen_url: null,
      activa: true
    },
    {
      id: 'rec-005',
      nombre: 'Día de Bienestar',
      descripcion: 'Jornada completa con masaje, sauna y nutricionista',
      puntos_requeridos: 1500,
      categoria: 'bienestar',
      stock: 5,
      imagen_url: null,
      activa: true
    },
    {
      id: 'rec-006',
      nombre: 'Sesión con Entrenador Elite',
      descripcion: 'Una sesión personalizada con nuestro director técnico',
      puntos_requeridos: 2000,
      categoria: 'entrenamiento',
      stock: 3,
      imagen_url: null,
      activa: true
    }
  ],

  reservas: [
    {
      id: 'res-001',
      empleado_id: 'emp-001',
      servicio_id: 'srv-001',
      fecha: '2024-11-25',
      hora: '09:00',
      estado: 'confirmada',
      sesionInfo: {
        titulo: 'Entrenamiento Funcional',
        fecha: '2024-11-25',
        hora: '09:00',
        ubicacion: 'Centro de Alto Rendimiento - Sala A'
      }
    },
    {
      id: 'res-002',
      empleado_id: 'emp-001',
      servicio_id: 'srv-004',
      fecha: '2024-11-26',
      hora: '16:00',
      estado: 'confirmada',
      sesionInfo: {
        titulo: 'Mindfulness para la Competición',
        fecha: '2024-11-26',
        hora: '16:00',
        ubicacion: 'Plataforma Virtual'
      }
    }
  ],

  solicitudes: [
    {
      id: 'sol-001',
      empleado_id: 'emp-008',
      empleado_nombre: 'Elena Ramírez Ortiz',
      servicio_id: 'srv-002',
      servicio_titulo: 'Fisioterapia Deportiva',
      fecha_solicitud: '2024-11-22T10:30:00Z',
      fecha_preferente: '2024-11-28',
      hora_preferente: '11:00',
      estado: 'pendiente',
      comentarios: 'Molestia en rodilla izquierda tras entrenamiento intensivo'
    },
    {
      id: 'sol-002',
      empleado_id: 'emp-013',
      empleado_nombre: 'Francisco Cabrera Ruiz',
      servicio_id: 'srv-003',
      servicio_titulo: 'Nutrición para Atletas',
      fecha_solicitud: '2024-11-21T15:00:00Z',
      fecha_preferente: '2024-11-27',
      hora_preferente: '14:00',
      estado: 'pendiente',
      comentarios: 'Necesito ajustar mi plan alimenticio para la fase de competición'
    },
    {
      id: 'sol-003',
      empleado_id: 'emp-006',
      empleado_nombre: 'Ana Jiménez Torres',
      servicio_id: 'srv-007',
      servicio_titulo: 'Masaje Deportivo',
      fecha_solicitud: '2024-11-23T09:15:00Z',
      fecha_preferente: '2024-11-25',
      hora_preferente: '18:00',
      estado: 'aprobada',
      comentarios: 'Recuperación post-entrenamiento de fuerza'
    }
  ],

  gamificacion: {
    'emp-001': {
      puntos: 2450,
      nivel: 8,
      insignias: ['primera_reserva', 'participacion_activa', 'wellness_champion'],
      racha_dias: 45
    }
  }
};
