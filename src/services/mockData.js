export const FITCORP_MOCK_DATA = {
  empresa: {
    id: 'techpulse-demo-001',
    nombre: 'TechPulse Consulting',
    dominio_email: 'techpulse.com',
    logo_url: null,
    direccion: 'C/ Tecnología 42, Madrid',
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
    { id: 'dep-001', nombre: 'Desarrollo de Software', empresa_id: 'techpulse-demo-001', color: '#FF5722' },
    { id: 'dep-002', nombre: 'QA y Testing', empresa_id: 'techpulse-demo-001', color: '#2196F3' },
    { id: 'dep-003', nombre: 'DevOps e Infraestructura', empresa_id: 'techpulse-demo-001', color: '#4CAF50' },
    { id: 'dep-004', nombre: 'Diseño UX/UI', empresa_id: 'techpulse-demo-001', color: '#9C27B0' },
    { id: 'dep-005', nombre: 'Gestión de Proyectos', empresa_id: 'techpulse-demo-001', color: '#607D8B' }
  ],

  empleados: [
    {
      id: 'emp-001',
      nombre: 'Carlos',
      apellidos: 'Martínez García',
      email: 'carlos.martinez@techpulse.com',
      cargo: 'Director de Tecnología',
      departamento_id: 'dep-001',
      departamento_nombre: 'Desarrollo de Software',
      estado: 'Activo',
      fecha_ingreso: '2023-01-10',
      puntos_bienestar: 2450,
      telefono: '+34 600 111 001'
    },
    {
      id: 'emp-002',
      nombre: 'María',
      apellidos: 'Rodríguez López',
      email: 'maria.rodriguez@techpulse.com',
      cargo: 'Senior Full Stack Developer',
      departamento_id: 'dep-001',
      departamento_nombre: 'Desarrollo de Software',
      estado: 'Activo',
      fecha_ingreso: '2023-03-15',
      puntos_bienestar: 2180,
      telefono: '+34 600 111 002'
    },
    {
      id: 'emp-003',
      nombre: 'David',
      apellidos: 'Hernández Ruiz',
      email: 'david.hernandez@techpulse.com',
      cargo: 'QA Lead',
      departamento_id: 'dep-002',
      departamento_nombre: 'QA y Testing',
      estado: 'Activo',
      fecha_ingreso: '2023-02-20',
      puntos_bienestar: 1980,
      telefono: '+34 600 111 003'
    },
    {
      id: 'emp-004',
      nombre: 'Laura',
      apellidos: 'González Sánchez',
      email: 'laura.gonzalez@techpulse.com',
      cargo: 'DevOps Engineer',
      departamento_id: 'dep-003',
      departamento_nombre: 'DevOps e Infraestructura',
      estado: 'Activo',
      fecha_ingreso: '2023-04-01',
      puntos_bienestar: 2340,
      telefono: '+34 600 111 004'
    },
    {
      id: 'emp-005',
      nombre: 'Javier',
      apellidos: 'Pérez Moreno',
      email: 'javier.perez@techpulse.com',
      cargo: 'Lead UX Designer',
      departamento_id: 'dep-004',
      departamento_nombre: 'Diseño UX/UI',
      estado: 'Activo',
      fecha_ingreso: '2023-05-10',
      puntos_bienestar: 2120,
      telefono: '+34 600 111 005'
    },
    {
      id: 'emp-006',
      nombre: 'Ana',
      apellidos: 'Jiménez Torres',
      email: 'ana.jimenez@techpulse.com',
      cargo: 'Backend Developer',
      departamento_id: 'dep-001',
      departamento_nombre: 'Desarrollo de Software',
      estado: 'Activo',
      fecha_ingreso: '2023-06-15',
      puntos_bienestar: 1850,
      telefono: '+34 600 111 006'
    },
    {
      id: 'emp-007',
      nombre: 'Roberto',
      apellidos: 'Fernández Castro',
      email: 'roberto.fernandez@techpulse.com',
      cargo: 'Project Manager',
      departamento_id: 'dep-005',
      departamento_nombre: 'Gestión de Proyectos',
      estado: 'Activo',
      fecha_ingreso: '2023-01-05',
      puntos_bienestar: 2650,
      telefono: '+34 600 111 007'
    },
    {
      id: 'emp-008',
      nombre: 'Elena',
      apellidos: 'Ramírez Ortiz',
      email: 'elena.ramirez@techpulse.com',
      cargo: 'Frontend Developer',
      departamento_id: 'dep-001',
      departamento_nombre: 'Desarrollo de Software',
      estado: 'Activo',
      fecha_ingreso: '2023-07-20',
      puntos_bienestar: 1920,
      telefono: '+34 600 111 008'
    },
    {
      id: 'emp-009',
      nombre: 'Miguel',
      apellidos: 'Torres Vega',
      email: 'miguel.torres@techpulse.com',
      cargo: 'QA Automation Engineer',
      departamento_id: 'dep-002',
      departamento_nombre: 'QA y Testing',
      estado: 'Activo',
      fecha_ingreso: '2023-08-01',
      puntos_bienestar: 1760,
      telefono: '+34 600 111 009'
    },
    {
      id: 'emp-010',
      nombre: 'Carmen',
      apellidos: 'Álvarez Romero',
      email: 'carmen.alvarez@techpulse.com',
      cargo: 'Cloud Architect',
      departamento_id: 'dep-003',
      departamento_nombre: 'DevOps e Infraestructura',
      estado: 'Activo',
      fecha_ingreso: '2023-09-10',
      puntos_bienestar: 2050,
      telefono: '+34 600 111 010'
    },
    {
      id: 'emp-011',
      nombre: 'Alberto',
      apellidos: 'Navarro Gil',
      email: 'alberto.navarro@techpulse.com',
      cargo: 'Senior Backend Developer',
      departamento_id: 'dep-001',
      departamento_nombre: 'Desarrollo de Software',
      estado: 'Activo',
      fecha_ingreso: '2023-02-28',
      puntos_bienestar: 2280,
      telefono: '+34 600 111 011'
    },
    {
      id: 'emp-012',
      nombre: 'Patricia',
      apellidos: 'Molina Serrano',
      email: 'patricia.molina@techpulse.com',
      cargo: 'UI Designer',
      departamento_id: 'dep-004',
      departamento_nombre: 'Diseño UX/UI',
      estado: 'Activo',
      fecha_ingreso: '2023-03-05',
      puntos_bienestar: 2410,
      telefono: '+34 600 111 012'
    },
    {
      id: 'emp-013',
      nombre: 'Francisco',
      apellidos: 'Cabrera Ruiz',
      email: 'francisco.cabrera@techpulse.com',
      cargo: 'Junior Developer',
      departamento_id: 'dep-001',
      departamento_nombre: 'Desarrollo de Software',
      estado: 'Activo',
      fecha_ingreso: '2023-10-01',
      puntos_bienestar: 1650,
      telefono: '+34 600 111 013'
    },
    {
      id: 'emp-014',
      nombre: 'Beatriz',
      apellidos: 'Mendoza Prieto',
      email: 'beatriz.mendoza@techpulse.com',
      cargo: 'Scrum Master',
      departamento_id: 'dep-005',
      departamento_nombre: 'Gestión de Proyectos',
      estado: 'Activo',
      fecha_ingreso: '2023-01-20',
      puntos_bienestar: 2320,
      telefono: '+34 600 111 014'
    },
    {
      id: 'emp-015',
      nombre: 'Sergio',
      apellidos: 'Campos Herrera',
      email: 'sergio.campos@techpulse.com',
      cargo: 'QA Tester',
      departamento_id: 'dep-002',
      departamento_nombre: 'QA y Testing',
      estado: 'Activo',
      fecha_ingreso: '2023-11-15',
      puntos_bienestar: 1540,
      telefono: '+34 600 111 015'
    }
  ],

  servicios: [
    {
      id: 'srv-001',
      titulo: 'Pausas Activas',
      descripcion: 'Sesiones grupales de ejercicios y estiramientos para prevenir fatiga y mejorar la postura.',
      categoria: 'bienestar',
      proveedor: 'TechWellness Team',
      duracion: 15,
      precio: 0,
      modalidad: 'presencial',
      ubicacion: 'Sala de Bienestar - Planta 3',
      imagen_url: null,
      activo: true,
      cupos_disponibles: 12,
      fecha_inicio: '2024-12-01',
      fecha_fin: '2024-12-31'
    },
    {
      id: 'srv-002',
      titulo: 'Ergonomía y Postura',
      descripcion: 'Evaluación ergonómica personalizada de tu puesto de trabajo y recomendaciones para prevenir lesiones.',
      categoria: 'salud',
      proveedor: 'Fisioterapeuta Ocupacional',
      duracion: 45,
      precio: 0,
      modalidad: 'presencial',
      ubicacion: 'Tu Puesto de Trabajo',
      imagen_url: null,
      activo: true,
      cupos_disponibles: 8,
      fecha_inicio: '2024-12-01',
      fecha_fin: '2024-12-31'
    },
    {
      id: 'srv-003',
      titulo: 'Asesoría Nutricional',
      descripcion: 'Consultas con nutricionista para mejorar tus hábitos alimenticios y energía.',
      categoria: 'nutricion',
      proveedor: 'Nutricionista TechPulse',
      duracion: 50,
      precio: 0,
      modalidad: 'online',
      ubicacion: 'Videollamada',
      imagen_url: null,
      activo: true,
      cupos_disponibles: 6,
      fecha_inicio: '2024-12-01',
      fecha_fin: '2024-12-31'
    },
    {
      id: 'srv-004',
      titulo: 'Mindfulness para Developers',
      descripcion: 'Técnicas de meditación y gestión del estrés adaptadas al trabajo en tecnología.',
      categoria: 'psicologia',
      proveedor: 'Coach de Mindfulness',
      duracion: 45,
      precio: 0,
      modalidad: 'online',
      ubicacion: 'Plataforma Virtual',
      imagen_url: null,
      activo: true,
      cupos_disponibles: 15,
      fecha_inicio: '2024-12-01',
      fecha_fin: '2024-12-31'
    },
    {
      id: 'srv-005',
      titulo: 'Salud Visual',
      descripcion: 'Revisión de salud ocular y recomendaciones para reducir fatiga visual por pantallas.',
      categoria: 'salud',
      proveedor: 'Optometrista Asociado',
      duracion: 30,
      precio: 0,
      modalidad: 'presencial',
      ubicacion: 'Consultorio Médico',
      imagen_url: null,
      activo: true,
      cupos_disponibles: 10,
      fecha_inicio: '2024-12-01',
      fecha_fin: '2024-12-31'
    },
    {
      id: 'srv-006',
      titulo: 'Yoga en la Oficina',
      descripcion: 'Sesiones de yoga adaptadas para reducir tensión muscular por trabajo sedentario.',
      categoria: 'bienestar',
      proveedor: 'Instructor de Yoga',
      duracion: 60,
      precio: 0,
      modalidad: 'presencial',
      ubicacion: 'Sala de Bienestar',
      imagen_url: null,
      activo: true,
      cupos_disponibles: 15,
      fecha_inicio: '2024-12-01',
      fecha_fin: '2024-12-31'
    },
    {
      id: 'srv-007',
      titulo: 'Masaje Terapéutico',
      descripcion: 'Masajes descontracturantes para aliviar tensión en cuello, hombros y espalda.',
      categoria: 'recuperacion',
      proveedor: 'Fisioterapeuta',
      duracion: 45,
      precio: 0,
      modalidad: 'presencial',
      ubicacion: 'Sala de Terapias',
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
      titulo: 'Nueva Certificación AWS para el Equipo',
      contenido: 'TechPulse cubrirá el 100% del costo de certificaciones AWS para developers y DevOps. ¡Inscríbete ya!',
      tipo: 'anuncio',
      prioridad: 'alta',
      fecha_publicacion: '2024-11-20T09:00:00Z',
      activo: true,
      leido: false
    },
    {
      id: 'com-002',
      titulo: 'Horarios Flexibles de Verano',
      contenido: 'A partir del próximo mes, implementamos jornada intensiva los viernes de julio y agosto.',
      tipo: 'informacion',
      prioridad: 'media',
      fecha_publicacion: '2024-11-18T14:30:00Z',
      activo: true,
      leido: true
    },
    {
      id: 'com-003',
      titulo: 'Tech Talk: Microservicios con Kubernetes',
      contenido: 'Este viernes 24 a las 17:00, charla técnica sobre arquitectura de microservicios. Snacks incluidos.',
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
      titulo: 'Bienvenida a Nueva Tech Lead',
      contenido: 'Damos la bienvenida a Sara González, Tech Lead con 10 años de experiencia en arquitectura cloud.',
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
      descripcion: 'Encuesta trimestral sobre satisfacción y bienestar en TechPulse',
      tipo: 'clima_laboral',
      estado: 'activa',
      fecha_inicio: '2024-11-20',
      fecha_fin: '2024-11-30',
      respuestas_totales: 38,
      respuestas_objetivo: 45,
      participacion: 84,
      puntos_otorgados: 100
    },
    {
      id: 'enc-002',
      titulo: 'Evaluación de Herramientas y Tecnología',
      descripcion: 'Tu opinión sobre las herramientas de desarrollo y servicios de bienestar',
      tipo: 'satisfaccion',
      estado: 'activa',
      fecha_inicio: '2024-11-21',
      fecha_fin: '2024-11-27',
      respuestas_totales: 29,
      respuestas_objetivo: 45,
      participacion: 64,
      puntos_otorgados: 150
    }
  ],

  recompensas: [
    {
      id: 'rec-001',
      nombre: 'Curso Online Udemy',
      descripcion: 'Acceso a cualquier curso de desarrollo en Udemy',
      puntos_requeridos: 500,
      categoria: 'formacion',
      stock: 20,
      imagen_url: null,
      activa: true
    },
    {
      id: 'rec-002',
      nombre: 'Silla Ergonómica Premium',
      descripcion: 'Silla de oficina ergonómica de alta gama para tu puesto',
      puntos_requeridos: 750,
      categoria: 'equipamiento',
      stock: 8,
      imagen_url: null,
      activa: true
    },
    {
      id: 'rec-003',
      nombre: 'Entrada para Conferencia Tech',
      descripcion: 'Ticket para asistir a conferencias tecnológicas nacionales',
      puntos_requeridos: 1200,
      categoria: 'experiencia',
      stock: 6,
      imagen_url: null,
      activa: true
    },
    {
      id: 'rec-004',
      nombre: 'Gadgets Tech',
      descripcion: 'Auriculares, teclados mecánicos, mouse gaming y más',
      puntos_requeridos: 1000,
      categoria: 'equipamiento',
      stock: 12,
      imagen_url: null,
      activa: true
    },
    {
      id: 'rec-005',
      nombre: 'Día Libre Adicional',
      descripcion: 'Un día libre extra para descansar y recargar energías',
      puntos_requeridos: 1500,
      categoria: 'bienestar',
      stock: 10,
      imagen_url: null,
      activa: true
    },
    {
      id: 'rec-006',
      nombre: 'Mentoría con Tech Lead',
      descripcion: 'Sesión personalizada de mentoría técnica con nuestro Tech Lead',
      puntos_requeridos: 2000,
      categoria: 'desarrollo',
      stock: 5,
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
      hora: '11:00',
      estado: 'confirmada',
      sesionInfo: {
        titulo: 'Pausas Activas',
        fecha: '2024-11-25',
        hora: '11:00',
        ubicacion: 'Sala de Bienestar - Planta 3'
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
        titulo: 'Mindfulness para Developers',
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
      servicio_titulo: 'Ergonomía y Postura',
      fecha_solicitud: '2024-11-22T10:30:00Z',
      fecha_preferente: '2024-11-28',
      hora_preferente: '11:00',
      estado: 'pendiente',
      comentarios: 'Dolor en cuello y hombros por largas jornadas frente al ordenador'
    },
    {
      id: 'sol-002',
      empleado_id: 'emp-013',
      empleado_nombre: 'Francisco Cabrera Ruiz',
      servicio_id: 'srv-003',
      servicio_titulo: 'Asesoría Nutricional',
      fecha_solicitud: '2024-11-21T15:00:00Z',
      fecha_preferente: '2024-11-27',
      hora_preferente: '14:00',
      estado: 'pendiente',
      comentarios: 'Necesito mejorar mis hábitos alimenticios y aumentar energía durante el día'
    },
    {
      id: 'sol-003',
      empleado_id: 'emp-006',
      empleado_nombre: 'Ana Jiménez Torres',
      servicio_id: 'srv-007',
      servicio_titulo: 'Masaje Terapéutico',
      fecha_solicitud: '2024-11-23T09:15:00Z',
      fecha_preferente: '2024-11-25',
      hora_preferente: '18:00',
      estado: 'aprobada',
      comentarios: 'Tensión muscular en espalda por postura frente al ordenador'
    }
  ],

  gamificacion: {
    'emp-001': {
      puntos: 2450,
      nivel: 8,
      insignias: ['primera_reserva', 'participacion_activa', 'wellness_champion'],
      racha_dias: 45
    }
  },

  analitica: {
    bienestar_global: 4.5,
    variacion_trimestral: 0.4,
    participacion_global: 92,
    alertas_activas: 0,
    encuestas_activas: 2,
    encuestas_completadas: 8,
    empleados_totales: 45,
    departamentos_fuertes: [
      { nombre: 'Diseño UX/UI', empleados: 2, promedio: 4.8, tendencia: 'up' },
      { nombre: 'DevOps e Infraestructura', empleados: 2, promedio: 4.7, tendencia: 'up' },
      { nombre: 'Desarrollo de Software', empleados: 9, promedio: 4.6, tendencia: 'up' }
    ],
    departamentos_criticos: []
  },

  evolucion: [
    { mes: 'Jun 2024', valor: 4.1, participacion: 38 },
    { mes: 'Jul 2024', valor: 4.2, participacion: 40 },
    { mes: 'Ago 2024', valor: 4.3, participacion: 41 },
    { mes: 'Sep 2024', valor: 4.4, participacion: 42 },
    { mes: 'Oct 2024', valor: 4.4, participacion: 43 },
    { mes: 'Nov 2024', valor: 4.5, participacion: 44 }
  ],

  categorias: [
    { categoria: 'Salud Mental', valor: 4.6, variacion: 0.5 },
    { categoria: 'Ergonomía', valor: 4.7, variacion: 0.4 },
    { categoria: 'Desarrollo Profesional', valor: 4.5, variacion: 0.3 },
    { categoria: 'Motivación', valor: 4.4, variacion: 0.6 },
    { categoria: 'Balance Vida-Trabajo', valor: 4.2, variacion: 0.2 }
  ],

  gamificacion: {
    reglas_puntos: {
      encuesta_completada: 100,
      encuesta_rapida: 150,
      participacion_mensual_completa: 200,
      referir_empleado: 50,
      sugerencia_implementada: 300,
      asistencia_evento: 75
    },
    descripcion: 'Los puntos se acumulan automáticamente al participar en encuestas, eventos y actividades de bienestar. Cada encuesta completada suma 100 puntos base, con bonificaciones por rapidez y participación consistente.'
  },

  recompensas: [
    {
      id: 'rec-001',
      nombre: 'Curso Online Udemy',
      descripcion: 'Acceso a cualquier curso de desarrollo, cloud, o diseño en Udemy.',
      categoria: 'formacion',
      puntos_requeridos: 500,
      stock_disponible: 15,
      stock_total: 20,
      imagen_url: null,
      activo: true,
      validez_dias: 90,
      fecha_creacion: '2024-10-01',
      instrucciones_uso: 'Contactar con RRHH para recibir el código de acceso. Curso a elegir.'
    },
    {
      id: 'rec-002',
      nombre: 'Silla Ergonómica Premium',
      descripcion: 'Silla de oficina ergonómica Herman Miller o similar para tu puesto.',
      categoria: 'equipamiento',
      puntos_requeridos: 800,
      stock_disponible: 4,
      stock_total: 10,
      imagen_url: null,
      activo: true,
      validez_dias: 30,
      fecha_creacion: '2024-10-01',
      instrucciones_uso: 'Solicitar en administración. Se instalará en tu puesto de trabajo.'
    },
    {
      id: 'rec-003',
      nombre: 'Masaje Terapéutico',
      descripcion: 'Sesión de masaje de 45 minutos para aliviar tensión muscular.',
      categoria: 'bienestar',
      puntos_requeridos: 400,
      stock_disponible: 15,
      stock_total: 30,
      imagen_url: null,
      activo: true,
      validez_dias: 60,
      fecha_creacion: '2024-10-01',
      instrucciones_uso: 'Reservar con 48 horas de anticipación en bienestar.'
    },
    {
      id: 'rec-004',
      nombre: 'Merchandising TechPulse',
      descripcion: 'Set completo: camiseta, sudadera y botella con logo TechPulse.',
      categoria: 'merchandising',
      puntos_requeridos: 1200,
      stock_disponible: 10,
      stock_total: 20,
      imagen_url: null,
      activo: true,
      validez_dias: 180,
      fecha_creacion: '2024-10-01',
      instrucciones_uso: 'Especificar talla al momento del canje en recepción.'
    },
    {
      id: 'rec-005',
      nombre: 'Asesoría Nutricional',
      descripcion: 'Consulta completa con nutricionista + plan alimenticio de 4 semanas.',
      categoria: 'bienestar',
      puntos_requeridos: 1000,
      stock_disponible: 5,
      stock_total: 10,
      imagen_url: null,
      activo: true,
      validez_dias: 90,
      fecha_creacion: '2024-10-01',
      instrucciones_uso: 'Agendar cita con el servicio de nutrición.'
    },
    {
      id: 'rec-006',
      nombre: 'Día Libre Adicional',
      descripcion: 'Un día libre extra para usar cuando lo necesites.',
      categoria: 'beneficio',
      puntos_requeridos: 2000,
      stock_disponible: 20,
      stock_total: 50,
      imagen_url: null,
      activo: true,
      validez_dias: 365,
      fecha_creacion: '2024-10-01',
      instrucciones_uso: 'Solicitar con 15 días de anticipación a recursos humanos.'
    },
    {
      id: 'rec-007',
      nombre: 'Gadget Tech a Elección',
      descripcion: 'Auriculares noise-cancelling, teclado mecánico, o mouse ergonómico.',
      categoria: 'tecnologia',
      puntos_requeridos: 3500,
      stock_disponible: 5,
      stock_total: 10,
      imagen_url: null,
      activo: true,
      validez_dias: 30,
      fecha_creacion: '2024-10-01',
      instrucciones_uso: 'Recoger en administración. Incluye garantía de 1 año.'
    },
    {
      id: 'rec-008',
      nombre: 'Sesión de Yoga',
      descripcion: 'Sesión privada de yoga para reducir estrés y mejorar postura.',
      categoria: 'bienestar',
      puntos_requeridos: 600,
      stock_disponible: 12,
      stock_total: 25,
      imagen_url: null,
      activo: true,
      validez_dias: 60,
      fecha_creacion: '2024-10-15',
      instrucciones_uso: 'Reservar en el área de bienestar.'
    },
    {
      id: 'rec-009',
      nombre: 'Revisión de Salud Visual',
      descripcion: 'Examen completo de vista y recomendaciones para trabajo con pantallas.',
      categoria: 'salud',
      puntos_requeridos: 300,
      stock_disponible: 20,
      stock_total: 40,
      imagen_url: null,
      activo: true,
      validez_dias: 90,
      fecha_creacion: '2024-10-15',
      instrucciones_uso: 'Agendar con el servicio de salud ocupacional.'
    },
    {
      id: 'rec-010',
      nombre: 'Ticket para Conferencia Tech',
      descripcion: 'Entrada para asistir a una conferencia tecnológica nacional.',
      categoria: 'formacion',
      puntos_requeridos: 1500,
      stock_disponible: 8,
      stock_total: 15,
      imagen_url: null,
      activo: true,
      validez_dias: 180,
      fecha_creacion: '2024-11-01',
      instrucciones_uso: 'Coordinar con RRHH. Incluye gastos de transporte.'
    }
  ],

  canjes: [
    {
      id: 'can-001',
      empleado_id: 'emp-001',
      empleado_nombre: 'Carlos Martínez García',
      recompensa_id: 'rec-001',
      recompensa_nombre: 'Curso Online Udemy',
      puntos_utilizados: 500,
      fecha_canje: '2024-11-15T10:30:00Z',
      estado: 'utilizado',
      codigo_canje: 'TECH-2024-001',
      fecha_expiracion: '2025-02-13',
      fecha_uso: '2024-11-18T15:00:00Z'
    },
    {
      id: 'can-002',
      empleado_id: 'emp-003',
      empleado_nombre: 'David Hernández Ruiz',
      recompensa_id: 'rec-003',
      recompensa_nombre: 'Masaje Terapéutico',
      puntos_utilizados: 400,
      fecha_canje: '2024-11-10T14:20:00Z',
      estado: 'utilizado',
      codigo_canje: 'TECH-2024-002',
      fecha_expiracion: '2025-01-09',
      fecha_uso: '2024-11-12T11:30:00Z'
    },
    {
      id: 'can-003',
      empleado_id: 'emp-004',
      empleado_nombre: 'Laura González Sánchez',
      recompensa_id: 'rec-002',
      recompensa_nombre: 'Silla Ergonómica Premium',
      puntos_utilizados: 800,
      fecha_canje: '2024-11-05T09:15:00Z',
      estado: 'utilizado',
      codigo_canje: 'TECH-2024-003',
      fecha_expiracion: '2024-12-05',
      fecha_uso: '2024-11-06T08:00:00Z'
    },
    {
      id: 'can-004',
      empleado_id: 'emp-002',
      empleado_nombre: 'María Rodríguez López',
      recompensa_id: 'rec-009',
      recompensa_nombre: 'Revisión de Salud Visual',
      puntos_utilizados: 300,
      fecha_canje: '2024-11-20T16:45:00Z',
      estado: 'pendiente',
      codigo_canje: 'TECH-2024-004',
      fecha_expiracion: '2025-02-18',
      fecha_uso: null
    },
    {
      id: 'can-005',
      empleado_id: 'emp-007',
      empleado_nombre: 'Roberto Fernández Castro',
      recompensa_id: 'rec-004',
      recompensa_nombre: 'Merchandising TechPulse',
      puntos_utilizados: 1200,
      fecha_canje: '2024-10-28T11:00:00Z',
      estado: 'utilizado',
      codigo_canje: 'TECH-2024-005',
      fecha_expiracion: '2025-04-26',
      fecha_uso: '2024-10-30T10:00:00Z'
    },
    {
      id: 'can-006',
      empleado_id: 'emp-005',
      empleado_nombre: 'Javier Pérez Moreno',
      recompensa_id: 'rec-008',
      recompensa_nombre: 'Sesión de Yoga',
      puntos_utilizados: 600,
      fecha_canje: '2024-11-18T13:30:00Z',
      estado: 'pendiente',
      codigo_canje: 'TECH-2024-006',
      fecha_expiracion: '2025-01-17',
      fecha_uso: null
    },
    {
      id: 'can-007',
      empleado_id: 'emp-006',
      empleado_nombre: 'Ana Jiménez Torres',
      recompensa_id: 'rec-003',
      recompensa_nombre: 'Masaje Terapéutico',
      puntos_utilizados: 400,
      fecha_canje: '2024-11-08T15:20:00Z',
      estado: 'utilizado',
      codigo_canje: 'TECH-2024-007',
      fecha_expiracion: '2025-01-07',
      fecha_uso: '2024-11-10T16:00:00Z'
    },
    {
      id: 'can-008',
      empleado_id: 'emp-001',
      empleado_nombre: 'Carlos Martínez García',
      recompensa_id: 'rec-005',
      recompensa_nombre: 'Asesoría Nutricional',
      puntos_utilizados: 1000,
      fecha_canje: '2024-10-15T10:00:00Z',
      estado: 'utilizado',
      codigo_canje: 'TECH-2024-008',
      fecha_expiracion: '2025-01-13',
      fecha_uso: '2024-10-20T09:00:00Z'
    },
    {
      id: 'can-009',
      empleado_id: 'emp-009',
      empleado_nombre: 'Miguel Torres Vega',
      recompensa_id: 'rec-001',
      recompensa_nombre: 'Curso Online Udemy',
      puntos_utilizados: 500,
      fecha_canje: '2024-11-22T12:15:00Z',
      estado: 'pendiente',
      codigo_canje: 'TECH-2024-009',
      fecha_expiracion: '2025-02-20',
      fecha_uso: null
    },
    {
      id: 'can-010',
      empleado_id: 'emp-008',
      empleado_nombre: 'Elena Ramírez Ortiz',
      recompensa_id: 'rec-010',
      recompensa_nombre: 'Ticket para Conferencia Tech',
      puntos_utilizados: 1500,
      fecha_canje: '2024-11-01T08:00:00Z',
      estado: 'utilizado',
      codigo_canje: 'TECH-2024-010',
      fecha_expiracion: '2024-12-01',
      fecha_uso: '2024-11-02T07:00:00Z'
    }
  ],

  participacion: {
    estadisticas: {
      tasaPromedio: 92,
      totalRespondidos: 368,
      totalEnviados: 400,
      encuestasActivas: 2,
      totalEncuestas: 8,
      encuestasCerradas: 6
    },

    evolucionEncuestas: [
      {
        fecha: '2024-09-15',
        encuesta: 'Bienestar y Clima Laboral Q3',
        tasa: 95,
        respondidos: 43,
        enviados: 45
      },
      {
        fecha: '2024-08-20',
        encuesta: 'Evaluación de Servicios Deportivos',
        tasa: 91,
        respondidos: 41,
        enviados: 45
      },
      {
        fecha: '2024-07-10',
        encuesta: 'Salud Mental y Estrés',
        tasa: 89,
        respondidos: 40,
        enviados: 45
      },
      {
        fecha: '2024-06-05',
        encuesta: 'Nutrición y Hábitos Alimenticios',
        tasa: 93,
        respondidos: 42,
        enviados: 45
      },
      {
        fecha: '2024-05-12',
        encuesta: 'Satisfacción con Instalaciones',
        tasa: 88,
        respondidos: 39,
        enviados: 44
      },
      {
        fecha: '2024-04-18',
        encuesta: 'Evaluación Trimestral Q2',
        tasa: 94,
        respondidos: 41,
        enviados: 44
      }
    ],

    encuestasDetalle: [
      {
        id: 'enc-001',
        titulo: 'Clima Organizacional Noviembre 2024',
        estado: 'activa',
        fecha_envio: '2024-11-20',
        fecha_cierre: '2024-11-30',
        enviados: 45,
        respondidos: 42,
        departamentos: [
          { nombre: 'Entrenamiento Deportivo', enviados: 9, respondidos: 9 },
          { nombre: 'Fisioterapia', enviados: 12, respondidos: 11 },
          { nombre: 'Nutrición Deportiva', enviados: 2, respondidos: 2 },
          { nombre: 'Psicología Deportiva', enviados: 2, respondidos: 2 },
          { nombre: 'Administración', enviados: 20, respondidos: 18 }
        ]
      },
      {
        id: 'enc-002',
        titulo: 'Evaluación de Programas de Bienestar',
        estado: 'activa',
        fecha_envio: '2024-11-22',
        fecha_cierre: '2024-12-05',
        enviados: 45,
        respondidos: 38,
        departamentos: [
          { nombre: 'Entrenamiento Deportivo', enviados: 9, respondidos: 8 },
          { nombre: 'Fisioterapia', enviados: 12, respondidos: 11 },
          { nombre: 'Nutrición Deportiva', enviados: 2, respondidos: 2 },
          { nombre: 'Psicología Deportiva', enviados: 2, respondidos: 2 },
          { nombre: 'Administración', enviados: 20, respondidos: 15 }
        ]
      },
      {
        id: 'enc-003',
        titulo: 'Bienestar y Clima Laboral Q3',
        estado: 'finalizada',
        fecha_envio: '2024-09-15',
        fecha_cierre: '2024-09-25',
        enviados: 45,
        respondidos: 43,
        departamentos: [
          { nombre: 'Entrenamiento Deportivo', enviados: 9, respondidos: 9 },
          { nombre: 'Fisioterapia', enviados: 12, respondidos: 12 },
          { nombre: 'Nutrición Deportiva', enviados: 2, respondidos: 2 },
          { nombre: 'Psicología Deportiva', enviados: 2, respondidos: 2 },
          { nombre: 'Administración', enviados: 20, respondidos: 18 }
        ]
      }
    ],

    departamentosExtemos: {
      mejor: { nombre: 'Entrenamiento Deportivo', tasa: 98, enviados: 27, respondidos: 27 },
      peor: { nombre: 'Administración', tasa: 85, enviados: 60, respondidos: 51 }
    }
  }
};
