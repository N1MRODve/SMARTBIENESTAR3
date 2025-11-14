// Comunicados Demo - SportLife Performance
// Datos relacionados con el mundo deportivo y del bienestar

// Departamentos disponibles
export const departamentosDisponibles = [
  'Entrenamiento Personal',
  'Nutrición Deportiva',
  'Fisioterapia',
  'Recepción y Atención',
  'Clases Grupales',
  'Dirección'
];

// Roles disponibles
export const rolesDisponibles = [
  'Todos los empleados',
  'Entrenadores',
  'Instructores',
  'Fisioterapeutas',
  'Nutricionistas',
  'Personal de sala',
  'Personal operativo',
  'Líderes de área'
];

// Plantillas de comunicados
export const plantillasComunicado = [
  {
    id: 'mejora',
    titulo: 'Plan de Mejora Continua',
    tipo: 'Plan de mejora',
    contenido: 'Tras los resultados de la última evaluación, implementaremos acciones específicas para mejorar el rendimiento y bienestar del equipo.'
  },
  {
    id: 'felicitacion',
    titulo: 'Reconocimiento al Equipo',
    tipo: 'Reconocimiento',
    contenido: '¡Felicitaciones al equipo por los excelentes resultados! Vuestro esfuerzo y dedicación son fundamentales para nuestro éxito.'
  },
  {
    id: 'general',
    titulo: 'Comunicación General',
    tipo: 'Informativo',
    contenido: 'Queremos informaros sobre las próximas iniciativas y mejoras que implementaremos en SportLife.'
  },
  {
    id: 'acciones',
    titulo: 'Acciones Implementadas',
    tipo: 'Programa',
    contenido: 'Basándonos en vuestro feedback, hemos implementado las siguientes mejoras y nuevos programas.'
  }
];

