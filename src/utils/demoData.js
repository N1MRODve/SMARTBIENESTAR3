import { reactive } from 'vue';

const getDemoModeFromStorage = () => {
  try {
    return localStorage.getItem('demo_mode') === 'true';
  } catch {
    return false;
  }
};

export const DEMO_MODE = reactive({
  enabled: getDemoModeFromStorage()
});

export const enableDemoMode = () => {
  DEMO_MODE.enabled = true;
  try {
    localStorage.setItem('demo_mode', 'true');
  } catch (err) {
    console.error('Error saving demo mode:', err);
  }
};

export const disableDemoMode = () => {
  DEMO_MODE.enabled = false;
  try {
    localStorage.removeItem('demo_mode');
  } catch (err) {
    console.error('Error removing demo mode:', err);
  }
};

export const demoData = {
  empresa: {
    id: 'demo-empresa-1',
    nombre: 'SportLife Performance',
    descripcion: 'Centro deportivo de alto rendimiento',
    sector: 'Deportes y Fitness',
    logo_url: 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=200',
    fecha_creacion: '2023-01-15T00:00:00Z'
  },

  departamentos: [
    { id: 'demo-dept-1', nombre: 'Entrenamiento Personal', codigo: 'ENT', activo: true, empresa_id: 'demo-empresa-1' },
    { id: 'demo-dept-2', nombre: 'Nutrición Deportiva', codigo: 'NUT', activo: true, empresa_id: 'demo-empresa-1' },
    { id: 'demo-dept-3', nombre: 'Fisioterapia', codigo: 'FIS', activo: true, empresa_id: 'demo-empresa-1' },
    { id: 'demo-dept-4', nombre: 'Recepción y Atención', codigo: 'REC', activo: true, empresa_id: 'demo-empresa-1' },
    { id: 'demo-dept-5', nombre: 'Clases Grupales', codigo: 'GRP', activo: true, empresa_id: 'demo-empresa-1' },
    { id: 'demo-dept-6', nombre: 'Dirección', codigo: 'DIR', activo: true, empresa_id: 'demo-empresa-1' }
  ],

  empleados: [
    {
      id: 'demo-emp-1',
      nombre: 'Carlos Martínez',
      email: 'carlos.martinez@sportlife.com',
      departamento_id: 'demo-dept-1',
      departamentos: { id: 'demo-dept-1', nombre: 'Entrenamiento Personal' },
      cargo: 'Director de Entrenamiento',
      fecha_ingreso: '2023-01-15',
      puntos: 2450,
      es_admin: true,
      activo: true,
      telefono: '+34 612 345 678'
    },
    {
      id: 'demo-emp-2',
      nombre: 'Laura González',
      email: 'laura.gonzalez@sportlife.com',
      departamento_id: 'demo-dept-2',
      departamentos: { id: 'demo-dept-2', nombre: 'Nutrición Deportiva' },
      cargo: 'Nutricionista Jefe',
      fecha_ingreso: '2023-02-01',
      puntos: 2180,
      es_admin: false,
      activo: true,
      telefono: '+34 623 456 789'
    },
    {
      id: 'demo-emp-3',
      nombre: 'Javier Ruiz',
      email: 'javier.ruiz@sportlife.com',
      departamento_id: 'demo-dept-3',
      departamentos: { id: 'demo-dept-3', nombre: 'Fisioterapia' },
      cargo: 'Fisioterapeuta Senior',
      fecha_ingreso: '2023-03-10',
      puntos: 1920,
      es_admin: false,
      activo: true,
      telefono: '+34 634 567 890'
    },
    {
      id: 'demo-emp-4',
      nombre: 'Ana Morales',
      email: 'ana.morales@sportlife.com',
      departamento_id: 'demo-dept-1',
      departamentos: { id: 'demo-dept-1', nombre: 'Entrenamiento Personal' },
      cargo: 'Entrenadora Personal',
      fecha_ingreso: '2023-04-05',
      puntos: 1750,
      es_admin: false,
      activo: true,
      telefono: '+34 645 678 901'
    },
    {
      id: 'demo-emp-5',
      nombre: 'Miguel Sánchez',
      email: 'miguel.sanchez@sportlife.com',
      departamento_id: 'demo-dept-5',
      departamentos: { id: 'demo-dept-5', nombre: 'Clases Grupales' },
      cargo: 'Instructor de Spinning',
      fecha_ingreso: '2023-05-20',
      puntos: 1650,
      es_admin: false,
      activo: true,
      telefono: '+34 656 789 012'
    },
    {
      id: 'demo-emp-6',
      nombre: 'Patricia Fernández',
      email: 'patricia.fernandez@sportlife.com',
      departamento_id: 'demo-dept-4',
      departamentos: { id: 'demo-dept-4', nombre: 'Recepción y Atención' },
      cargo: 'Coordinadora de Recepción',
      fecha_ingreso: '2023-06-01',
      puntos: 1580,
      es_admin: false,
      activo: true,
      telefono: '+34 667 890 123'
    },
    {
      id: 'demo-emp-7',
      nombre: 'Roberto Díaz',
      email: 'roberto.diaz@sportlife.com',
      departamento_id: 'demo-dept-1',
      departamentos: { id: 'demo-dept-1', nombre: 'Entrenamiento Personal' },
      cargo: 'Entrenador Personal',
      fecha_ingreso: '2023-07-15',
      puntos: 1420,
      es_admin: false,
      activo: true,
      telefono: '+34 678 901 234'
    },
    {
      id: 'demo-emp-8',
      nombre: 'Carmen López',
      email: 'carmen.lopez@sportlife.com',
      departamento_id: 'demo-dept-5',
      departamentos: { id: 'demo-dept-5', nombre: 'Clases Grupales' },
      cargo: 'Instructora de Yoga',
      fecha_ingreso: '2023-08-01',
      puntos: 1380,
      es_admin: false,
      activo: true,
      telefono: '+34 689 012 345'
    },
    {
      id: 'demo-emp-9',
      nombre: 'David Torres',
      email: 'david.torres@sportlife.com',
      departamento_id: 'demo-dept-2',
      departamentos: { id: 'demo-dept-2', nombre: 'Nutrición Deportiva' },
      cargo: 'Nutricionista',
      fecha_ingreso: '2023-09-10',
      puntos: 1250,
      es_admin: false,
      activo: true,
      telefono: '+34 690 123 456'
    },
    {
      id: 'demo-emp-10',
      nombre: 'Elena Ramírez',
      email: 'elena.ramirez@sportlife.com',
      departamento_id: 'demo-dept-4',
      departamentos: { id: 'demo-dept-4', nombre: 'Recepción y Atención' },
      cargo: 'Recepcionista',
      fecha_ingreso: '2023-10-05',
      puntos: 1180,
      es_admin: false,
      activo: true,
      telefono: '+34 601 234 567'
    },
    {
      id: 'demo-emp-11',
      nombre: 'Fernando Ortiz',
      email: 'fernando.ortiz@sportlife.com',
      departamento_id: 'demo-dept-3',
      departamentos: { id: 'demo-dept-3', nombre: 'Fisioterapia' },
      cargo: 'Fisioterapeuta',
      fecha_ingreso: '2023-11-15',
      puntos: 1050,
      es_admin: false,
      activo: true,
      telefono: '+34 612 345 678'
    },
    {
      id: 'demo-emp-12',
      nombre: 'Sofía Jiménez',
      email: 'sofia.jimenez@sportlife.com',
      departamento_id: 'demo-dept-6',
      departamentos: { id: 'demo-dept-6', nombre: 'Dirección' },
      cargo: 'Gerente General',
      fecha_ingreso: '2023-01-15',
      puntos: 2650,
      es_admin: true,
      activo: true,
      telefono: '+34 623 456 789'
    }
  ],

  comunicados: [
    {
      id: 'demo-com-1',
      titulo: '¡Nueva zona de CrossFit inaugurada!',
      contenido: 'Nos complace anunciar la apertura de nuestra nueva zona de CrossFit completamente equipada. Incluye rigs olímpicos, kettlebells de competición y todo lo necesario para llevar tu entrenamiento funcional al siguiente nivel.',
      tipo: 'anuncio',
      prioridad: 'alta',
      fecha_publicacion: '2024-11-10T09:00:00Z',
      estado: 'publicado',
      autor_id: 'demo-emp-1',
      autor: { id: 'demo-emp-1', nombre: 'Carlos Martínez' },
      empresa_id: 'demo-empresa-1',
      lecturas: 89,
      total_destinatarios: 120
    },
    {
      id: 'demo-com-2',
      titulo: 'Horarios especiales por festivo',
      contenido: 'Les recordamos que el próximo festivo permaneceremos abiertos en horario especial de 08:00 a 15:00. Todas las clases grupales se mantendrán según programación matutina.',
      tipo: 'informativo',
      prioridad: 'media',
      fecha_publicacion: '2024-11-08T10:30:00Z',
      estado: 'publicado',
      autor_id: 'demo-emp-12',
      autor: { id: 'demo-emp-12', nombre: 'Sofía Jiménez' },
      empresa_id: 'demo-empresa-1',
      lecturas: 102,
      total_destinatarios: 120
    },
    {
      id: 'demo-com-3',
      titulo: 'Nuevos planes nutricionales personalizados',
      contenido: 'El departamento de nutrición lanza un nuevo servicio de planes alimenticios 100% personalizados. Incluye seguimiento semanal, recetas adaptadas y ajustes según tus objetivos deportivos.',
      tipo: 'servicio',
      prioridad: 'media',
      fecha_publicacion: '2024-11-05T08:00:00Z',
      estado: 'publicado',
      autor_id: 'demo-emp-2',
      autor: { id: 'demo-emp-2', nombre: 'Laura González' },
      empresa_id: 'demo-empresa-1',
      lecturas: 78,
      total_destinatarios: 120
    },
    {
      id: 'demo-com-4',
      titulo: 'Protocolo de mantenimiento instalaciones',
      contenido: 'Informamos que durante esta semana se realizará mantenimiento preventivo en vestuarios y duchas. Los trabajos se ejecutarán en horario nocturno para minimizar las molestias.',
      tipo: 'mantenimiento',
      prioridad: 'baja',
      fecha_publicacion: '2024-11-01T07:00:00Z',
      estado: 'publicado',
      autor_id: 'demo-emp-12',
      autor: { id: 'demo-emp-12', nombre: 'Sofía Jiménez' },
      empresa_id: 'demo-empresa-1',
      lecturas: 95,
      total_destinatarios: 120
    },
    {
      id: 'demo-com-5',
      titulo: 'Jornada de formación en primeros auxilios',
      contenido: 'El próximo viernes 15 realizaremos una jornada obligatoria de formación en primeros auxilios deportivos. La sesión será impartida por la Cruz Roja y tendrá una duración de 4 horas.',
      tipo: 'formacion',
      prioridad: 'alta',
      fecha_publicacion: '2024-10-28T09:00:00Z',
      estado: 'publicado',
      autor_id: 'demo-emp-1',
      autor: { id: 'demo-emp-1', nombre: 'Carlos Martínez' },
      empresa_id: 'demo-empresa-1',
      lecturas: 112,
      total_destinatarios: 120
    }
  ],

  encuestas: [
    {
      id: 'demo-enc-1',
      titulo: 'Clima Laboral SportLife - Q4 2024',
      descripcion: 'Encuesta trimestral para medir el bienestar y satisfacción del equipo',
      tipo: 'clima',
      estado: 'activa',
      fecha_creacion: '2024-11-01T00:00:00Z',
      fecha_inicio: '2024-11-05T00:00:00Z',
      fecha_fin: '2024-11-20T23:59:59Z',
      empresa_id: 'demo-empresa-1',
      respuestas_totales: 87,
      respuestas_objetivo: 120,
      porcentaje_participacion: 72.5,
      preguntas_encuesta: [
        {
          id: 'demo-preg-1',
          texto: '¿Cómo calificarías tu satisfacción general con tu trabajo en SportLife?',
          tipo: 'escala',
          orden: 1,
          opciones: { min: 1, max: 10, labels: { min: 'Muy insatisfecho', max: 'Muy satisfecho' } }
        },
        {
          id: 'demo-preg-2',
          texto: '¿Te sientes valorado por tu equipo y superiores?',
          tipo: 'escala',
          orden: 2,
          opciones: { min: 1, max: 10 }
        },
        {
          id: 'demo-preg-3',
          texto: '¿Qué aspecto crees que podríamos mejorar?',
          tipo: 'opcion_multiple',
          orden: 3,
          opciones: ['Comunicación interna', 'Equipamiento deportivo', 'Beneficios para empleados', 'Horarios', 'Formación continua', 'Ambiente laboral']
        }
      ]
    },
    {
      id: 'demo-enc-2',
      titulo: 'Evaluación de Nuevas Instalaciones',
      descripcion: 'Tu opinión sobre la nueva zona de CrossFit',
      tipo: 'satisfaccion',
      estado: 'finalizada',
      fecha_creacion: '2024-10-15T00:00:00Z',
      fecha_inicio: '2024-10-20T00:00:00Z',
      fecha_fin: '2024-10-31T23:59:59Z',
      empresa_id: 'demo-empresa-1',
      respuestas_totales: 98,
      respuestas_objetivo: 120,
      porcentaje_participacion: 81.7
    }
  ],

  recompensas: [
    {
      id: 'demo-rec-1',
      nombre: 'Día libre adicional',
      descripcion: 'Un día libre extra para disfrutar como quieras',
      costo_puntos: 500,
      categoria: 'tiempo',
      disponible: true,
      stock: 10,
      imagen_url: 'https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg?auto=compress&cs=tinysrgb&w=400',
      empresa_id: 'demo-empresa-1'
    },
    {
      id: 'demo-rec-2',
      nombre: 'Pack suplementos deportivos',
      descripcion: 'Kit completo de suplementación deportiva premium',
      costo_puntos: 300,
      categoria: 'bienestar',
      disponible: true,
      stock: 15,
      imagen_url: 'https://images.pexels.com/photos/4047145/pexels-photo-4047145.jpeg?auto=compress&cs=tinysrgb&w=400',
      empresa_id: 'demo-empresa-1'
    },
    {
      id: 'demo-rec-3',
      nombre: 'Masaje deportivo 60min',
      descripcion: 'Sesión de masaje deportivo de recuperación',
      costo_puntos: 200,
      categoria: 'bienestar',
      disponible: true,
      stock: 20,
      imagen_url: 'https://images.pexels.com/photos/3997993/pexels-photo-3997993.jpeg?auto=compress&cs=tinysrgb&w=400',
      empresa_id: 'demo-empresa-1'
    },
    {
      id: 'demo-rec-4',
      nombre: 'Ropa deportiva premium',
      descripcion: 'Set de ropa deportiva de alta gama',
      costo_puntos: 400,
      categoria: 'material',
      disponible: true,
      stock: 8,
      imagen_url: 'https://images.pexels.com/photos/8846253/pexels-photo-8846253.jpeg?auto=compress&cs=tinysrgb&w=400',
      empresa_id: 'demo-empresa-1'
    },
    {
      id: 'demo-rec-5',
      nombre: 'Vale comida saludable',
      descripcion: 'Vale de 50€ para restaurantes saludables',
      costo_puntos: 250,
      categoria: 'alimentacion',
      disponible: true,
      stock: 25,
      imagen_url: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
      empresa_id: 'demo-empresa-1'
    }
  ],

  estadisticas: {
    dashboard: {
      empleadosActivos: 120,
      tasaParticipacion: 87.5,
      puntosOtorgados: 45670,
      encuestasActivas: 2,
      comunicadosEsteMes: 12,
      satisfaccionGeneral: 8.4
    },
    participacion: {
      porDepartamento: [
        { departamento: 'Entrenamiento Personal', participacion: 92, empleados: 35 },
        { departamento: 'Nutrición Deportiva', participacion: 88, empleados: 15 },
        { departamento: 'Fisioterapia', participacion: 85, empleados: 12 },
        { departamento: 'Clases Grupales', participacion: 90, empleados: 28 },
        { departamento: 'Recepción y Atención', participacion: 82, empleados: 18 },
        { departamento: 'Dirección', participacion: 100, empleados: 12 }
      ],
      tendenciaMensual: [
        { mes: 'Jun', participacion: 78 },
        { mes: 'Jul', participacion: 82 },
        { mes: 'Ago', participacion: 79 },
        { mes: 'Sep', participacion: 85 },
        { mes: 'Oct', participacion: 87 },
        { mes: 'Nov', participacion: 88 }
      ]
    },
    encuestas: {
      promedioRespuestas: 8.4,
      dimensiones: [
        { nombre: 'Liderazgo', valor: 8.7 },
        { nombre: 'Comunicación', valor: 8.2 },
        { nombre: 'Recursos', valor: 8.9 },
        { nombre: 'Reconocimiento', valor: 7.8 },
        { nombre: 'Desarrollo', valor: 8.5 },
        { nombre: 'Balance vida-trabajo', valor: 8.3 }
      ]
    }
  },

  servicios: [
    {
      id: 'demo-serv-1',
      nombre: 'Asesoría Nutricional',
      descripcion: 'Consulta personalizada con nutricionista deportivo',
      categoria: 'nutricion',
      duracion_minutos: 60,
      disponible: true,
      imagen_url: 'https://images.pexels.com/photos/6551415/pexels-photo-6551415.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 'demo-serv-2',
      nombre: 'Sesión Fisioterapia',
      descripcion: 'Tratamiento de lesiones y recuperación muscular',
      categoria: 'salud',
      duracion_minutos: 45,
      disponible: true,
      imagen_url: 'https://images.pexels.com/photos/5473180/pexels-photo-5473180.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 'demo-serv-3',
      nombre: 'Coaching Deportivo',
      descripcion: 'Mentoría para alcanzar tus objetivos deportivos',
      categoria: 'entrenamiento',
      duracion_minutos: 90,
      disponible: true,
      imagen_url: 'https://images.pexels.com/photos/4162491/pexels-photo-4162491.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ]
};
