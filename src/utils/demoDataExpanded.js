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

// Generadores de datos
const nombres = ['Carlos', 'Laura', 'Javier', 'Ana', 'Miguel', 'Patricia', 'Roberto', 'Carmen', 'David', 'Elena', 'Fernando', 'Sofía', 'Antonio', 'Isabel', 'José', 'María', 'Manuel', 'Rosa', 'Francisco', 'Teresa', 'Pedro', 'Lucía', 'Ángel', 'Marta', 'Luis', 'Cristina', 'Raúl', 'Pilar', 'Sergio', 'Beatriz', 'Alberto', 'Silvia', 'Jorge', 'Natalia', 'Daniel', 'Paula', 'Alejandro', 'Andrea', 'Víctor', 'Sara'];
const apellidos = ['Martínez', 'González', 'Ruiz', 'Morales', 'Sánchez', 'Fernández', 'Díaz', 'López', 'Torres', 'Ramírez', 'Ortiz', 'Jiménez', 'Vega', 'Castro', 'Romero', 'Navarro', 'Gil', 'Serrano', 'Blanco', 'Suárez', 'Molina', 'Vázquez', 'Ramos', 'Cruz', 'Flores', 'Herrera', 'Mendoza', 'Guerrero', 'Medina', 'Cortés'];

const cargos = {
  'demo-dept-1': ['Director de Entrenamiento', 'Entrenador Personal Senior', 'Entrenador Personal', 'Especialista en Fuerza', 'Especialista en Resistencia', 'Preparador Físico', 'Coach de Alto Rendimiento', 'Instructor Funcional'],
  'demo-dept-2': ['Nutricionista Jefe', 'Nutricionista Senior', 'Nutricionista', 'Dietista Deportivo', 'Consultor Nutricional'],
  'demo-dept-3': ['Fisioterapeuta Senior', 'Fisioterapeuta', 'Terapeuta Deportivo', 'Especialista en Recuperación', 'Masajista Deportivo'],
  'demo-dept-4': ['Coordinador de Recepción', 'Recepcionista Senior', 'Recepcionista', 'Atención al Cliente', 'Administrativo'],
  'demo-dept-5': ['Coordinador de Clases', 'Instructor de Spinning', 'Instructor de Yoga', 'Instructor de Pilates', 'Instructor de CrossFit', 'Instructor de Zumba', 'Instructor de HIIT', 'Instructor de Body Pump'],
  'demo-dept-6': ['Gerente General', 'Director de Operaciones', 'Director Financiero', 'Director de RRHH', 'Jefe de Marketing', 'Coordinador General', 'Analista de Negocios', 'Asistente de Dirección']
};

const departamentosConfig = [
  { id: 'demo-dept-1', nombre: 'Entrenamiento Personal', codigo: 'ENT', cantidad: 35 },
  { id: 'demo-dept-2', nombre: 'Nutrición Deportiva', codigo: 'NUT', cantidad: 15 },
  { id: 'demo-dept-3', nombre: 'Fisioterapia', codigo: 'FIS', cantidad: 12 },
  { id: 'demo-dept-4', nombre: 'Recepción y Atención', codigo: 'REC', cantidad: 18 },
  { id: 'demo-dept-5', nombre: 'Clases Grupales', codigo: 'GRP', cantidad: 28 },
  { id: 'demo-dept-6', nombre: 'Dirección', codigo: 'DIR', cantidad: 12 }
];

function generarEmpleados() {
  const empleados = [];
  let empleadoIndex = 1;
  const fechaBase = new Date('2023-01-15');

  departamentosConfig.forEach(dept => {
    const cargosDisponibles = cargos[dept.id];
    for (let i = 0; i < dept.cantidad; i++) {
      const nombreIndex = (empleadoIndex - 1) % nombres.length;
      const apellidoIndex = Math.floor((empleadoIndex - 1) / nombres.length) % apellidos.length;
      const nombre = nombres[nombreIndex];
      const apellido = apellidos[apellidoIndex];
      const nombreCompleto = `${nombre} ${apellido}`;
      const email = `${nombre.toLowerCase()}.${apellido.toLowerCase()}${empleadoIndex}@sportlife.com`;
      const cargoIndex = i % cargosDisponibles.length;
      const cargo = cargosDisponibles[cargoIndex];
      const diasDesdeFundacion = Math.floor((empleadoIndex - 1) * 365 / 120);
      const fechaIngreso = new Date(fechaBase);
      fechaIngreso.setDate(fechaIngreso.getDate() + diasDesdeFundacion);
      const antiguedad = 120 - empleadoIndex;
      const puntosBase = 1000 + (antiguedad * 15);
      const puntos = Math.round(puntosBase + (Math.random() * 500));
      const esAdmin = dept.id === 'demo-dept-6' && i < 3;

      empleados.push({
        id: `demo-emp-${empleadoIndex}`,
        nombre: nombreCompleto,
        email: email,
        departamento_id: dept.id,
        departamentos: { id: dept.id, nombre: dept.nombre },
        cargo: cargo,
        fecha_ingreso: fechaIngreso.toISOString().split('T')[0],
        puntos: puntos,
        es_admin: esAdmin,
        estado: 'Activo',
        activo: true,
        telefono: `+34 6${(10 + empleadoIndex).toString().padStart(2, '0')} ${(100 + (empleadoIndex % 900)).toString().padStart(3, '0')} ${(100 + ((empleadoIndex * 7) % 900)).toString().padStart(3, '0')}`
      });
      empleadoIndex++;
    }
  });
  return empleados;
}