export const comunicadosMock = [
  {
    id: 1,
    titulo: "Nueva Zona de Entrenamiento Funcional",
    tipo: "Anuncio",
    fecha_envio: "2025-01-15",
    destinatarios: ["Todos los departamentos"],
    roles: ["Todos los empleados"],
    estado: "Enviado",
    interacciones: 98,
    contenido: `Nos complace anunciar la inauguración de nuestra nueva zona de entrenamiento funcional de 200m². Este espacio está equipado con:

• Racks de CrossFit profesionales
• Sistema de suspensión (TRX)
• Área de calistenia al aire libre
• Equipamiento de pliometría
• Zona de estiramiento y movilidad

La zona estará disponible desde el lunes 20 de enero. Se ofrecerán sesiones de orientación gratuitas durante la primera semana.

¡Esperamos que disfrutéis de este nuevo espacio diseñado para llevar vuestro entrenamiento al siguiente nivel!`,
    fecha_creacion: "2025-01-14",
    creador: "Dirección SportLife",
    tasa_apertura: 82
  },
  {
    id: 2,
    titulo: "Protocolo de Limpieza y Desinfección",
    tipo: "Informativo",
    fecha_envio: "2025-01-12",
    destinatarios: ["Todos los departamentos"],
    roles: ["Todos los empleados"],
    estado: "Enviado",
    interacciones: 115,
    contenido: `Equipo SportLife,

Para garantizar la máxima seguridad e higiene en nuestras instalaciones, hemos actualizado nuestros protocolos de limpieza:

- Desinfección profunda cada 2 horas
- Estaciones de gel hidroalcohólico en todas las áreas
- Limpieza inmediata de equipos tras cada uso
- Sistema de ventilación mejorado en todas las salas

Recordatorio para el equipo:
• Utilizar toallas en todo momento
• Limpiar equipos antes y después del uso
• Reportar inmediatamente cualquier incidencia

La salud y bienestar de nuestro equipo y clientes es nuestra máxima prioridad.`,
    fecha_creacion: "2025-01-11",
    creador: "Dirección SportLife",
    tasa_apertura: 96
  },
  {
    id: 3,
    titulo: "Nuevo Programa: Nutrición para el Rendimiento",
    tipo: "Programa",
    fecha_envio: "2025-01-10",
    destinatarios: ["Todos los departamentos"],
    roles: ["Todos los empleados"],
    estado: "Enviado",
    interacciones: 87,
    contenido: `¡Lanzamos un nuevo programa de nutrición deportiva!

El Departamento de Nutrición ha diseñado un programa integral para optimizar el rendimiento:

Incluye:
• Evaluación nutricional personalizada
• Planes de alimentación adaptados
• Seguimiento semanal de progreso
• Suplementación deportiva (si necesario)
• App de seguimiento nutricional

Beneficios:
✓ Mejora del rendimiento físico
✓ Optimización de la composición corporal
✓ Mayor energía y recuperación
✓ Educación nutricional continua

El programa está disponible para todos los empleados sin costo adicional. Inscripciones abiertas hasta el 25 de enero.

Para más información: nutricion@sportlife.com`,
    fecha_creacion: "2025-01-09",
    creador: "Departamento de Nutrición",
    tasa_apertura: 73
  },
  {
    id: 4,
    titulo: "Formación: Primeros Auxilios Deportivos",
    tipo: "Formación",
    fecha_envio: "2025-01-08",
    destinatarios: ["Entrenamiento Personal", "Clases Grupales", "Recepción y Atención"],
    roles: ["Entrenadores", "Instructores", "Personal de sala"],
    estado: "Enviado",
    interacciones: 65,
    contenido: `Entrenadores y Personal de Sala:

Es obligatorio completar la formación de Primeros Auxilios Deportivos antes del 31 de enero.

Fechas disponibles:
• Grupo 1: 22 de enero, 9:00-14:00h
• Grupo 2: 24 de enero, 15:00-20:00h
• Grupo 3: 27 de enero, 9:00-14:00h

Temario:
- RCP y uso de desfibrilador (DEA)
- Lesiones deportivas comunes
- Protocolos de emergencia
- Manejo de situaciones críticas

Certificación oficial incluida.

Por favor, confirmad vuestra asistencia respondiendo a este comunicado o contactando con RRHH.`,
    fecha_creacion: "2025-01-07",
    creador: "RRHH SportLife",
    tasa_apertura: 100
  },
  {
    id: 5,
    titulo: "Celebración: 5 Años de SportLife",
    tipo: "Evento",
    fecha_envio: "2025-01-05",
    destinatarios: ["Todos los departamentos"],
    roles: ["Todos los empleados"],
    estado: "Enviado",
    interacciones: 112,
    contenido: `¡Celebramos 5 años transformando vidas!

El próximo 15 de febrero celebraremos nuestro 5º aniversario con un evento especial:

PROGRAMA DEL DÍA:
10:00 - Clase magistral de HIIT con todos los entrenadores
12:00 - Brunch saludable
14:00 - Torneo de CrossFit por equipos
16:00 - Premiación y reconocimientos
18:00 - Sesión de fotos y networking

SORPRESAS:
- Regalos para todo el equipo
- Sorteo de membresías anuales
- Reconocimiento a empleados destacados

Invitad a familia y amigos. Será un día para recordar.

RSVP antes del 10 de febrero: eventos@sportlife.com`,
    fecha_creacion: "2025-01-04",
    creador: "Dirección SportLife",
    tasa_apertura: 93
  },
  {
    id: 6,
    titulo: "Evaluaciones de Desempeño Q4",
    tipo: "Administrativo",
    fecha_envio: "2025-01-03",
    destinatarios: ["Todos los departamentos"],
    roles: ["Todos los empleados"],
    estado: "Enviado",
    interacciones: 105,
    contenido: `Estimado equipo,

Las evaluaciones de desempeño del último trimestre están programadas:

CALENDARIO:
- Entrenamiento Personal: 18-20 enero
- Nutrición Deportiva: 22-23 enero
- Fisioterapia: 24-25 enero
- Clases Grupales: 26-27 enero
- Recepción y Atención: 29-30 enero

TEMAS A TRATAR:
• Logros del trimestre
• Áreas de desarrollo
• Objetivos 2025
• Plan de formación
• Expectativas salariales

Las reuniones serán individuales (45 min) con vuestro supervisor directo.

Por favor, completad el formulario de autoevaluación antes de vuestra reunión.`,
    fecha_creacion: "2025-01-02",
    creador: "RRHH SportLife",
    tasa_apertura: 88
  },
  {
    id: 7,
    titulo: "Programa de Bienestar Emocional",
    tipo: "Bienestar",
    fecha_envio: "2024-12-28",
    destinatarios: ["Todos los departamentos"],
    roles: ["Todos los empleados"],
    estado: "Enviado",
    interacciones: 94,
    contenido: `En SportLife nos preocupamos por el bienestar integral de nuestro equipo.

Lanzamos nuestro Programa de Bienestar Emocional:

SERVICIOS INCLUIDOS:
• Sesiones de mindfulness (lunes y miércoles 7:30am)
• Consultas con psicólogo deportivo (confidencial)
• Talleres de gestión del estrés
• Técnicas de respiración y relajación
• Grupo de apoyo entre compañeros

BENEFICIOS:
- Reducción del estrés laboral
- Mejor manejo de presiones
- Mayor equilibrio vida-trabajo
- Ambiente laboral positivo

Todos los servicios son gratuitos y completamente confidenciales.

Para agendar: bienestar@sportlife.com

Recordad: cuidar vuestra salud mental es tan importante como vuestra salud física.`,
    fecha_creacion: "2024-12-27",
    creador: "Departamento de Bienestar",
    tasa_apertura: 78
  },
  {
    id: 8,
    titulo: "Descuentos en Productos Deportivos",
    tipo: "Beneficio",
    fecha_envio: "2024-12-20",
    destinatarios: ["Todos los departamentos"],
    roles: ["Todos los empleados"],
    estado: "Enviado",
    interacciones: 118,
    contenido: `¡Tenemos una gran noticia para el equipo!

Hemos establecido alianzas con marcas líderes del sector:

- NIKE: 30% descuento en toda la tienda
- UNDER ARMOUR: 25% en ropa deportiva
- GARMIN: 20% en relojes y wearables
- MYPROTEIN: 35% en suplementos
- ADIDAS: 30% en calzado deportivo

CÓMO ACCEDER:
1. Descargad la app SportLife Benefits
2. Usad vuestro código de empleado
3. Disfrutad de los descuentos

Los descuentos son acumulables a ofertas especiales y válidos todo el año.

¡Aprovechad estos beneficios exclusivos para el equipo SportLife!`,
    fecha_creacion: "2024-12-19",
    creador: "RRHH SportLife",
    tasa_apertura: 98
  },
  {
    id: 9,
    titulo: "Horarios de Apertura Enero",
    tipo: "Informativo",
    fecha_envio: "2024-12-15",
    destinatarios: ["Recepción y Atención", "Entrenamiento Personal"],
    roles: ["Personal operativo"],
    estado: "Enviado",
    interacciones: 53,
    contenido: `Equipo SportLife,

Cambios en horarios para el mes de enero:

HORARIO REGULAR:
Lunes a Viernes: 6:00 - 23:00
Sábados: 8:00 - 21:00
Domingos: 9:00 - 20:00

TURNOS DE TRABAJO:
• Turno mañana: 6:00 - 14:00
• Turno tarde: 14:00 - 23:00
• Turno fin de semana: consultar planificación

DÍAS ESPECIALES:
26 enero (festivo local): horario reducido 10:00-18:00

Por favor, confirmad vuestros turnos con vuestro supervisor antes del 16 de enero.

Las planificaciones se publicarán el 17 de enero en la app del personal.`,
    fecha_creacion: "2024-12-14",
    creador: "Dirección SportLife",
    tasa_apertura: 100
  },
  {
    id: 10,
    titulo: "Récord de Satisfacción del Cliente",
    tipo: "Reconocimiento",
    fecha_envio: "2024-12-10",
    destinatarios: ["Todos los departamentos"],
    roles: ["Todos los empleados"],
    estado: "Enviado",
    interacciones: 120,
    contenido: `¡FELICIDADES A TODO EL EQUIPO!

Hemos alcanzado un hito histórico:

⭐ 4.9/5.0 en satisfacción del cliente
🏆 95% de retención de membresías
📈 +40% en recomendaciones
💬 Mejor valoración en Google (4.8 estrellas)

Este logro es resultado del esfuerzo, dedicación y pasión de cada uno de vosotros.

DESTACADOS DEL MES:
- Mejor entrenador: Carlos Martínez (EP)
- Mejor nutricionista: Laura González (Nutrición)
- Mejor fisioterapeuta: Javier Ruiz (Fisio)
- Mejor instructor: Ana Morales (Clases Grupales)
- Mejor atención: María López (Recepción)

Continuemos brindando experiencias excepcionales que transformen vidas.

¡GRACIAS POR HACER DE SPORTLIFE UN LUGAR ESPECIAL!`,
    fecha_creacion: "2024-12-09",
    creador: "Dirección SportLife",
    tasa_apertura: 100
  },
  {
    id: 11,
    titulo: "Workshop Coaching Deportivo Avanzado",
    tipo: "Formación",
    fecha_envio: "2024-12-05",
    destinatarios: ["Entrenamiento Personal", "Clases Grupales"],
    roles: ["Entrenadores", "Instructores"],
    estado: "Enviado",
    interacciones: 58,
    contenido: `Entrenadores y Coaches:

Oportunidad de formación avanzada:

WORKSHOP: Técnicas Avanzadas de Coaching Deportivo
Fecha: 30 de enero 2025
Horario: 9:00 - 18:00
Lugar: Sala de formación SportLife

INSTRUCTOR:
Dr. Roberto Sánchez (PhD en Ciencias del Deporte)
- 15 años entrenando atletas olímpicos
- Autor de 3 libros sobre coaching deportivo

CONTENIDO:
• Programación avanzada del entrenamiento
• Periodización para objetivos específicos
• Psicología del rendimiento
• Prevención de lesiones
• Nutrición periodizada
• Casos de estudio reales

INCLUYE:
- Material didáctico completo
- Certificado de asistencia
- Lunch y coffee breaks

Plazas limitadas a 20 personas. Inscripciones: formacion@sportlife.com`,
    fecha_creacion: "2024-12-04",
    creador: "Departamento de Formación",
    tasa_apertura: 92
  },
  {
    id: 12,
    titulo: "Bono Navidad 2024",
    tipo: "Reconocimiento",
    fecha_envio: "2024-12-01",
    destinatarios: ["Todos los departamentos"],
    roles: ["Todos los empleados"],
    estado: "Enviado",
    interacciones: 120,
    contenido: `Querido equipo SportLife,

Al finalizar este año excepcional, queremos expresar nuestro profundo agradecimiento.

BONO NAVIDAD 2024:
Se ha depositado vuestro bono navidad según vuestra antigüedad y desempeño. Revisad vuestras cuentas.

RESUMEN 2024:
• 2,500+ clientes transformados
• 15,000+ entrenamientos personalizados
• 8,000+ sesiones de fisioterapia
• 1,200+ planes nutricionales
• 98% satisfacción del cliente

LOGROS DESTACADOS:
- Premio "Mejor Centro Deportivo Regional"
- Certificación ISO en calidad de servicio
- Expansión del equipo: +25 nuevos profesionales
- Nuevas instalaciones y equipamiento

GRACIAS:
Gracias por vuestra dedicación, profesionalismo y pasión. Sois el corazón de SportLife.

¡Felices fiestas y próspero 2025!

La Dirección`,
    fecha_creacion: "2024-11-30",
    creador: "Dirección SportLife",
    tasa_apertura: 100
  },
  {
    id: 13,
    titulo: "Próximo: Programa de Movilidad Articular",
    tipo: "Programa",
    fecha_envio: null,
    destinatarios: ["Fisioterapia", "Entrenamiento Personal"],
    roles: ["Fisioterapeutas", "Entrenadores"],
    estado: "Borrador",
    interacciones: 0,
    contenido: `BORRADOR - Programa de Movilidad Articular

Desde Fisioterapia estamos diseñando un programa innovador de movilidad articular para prevenir lesiones y mejorar el rendimiento.

Características:
- Evaluación de movilidad inicial
- Rutinas personalizadas
- Seguimiento mensual
- Integración con planes de entrenamiento

Fecha de lanzamiento estimada: Febrero 2025

Este borrador está en revisión. Feedback bienvenido antes del envío oficial.`,
    fecha_creacion: "2025-01-14",
    creador: "Departamento de Fisioterapia",
    tasa_apertura: 0
  },
  {
    id: 14,
    titulo: "Convocatoria: Torneo Interno CrossFit",
    tipo: "Evento",
    fecha_envio: null,
    destinatarios: ["Todos los departamentos"],
    roles: ["Todos los empleados"],
    estado: "Programado",
    interacciones: 0,
    contenido: `¡Prepárate para el Torneo Interno de CrossFit!

Fecha: 28 de febrero 2025
Lugar: Zona de entrenamiento funcional

CATEGORÍAS:
- RX (Avanzado)
- Scaled (Intermedio)
- Beginner (Principiante)

PREMIOS:
- 1er lugar: Membresía anual + kit deportivo
- 2do lugar: Membresía semestral + camiseta
- 3er lugar: Membresía trimestral

Inscripciones abren el 1 de febrero.

¡Demuestra tu fuerza, resistencia y espíritu de equipo!`,
    fecha_creacion: "2025-01-13",
    creador: "Departamento de Clases Grupales",
    tasa_apertura: 0
  }
];

