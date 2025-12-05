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

// Generadores de datos masivos
const nombres = ['Carlos', 'Laura', 'Javier', 'Ana', 'Miguel', 'Patricia', 'Roberto', 'Carmen', 'David', 'Elena', 'Fernando', 'Sofía', 'Antonio', 'Isabel', 'José', 'María', 'Manuel', 'Rosa', 'Francisco', 'Teresa', 'Pedro', 'Lucía', 'Ángel', 'Marta', 'Luis', 'Cristina', 'Raúl', 'Pilar', 'Sergio', 'Beatriz', 'Alberto', 'Silvia', 'Jorge', 'Natalia', 'Daniel', 'Paula', 'Alejandro', 'Andrea', 'Víctor', 'Sara'];
const apellidos = ['Martínez', 'González', 'Ruiz', 'Morales', 'Sánchez', 'Fernández', 'Díaz', 'López', 'Torres', 'Ramírez', 'Ortiz', 'Jiménez', 'Vega', 'Castro', 'Romero', 'Navarro', 'Gil', 'Serrano', 'Blanco', 'Suárez', 'Molina', 'Vázquez', 'Ramos', 'Cruz', 'Flores', 'Herrera', 'Mendoza', 'Guerrero', 'Medina', 'Cortés'];

const cargos = {
  'demo-dept-1': ['Tech Lead', 'Senior Full Stack Developer', 'Full Stack Developer', 'Senior Backend Developer', 'Backend Developer', 'Senior Frontend Developer', 'Frontend Developer', 'Junior Developer'],
  'demo-dept-2': ['QA Manager', 'Senior QA Engineer', 'QA Engineer', 'QA Automation Engineer', 'Test Analyst'],
  'demo-dept-3': ['DevOps Lead', 'Senior DevOps Engineer', 'DevOps Engineer', 'Cloud Architect', 'Site Reliability Engineer'],
  'demo-dept-4': ['Design Lead', 'Senior UX Designer', 'UX Designer', 'UI Designer', 'Product Designer'],
  'demo-dept-5': ['Director de Proyectos', 'Project Manager', 'Scrum Master', 'Product Owner', 'Business Analyst', 'Agile Coach', 'PMO Coordinator', 'Product Manager'],
  'demo-dept-6': ['CEO', 'CTO', 'Director de Operaciones', 'Director de RRHH', 'Director Comercial', 'CFO', 'Head of Engineering', 'Office Manager']
};

const departamentosConfig = [
  { id: 'demo-dept-1', nombre: 'Desarrollo de Software', codigo: 'DEV', cantidad: 35 },
  { id: 'demo-dept-2', nombre: 'QA y Testing', codigo: 'QA', cantidad: 15 },
  { id: 'demo-dept-3', nombre: 'DevOps e Infraestructura', codigo: 'OPS', cantidad: 12 },
  { id: 'demo-dept-4', nombre: 'Diseño UX/UI', codigo: 'UX', cantidad: 18 },
  { id: 'demo-dept-5', nombre: 'Gestión de Proyectos', codigo: 'PM', cantidad: 28 },
  { id: 'demo-dept-6', nombre: 'Dirección y Administración', codigo: 'ADM', cantidad: 12 }
];

// Generar 120 empleados dinámicamente
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
      const emailNombre = nombre.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
      const emailApellido = apellido.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
      const email = `${emailNombre}.${emailApellido}${empleadoIndex}@techpulse.com`;
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
        telefono: `+34 6${String(10 + empleadoIndex).padStart(2, '0')} ${String(100 + (empleadoIndex % 900)).padStart(3, '0')} ${String(100 + ((empleadoIndex * 7) % 900)).padStart(3, '0')}`
      });
      empleadoIndex++;
    }
  });
  return empleados;
}