// Generar respuestas de encuesta para los 120 empleados
function generarRespuestasEncuesta() {
  const respuestas = [];
  const empleados = generarEmpleados();
  // 87 respuestas (72.5% de 120)
  const empleadosQueResponden = empleados.slice(0, 87);

  empleadosQueResponden.forEach((emp, idx) => {
    // Pregunta 1: Escala 1-10
    respuestas.push({
      id: `demo-resp-${idx * 3 + 1}`,
      encuesta_id: 'demo-enc-1',
      pregunta_id: 'demo-preg-1',
      empleado_id: emp.id,
      respuesta: String(7 + Math.floor(Math.random() * 4)), // 7-10
      fecha_respuesta: '2024-11-12T10:00:00Z'
    });

    // Pregunta 2: Opción múltiple
    const opciones = ['muy_satisfecho', 'satisfecho', 'neutral'];
    respuestas.push({
      id: `demo-resp-${idx * 3 + 2}`,
      encuesta_id: 'demo-enc-1',
      pregunta_id: 'demo-preg-2',
      empleado_id: emp.id,
      respuesta: opciones[Math.floor(Math.random() * opciones.length)],
      fecha_respuesta: '2024-11-12T10:00:00Z'
    });

    // Pregunta 3: Escala 1-10
    respuestas.push({
      id: `demo-resp-${idx * 3 + 3}`,
      encuesta_id: 'demo-enc-1',
      pregunta_id: 'demo-preg-3',
      empleado_id: emp.id,
      respuesta: String(7 + Math.floor(Math.random() * 4)), // 7-10
      fecha_respuesta: '2024-11-12T10:00:00Z'
    });
  });

  return respuestas;
}