// Utilidades para colores de estado
export const obtenerColorEstado = (estado) => {
  const colores = {
    'Enviado': {
      badge: 'bg-green-100 text-green-800',
      dot: 'bg-green-500'
    },
    'Programado': {
      badge: 'bg-blue-100 text-blue-800',
      dot: 'bg-blue-500'
    },
    'Borrador': {
      badge: 'bg-gray-100 text-gray-800',
      dot: 'bg-gray-500'
    }
  };
  return colores[estado] || colores['Borrador'];
};

export const obtenerColorInteraccion = (interacciones, total = 120) => {
  const porcentaje = (interacciones / total) * 100;
  if (porcentaje >= 80) return 'text-green-600';
  if (porcentaje >= 50) return 'text-yellow-600';
  return 'text-red-600';
};

// Funciones de manipulación de comunicados
export const agregarComunicado = (comunicado) => {
  const nuevo = {
    ...comunicado,
    id: comunicadosMock.length + 1,
    fecha_creacion: new Date().toISOString().split('T')[0],
    estado: comunicado.fecha_envio ? 'Enviado' : 'Borrador',
    interacciones: 0,
    tasa_apertura: 0
  };
  comunicadosMock.push(nuevo);
  return nuevo;
};

export const actualizarComunicado = (id, datosActualizados) => {
  const index = comunicadosMock.findIndex(c => c.id === id);
  if (index !== -1) {
    comunicadosMock[index] = {
      ...comunicadosMock[index],
      ...datosActualizados
    };
    return comunicadosMock[index];
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

// Función para calcular estadísticas de comunicados
export const duplicarComunicado = (id) => {
  const original = comunicadosMock.find(c => c.id === id);
  if (original) {
    const duplicado = {
      ...original,
      id: comunicadosMock.length + 1,
      titulo: `${original.titulo} (Copia)`,
      fecha_envio: null,
      estado: 'Borrador',
      interacciones: 0,
      tasa_apertura: 0,
      fecha_creacion: new Date().toISOString().split('T')[0]
    };
    comunicadosMock.push(duplicado);
    return duplicado;
  }
  return null;
};

export const calcularEstadisticas = () => {
  const enviados = comunicadosMock.filter(c => c.estado === 'Enviado');
  const totalInteracciones = enviados.reduce((sum, c) => sum + c.interacciones, 0);
  const totalDestinatarios = enviados.reduce((sum, c) => sum + 120, 0); // Asumimos 120 empleados por comunicado

  return {
    totalComunicados: comunicadosMock.length,
    totalEnviados: enviados.length,
    totalBorradores: comunicadosMock.filter(c => c.estado === 'Borrador').length,
    totalProgramados: comunicadosMock.filter(c => c.estado === 'Programado').length,
    totalInteracciones,
    totalDestinatarios,
    tasaAperturaPromedio: enviados.length > 0
      ? enviados.reduce((sum, c) => sum + (c.tasa_apertura || 0), 0) / enviados.length
      : 0,
    comunicadoMasLeido: enviados.sort((a, b) => b.interacciones - a.interacciones)[0] || null
  };
};