// Generar respuestas de encuesta (87 de 120 empleados = 72.5%)
function generarRespuestasEncuesta() {
  const respuestas = [];
  const empleados = generarEmpleados();
  const empleadosQueResponden = empleados.slice(0, 87);

  empleadosQueResponden.forEach((emp, idx) => {
    // Pregunta 1: Ambiente laboral (escala 1-10)
    respuestas.push({
      id: `demo-resp-${idx * 3 + 1}`,
      encuesta_id: 'demo-enc-1',
      pregunta_id: 'demo-preg-1',
      empleado_id: emp.id,
      respuesta: String(7 + Math.floor(Math.random() * 4)),
      fecha_respuesta: '2024-11-12T10:00:00Z'
    });

    // Pregunta 2: Satisfacción instalaciones (opción múltiple)
    const opciones = ['muy_satisfecho', 'satisfecho', 'neutral'];
    const pesos = [0.5, 0.4, 0.1]; // 50% muy satisfecho, 40% satisfecho, 10% neutral
    const random = Math.random();
    let opcionSeleccionada = opciones[2];
    let acumulado = 0;
    for (let i = 0; i < pesos.length; i++) {
      acumulado += pesos[i];
      if (random < acumulado) {
        opcionSeleccionada = opciones[i];
        break;
      }
    }

    respuestas.push({
      id: `demo-resp-${idx * 3 + 2}`,
      encuesta_id: 'demo-enc-1',
      pregunta_id: 'demo-preg-2',
      empleado_id: emp.id,
      respuesta: opcionSeleccionada,
      fecha_respuesta: '2024-11-12T10:00:00Z'
    });

    // Pregunta 3: Comunicación (escala 1-10)
    respuestas.push({
      id: `demo-resp-${idx * 3 + 3}`,
      encuesta_id: 'demo-enc-1',
      pregunta_id: 'demo-preg-3',
      empleado_id: emp.id,
      respuesta: String(7 + Math.floor(Math.random() * 4)),
      fecha_respuesta: '2024-11-12T10:00:00Z'
    });
  });

  return respuestas;
}