export const demoData = {
  empresa: {
    id: 'demo-empresa-1',
    nombre: 'SportLife Performance',
    descripcion: 'Centro deportivo de alto rendimiento',
    sector: 'Deportes y Fitness',
    logo_url: 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=200',
    fecha_creacion: '2023-01-15T00:00:00Z',
    onboarding_completado: true
  },

  departamentos: departamentosConfig.map(d => ({
    id: d.id,
    nombre: d.nombre,
    codigo: d.codigo,
    activo: true,
    empresa_id: 'demo-empresa-1'
  })),

  empleados: generarEmpleados(),

  encuestas: [
    {
      id: 'demo-enc-1',
      titulo: 'Clima Laboral SportLife - Q4 2024',
      descripcion: 'Encuesta trimestral para medir el clima laboral y satisfacción del equipo',
      estado: 'activa',
      fecha_inicio: '2024-11-01',
      fecha_fin: '2024-11-20',
      empresa_id: 'demo-empresa-1',
      creador_id: 'demo-emp-1',
      es_anonima: true,
      respuestas_count: 87,
      total_empleados: 120,
      progreso: 72.5
    },
    {
      id: 'demo-enc-2',
      titulo: 'Evaluación Servicios Nutricionales',
      descripcion: 'Feedback sobre los servicios del departamento de nutrición',
      estado: 'finalizada',
      fecha_inicio: '2024-10-01',
      fecha_fin: '2024-10-15',
      empresa_id: 'demo-empresa-1',
      creador_id: 'demo-emp-2',
      es_anonima: true,
      respuestas_count: 98,
      total_empleados: 120,
      progreso: 81.7
    }
  ],

  preguntas_encuesta: [
    {
      id: 'demo-preg-1',
      encuesta_id: 'demo-enc-1',
      texto: '¿Cómo calificarías el ambiente laboral en SportLife?',
      tipo: 'escala',
      opciones: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      requerida: true,
      orden: 1,
      categoria: 'Ambiente Laboral'
    },
    {
      id: 'demo-preg-2',
      encuesta_id: 'demo-enc-1',
      texto: '¿Qué tan satisfecho estás con las instalaciones y equipamiento?',
      tipo: 'opcion_multiple',
      opciones: ['muy_satisfecho', 'satisfecho', 'neutral', 'insatisfecho', 'muy_insatisfecho'],
      requerida: true,
      orden: 2,
      categoria: 'Recursos y Equipamiento'
    },
    {
      id: 'demo-preg-3',
      encuesta_id: 'demo-enc-1',
      texto: '¿Cómo valoras la comunicación con tu equipo y supervisores?',
      tipo: 'escala',
      opciones: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      requerida: true,
      orden: 3,
      categoria: 'Comunicación'
    }
  ],

  respuestas_encuesta: generarRespuestasEncuesta(),

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
      autor_id: 'demo-emp-120',
      autor: { id: 'demo-emp-120', nombre: 'Sara Cortés' },
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
      autor_id: 'demo-emp-36',
      autor: { id: 'demo-emp-36', nombre: 'Carlos González' },
      empresa_id: 'demo-empresa-1',
      lecturas: 95,
      total_destinatarios: 120
    },
    {
      id: 'demo-com-4',
      titulo: 'Mantenimiento programado instalaciones',
      contenido: 'Este sábado realizaremos mantenimiento preventivo de las máquinas de cardio. El área estará disponible desde las 14:00. Disculpen las molestias.',
      tipo: 'mantenimiento',
      prioridad: 'baja',
      fecha_publicacion: '2024-11-03T12:00:00Z',
      estado: 'publicado',
      autor_id: 'demo-emp-118',
      autor: { id: 'demo-emp-118', nombre: 'Víctor Medina' },
      empresa_id: 'demo-empresa-1',
      lecturas: 78,
      total_destinatarios: 120
    },
    {
      id: 'demo-com-5',
      titulo: 'Jornada de formación en primeros auxilios',
      contenido: 'Invitamos a todo el personal a participar en la jornada de formación en primeros auxilios deportivos. Será el próximo martes de 10:00 a 14:00. Inscripciones abiertas.',
      tipo: 'formacion',
      prioridad: 'alta',
      fecha_publicacion: '2024-11-01T09:00:00Z',
      estado: 'publicado',
      autor_id: 'demo-emp-119',
      autor: { id: 'demo-emp-119', nombre: 'Andrea Medina' },
      empresa_id: 'demo-empresa-1',
      lecturas: 112,
      total_destinatarios: 120
    }
  ],

  recompensas: [
    {
      id: 'demo-rec-1',
      nombre: 'Día libre adicional',
      descripcion: 'Un día libre adicional a tu elección',
      costo_puntos: 500,
      categoria: 'tiempo',
      activa: true,
      disponible: true,
      stock: 10,
      imagen_url: 'https://images.pexels.com/photos/3278215/pexels-photo-3278215.jpeg?auto=compress&cs=tinysrgb&w=400',
      empresa_id: 'demo-empresa-1'
    },
    {
      id: 'demo-rec-2',
      nombre: 'Pack suplementos deportivos',
      descripcion: 'Pack premium de suplementos nutricionales',
      costo_puntos: 300,
      categoria: 'bienestar',
      activa: true,
      disponible: true,
      stock: 15,
      imagen_url: 'https://images.pexels.com/photos/4058224/pexels-photo-4058224.jpeg?auto=compress&cs=tinysrgb&w=400',
      empresa_id: 'demo-empresa-1'
    },
    {
      id: 'demo-rec-3',
      nombre: 'Masaje deportivo 60min',
      descripcion: 'Sesión completa de masaje deportivo',
      costo_puntos: 200,
      categoria: 'bienestar',
      activa: true,
      disponible: true,
      stock: 20,
      imagen_url: 'https://images.pexels.com/photos/5473180/pexels-photo-5473180.jpeg?auto=compress&cs=tinysrgb&w=400',
      empresa_id: 'demo-empresa-1'
    },
    {
      id: 'demo-rec-4',
      nombre: 'Ropa deportiva premium',
      descripcion: 'Vale para ropa deportiva de marca',
      costo_puntos: 400,
      categoria: 'material',
      activa: true,
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
      activa: true,
      disponible: true,
      stock: 25,
      imagen_url: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
      empresa_id: 'demo-empresa-1'
    }
  ],

  canjes: [
    { id: 'demo-canje-1', empleado_id: 'demo-emp-1', recompensa_id: 'demo-rec-1', puntos_gastados: 500, estado: 'completado', fecha_canje: '2024-10-15T14:30:00Z', empleado: { nombre: 'Carlos Martínez' }, recompensa: { nombre: 'Día libre adicional' } },
    { id: 'demo-canje-2', empleado_id: 'demo-emp-36', recompensa_id: 'demo-rec-3', puntos_gastados: 200, estado: 'completado', fecha_canje: '2024-10-20T09:15:00Z', empleado: { nombre: 'Carlos González' }, recompensa: { nombre: 'Masaje deportivo 60min' } },
    { id: 'demo-canje-3', empleado_id: 'demo-emp-53', recompensa_id: 'demo-rec-2', puntos_gastados: 300, estado: 'pendiente', fecha_canje: '2024-11-01T11:00:00Z', empleado: { nombre: 'Carlos Ramos' }, recompensa: { nombre: 'Pack suplementos deportivos' } },
    { id: 'demo-canje-4', empleado_id: 'demo-emp-89', recompensa_id: 'demo-rec-5', puntos_gastados: 250, estado: 'completado', fecha_canje: '2024-11-05T16:45:00Z', empleado: { nombre: 'Carlos Medina' }, recompensa: { nombre: 'Vale comida saludable' } },
    { id: 'demo-canje-5', empleado_id: 'demo-emp-120', recompensa_id: 'demo-rec-4', puntos_gastados: 400, estado: 'pendiente', fecha_canje: '2024-11-08T10:30:00Z', empleado: { nombre: 'Sara Cortés' }, recompensa: { nombre: 'Ropa deportiva premium' } }
  ],

  estadisticas: {
    dashboard: {
      totalEmpleados: 120,
      comunicadosActivos: 5,
      encuestasActivas: 1,
      recompensasDisponibles: 5,
      empleadosActivos: 120,
      tasaParticipacion: 87.5,
      puntosOtorgados: 45670,
      comunicadosEsteMes: 12,
      satisfaccionGeneral: 8.4
    },
    participacion: {
      porDepartamento: [
        { departamento: 'Dirección', participacion: 100, empleados: 12, respuestas: 12 },
        { departamento: 'Entrenamiento Personal', participacion: 92, empleados: 35, respuestas: 32 },
        { departamento: 'Clases Grupales', participacion: 90, empleados: 28, respuestas: 25 },
        { departamento: 'Nutrición Deportiva', participacion: 88, empleados: 15, respuestas: 13 },
        { departamento: 'Fisioterapia', participacion: 85, empleados: 12, respuestas: 10 },
        { departamento: 'Recepción y Atención', participacion: 82, empleados: 18, respuestas: 15 }
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
        { nombre: 'Liderazgo', valor: 8.7, color: '#10b981' },
        { nombre: 'Comunicación', valor: 8.2, color: '#3b82f6' },
        { nombre: 'Recursos', valor: 8.9, color: '#8b5cf6' },
        { nombre: 'Reconocimiento', valor: 7.8, color: '#f59e0b' },
        { nombre: 'Desarrollo', valor: 8.5, color: '#ec4899' },
        { nombre: 'Balance vida-trabajo', valor: 8.3, color: '#14b8a6' }
      ]
    }
  },

  servicios: [
    { id: 'demo-serv-1', nombre: 'Asesoría Nutricional', descripcion: 'Consulta personalizada con nutricionista deportivo', categoria: 'nutricion', duracion_minutos: 60, disponible: true, imagen_url: 'https://images.pexels.com/photos/6551415/pexels-photo-6551415.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: 'demo-serv-2', nombre: 'Sesión Fisioterapia', descripcion: 'Tratamiento de lesiones y recuperación muscular', categoria: 'salud', duracion_minutos: 45, disponible: true, imagen_url: 'https://images.pexels.com/photos/5473180/pexels-photo-5473180.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: 'demo-serv-3', nombre: 'Coaching Deportivo', descripcion: 'Mentoría para alcanzar tus objetivos deportivos', categoria: 'entrenamiento', duracion_minutos: 90, disponible: true, imagen_url: 'https://images.pexels.com/photos/4162491/pexels-photo-4162491.jpeg?auto=compress&cs=tinysrgb&w=400' }
  ]
};