// Data demo completa
export const demoData = {
  empresa: {
    id: 'demo-empresa-1',
    nombre: 'TechPulse Consulting',
    descripcion: 'Consultora tecnológica líder en soluciones digitales',
    sector: 'Tecnología y Consultoría',
    logo_url: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=200',
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
      titulo: 'Clima Laboral TechPulse - Q4 2024',
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
      titulo: 'Evaluación de Herramientas y Tecnología',
      descripcion: 'Feedback sobre herramientas de desarrollo y servicios de bienestar',
      estado: 'finalizada',
      fecha_inicio: '2024-10-01',
      fecha_fin: '2024-10-15',
      empresa_id: 'demo-empresa-1',
      creador_id: 'demo-emp-36',
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
      texto: '¿Cómo calificarías el ambiente laboral en TechPulse?',
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
      opciones: JSON.stringify([
        { valor: 'muy_satisfecho', etiqueta: 'Muy Satisfecho' },
        { valor: 'satisfecho', etiqueta: 'Satisfecho' },
        { valor: 'neutral', etiqueta: 'Neutral' },
        { valor: 'insatisfecho', etiqueta: 'Insatisfecho' },
        { valor: 'muy_insatisfecho', etiqueta: 'Muy Insatisfecho' }
      ]),
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
      titulo: 'Nueva Infraestructura Cloud Migrada',
      contenido: 'Nos complace anunciar que hemos completado con éxito la migración a AWS. El equipo de DevOps ha trabajado arduamente para garantizar cero downtime. ¡Gracias a todos por el esfuerzo!',
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
      titulo: 'Horario Flexible de Verano',
      contenido: 'A partir del próximo mes, implementaremos jornada intensiva los viernes durante julio y agosto. El horario será de 08:00 a 15:00.',
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
      titulo: 'Tech Talk: Microservicios con Kubernetes',
      contenido: 'Este viernes 24 a las 17:00 tendremos una charla técnica sobre arquitectura de microservicios y orquestación con Kubernetes. Snacks y bebidas incluidas. ¡No te la pierdas!',
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
      titulo: 'Mantenimiento Programado de Servidores',
      contenido: 'Este sábado realizaremos mantenimiento de nuestros servidores de desarrollo. El acceso estará disponible desde las 14:00. Disculpen las molestias.',
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
      titulo: 'Certificaciones AWS Cubiertas al 100%',
      contenido: 'TechPulse cubrirá el 100% del costo de certificaciones AWS para todo el equipo. Inscripciones abiertas hasta el 15 de diciembre. ¡Aprovecha esta oportunidad!',
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
      nombre: 'Curso Online Udemy',
      descripcion: 'Acceso a cualquier curso de desarrollo en Udemy',
      costo_puntos: 300,
      categoria: 'formacion',
      activa: true,
      disponible: true,
      stock: 15,
      imagen_url: 'https://images.pexels.com/photos/4144923/pexels-photo-4144923.jpeg?auto=compress&cs=tinysrgb&w=400',
      empresa_id: 'demo-empresa-1'
    },
    {
      id: 'demo-rec-3',
      nombre: 'Masaje terapéutico 60min',
      descripcion: 'Sesión completa de masaje para aliviar tensión',
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
      nombre: 'Gadgets Tech',
      descripcion: 'Auriculares, teclados mecánicos, mouse ergonómico',
      costo_puntos: 400,
      categoria: 'tecnologia',
      activa: true,
      disponible: true,
      stock: 8,
      imagen_url: 'https://images.pexels.com/photos/4158/apple-iphone-smartphone-desk.jpg?auto=compress&cs=tinysrgb&w=400',
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
    { id: 'demo-canje-2', empleado_id: 'demo-emp-36', recompensa_id: 'demo-rec-3', puntos_gastados: 200, estado: 'completado', fecha_canje: '2024-10-20T09:15:00Z', empleado: { nombre: 'Carlos González' }, recompensa: { nombre: 'Masaje terapéutico 60min' } },
    { id: 'demo-canje-3', empleado_id: 'demo-emp-53', recompensa_id: 'demo-rec-2', puntos_gastados: 300, estado: 'pendiente', fecha_canje: '2024-11-01T11:00:00Z', empleado: { nombre: 'Carlos Ramos' }, recompensa: { nombre: 'Curso Online Udemy' } },
    { id: 'demo-canje-4', empleado_id: 'demo-emp-89', recompensa_id: 'demo-rec-5', puntos_gastados: 250, estado: 'completado', fecha_canje: '2024-11-05T16:45:00Z', empleado: { nombre: 'Carlos Medina' }, recompensa: { nombre: 'Vale comida saludable' } },
    { id: 'demo-canje-5', empleado_id: 'demo-emp-120', recompensa_id: 'demo-rec-4', puntos_gastados: 400, estado: 'pendiente', fecha_canje: '2024-11-08T10:30:00Z', empleado: { nombre: 'Sara Cortés' }, recompensa: { nombre: 'Gadgets Tech' } }
  ],

  estadisticas: {
    dashboard: {
      totalEmpleados: 120,
      comunicadosActivos: 5,
      encuestasActivas: 1,
      recompensasDisponibles: 5,
      empleadosActivos: 120,
      tasaParticipacion: 87.5,
      puntosOtorgados: 187420,
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
    { id: 'demo-serv-1', nombre: 'Asesoría Nutricional', descripcion: 'Consulta personalizada con nutricionista para mejorar hábitos', categoria: 'bienestar', duracion_minutos: 60, disponible: true, imagen_url: 'https://images.pexels.com/photos/6551415/pexels-photo-6551415.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: 'demo-serv-2', nombre: 'Ergonomía y Postura', descripcion: 'Evaluación ergonómica de tu puesto de trabajo', categoria: 'salud', duracion_minutos: 45, disponible: true, imagen_url: 'https://images.pexels.com/photos/7640463/pexels-photo-7640463.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: 'demo-serv-3', nombre: 'Mindfulness para Developers', descripcion: 'Técnicas de meditación y gestión del estrés', categoria: 'bienestar', duracion_minutos: 45, disponible: true, imagen_url: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=400' }
  ]
};

// Exportar también los generadores para uso dinámico
export { generarEmpleados, generarRespuestasEncuesta };
