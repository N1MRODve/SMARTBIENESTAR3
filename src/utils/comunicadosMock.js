// TODO: conectar con tabla "comunicados" en futuras iteraciones.

export const plantillasComunicado = [
  {
    id: 'mejora',
    titulo: 'Comunicación: Plan de Mejora',
    cuerpo: `Tras los resultados de la encuesta {nombre_encuesta}, hemos detectado áreas de mejora y estamos implementando acciones específicas para fortalecer nuestro clima laboral.

Nuestro compromiso es trabajar juntos para mejorar estos aspectos clave:
• Implementar nuevas iniciativas de bienestar
• Reforzar canales de comunicación
• Desarrollar planes de acción por departamento

Agradecemos vuestra participación y seguiremos informando sobre los avances.`,
    icono: '📊',
    color: 'orange'
  },
  {
    id: 'felicitacion',
    titulo: 'Comunicación: Clima Positivo',
    cuerpo: `Los resultados de la encuesta {nombre_encuesta} reflejan un alto nivel de compromiso y bienestar. ¡Gracias por formar parte de este logro colectivo!

Vuestro feedback positivo demuestra que estamos en el camino correcto:
• Excelente clima de trabajo en equipo
• Alto nivel de satisfacción general
• Compromiso con los valores organizacionales

Seguiremos trabajando para mantener este ambiente positivo.`,
    icono: '🎉',
    color: 'green'
  },
  {
    id: 'general',
    titulo: 'Comunicación General',
    cuerpo: `Queremos agradecer la participación de todos en la encuesta {nombre_encuesta}. Pronto estaremos implementando nuevas iniciativas basadas en vuestros aportes.

Vuestra opinión es fundamental para:
• Identificar oportunidades de mejora
• Diseñar planes de acción efectivos
• Fortalecer nuestra cultura organizacional

Os mantendremos informados sobre los próximos pasos y las acciones que implementaremos.`,
    icono: '📢',
    color: 'blue'
  },
  {
    id: 'acciones',
    titulo: 'Comunicación: Acciones Implementadas',
    cuerpo: `Basándonos en los resultados de {nombre_encuesta}, hemos implementado las siguientes acciones concretas:

✓ Nuevos programas de bienestar y apoyo
✓ Mejoras en infraestructura y recursos
✓ Espacios de escucha y feedback continuo
✓ Formación en gestión del estrés y liderazgo

Estas son solo las primeras iniciativas. Continuaremos trabajando en crear el mejor ambiente laboral posible.`,
    icono: '✅',
    color: 'indigo'
  }
];

export const opcionesDestinatarios = [
  {
    id: 'todos',
    label: 'Todos los empleados',
    descripcion: 'Enviar a toda la organización',
    icono: '👥'
  },
  {
    id: 'lideres',
    label: 'Solo líderes',
    descripcion: 'Enviar únicamente a roles de liderazgo',
    icono: '👔'
  },
  {
    id: 'riesgo_alto',
    label: 'Departamentos con riesgo alto',
    descripcion: 'Áreas que requieren atención prioritaria',
    icono: '⚠️'
  },
  {
    id: 'riesgo_moderado',
    label: 'Departamentos con riesgo moderado',
    descripcion: 'Áreas con oportunidades de mejora',
    icono: '📊'
  }
];

// Mock data de comunicados enviados - SportLife Performance
export const comunicadosMock = [
  {
    id: 'com-001',
    titulo: 'Nueva Zona de Entrenamiento Funcional',
    tipo: 'anuncio',
    categoria: 'infraestructura',
    prioridad: 'alta',
    cuerpo: `Nos complace anunciar la inauguración de nuestra nueva zona de entrenamiento funcional de 200m². Este espacio está equipado con:

• Racks de CrossFit profesionales
• Sistema de suspensión (TRX)
• Área de calistenia al aire libre
• Equipamiento de pliometría
• Zona de estiramiento y movilidad

La zona estará disponible desde el lunes 20 de enero. Se ofrecerán sesiones de orientación gratuitas durante la primera semana.

¡Esperamos que disfrutéis de este nuevo espacio diseñado para llevar vuestro entrenamiento al siguiente nivel!`,
    destinatarios: 'todos',
    departamentos: null,
    fecha_envio: new Date('2025-01-15T10:00:00'),
    fecha_programada: null,
    estado: 'enviado',
    total_destinatarios: 120,
    lecturas: 98,
    tasa_apertura: 82
  },
  {
    id: 'com-002',
    titulo: 'Actualización: Protocolo de Limpieza y Desinfección',
    tipo: 'informativo',
    categoria: 'seguridad',
    prioridad: 'alta',
    cuerpo: `Equipo SportLife,

Para garantizar la máxima seguridad e higiene en nuestras instalaciones, hemos actualizado nuestros protocolos de limpieza:

🧼 Desinfección profunda cada 2 horas
🧴 Estaciones de gel hidroalcohólico en todas las áreas
🧹 Limpieza inmediata de equipos tras cada uso
💨 Sistema de ventilación mejorado en todas las salas

Recordatorio para el equipo:
- Utilizar toallas en todo momento
- Limpiar equipos antes y después del uso
- Reportar inmediatamente cualquier incidencia

La salud y bienestar de nuestro equipo y clientes es nuestra máxima prioridad.`,
    destinatarios: 'todos',
    departamentos: null,
    fecha_envio: new Date('2025-01-12T09:30:00'),
    fecha_programada: null,
    estado: 'enviado',
    total_destinatarios: 120,
    lecturas: 115,
    tasa_apertura: 96
  },
  {
    id: 'com-003',
    titulo: 'Nuevo Programa: Nutrición para el Rendimiento',
    tipo: 'programa',
    categoria: 'bienestar',
    prioridad: 'media',
    cuerpo: `¡Lanzamos un nuevo programa de nutrición deportiva!

El Departamento de Nutrición ha diseñado un programa integral para optimizar el rendimiento:

📋 Evaluación nutricional personalizada
🥗 Planes de alimentación adaptados
📊 Seguimiento semanal de progreso
💊 Suplementación deportiva (si necesario)
📱 App de seguimiento nutricional

Beneficios del programa:
✓ Mejora del rendimiento físico
✓ Optimización de la composición corporal
✓ Mayor energía y recuperación
✓ Educación nutricional continua

El programa está disponible para todos los empleados sin costo adicional. Inscripciones abiertas hasta el 25 de enero.

Para más información: nutricion@sportlife.com`,
    destinatarios: 'todos',
    departamentos: null,
    fecha_envio: new Date('2025-01-10T14:00:00'),
    fecha_programada: null,
    estado: 'enviado',
    total_destinatarios: 120,
    lecturas: 87,
    tasa_apertura: 73
  },
  {
    id: 'com-004',
    titulo: 'Formación Obligatoria: Primeros Auxilios Deportivos',
    tipo: 'formacion',
    categoria: 'capacitacion',
    prioridad: 'alta',
    cuerpo: `Entrenadores y Personal de Sala:

Es obligatorio completar la formación de Primeros Auxilios Deportivos antes del 31 de enero.

📅 Fechas disponibles:
• Grupo 1: 22 de enero, 9:00-14:00h
• Grupo 2: 24 de enero, 15:00-20:00h
• Grupo 3: 27 de enero, 9:00-14:00h

📚 Temario:
- RCP y uso de desfibrilador (DEA)
- Lesiones deportivas comunes
- Protocolos de emergencia
- Manejo de situaciones críticas

🎓 Certificación oficial incluida

Por favor, confirmad vuestra asistencia respondiendo a este comunicado o contactando con RRHH.

La seguridad de nuestros clientes depende de todos.`,
    destinatarios: 'departamentos',
    departamentos: ['Entrenamiento Personal', 'Clases Grupales', 'Recepción y Atención'],
    fecha_envio: new Date('2025-01-08T11:00:00'),
    fecha_programada: null,
    estado: 'enviado',
    total_destinatarios: 65,
    lecturas: 65,
    tasa_apertura: 100
  },
  {
    id: 'com-005',
    titulo: 'Celebración: 5 Años de SportLife Performance',
    tipo: 'evento',
    categoria: 'celebracion',
    prioridad: 'media',
    cuerpo: `¡Celebramos 5 años transformando vidas! 🎉

El próximo 15 de febrero celebraremos nuestro 5º aniversario con un evento especial:

🎊 PROGRAMA DEL DÍA:
10:00 - Clase magistral de HIIT con todos los entrenadores
12:00 - Brunch saludable (buffet preparado por nuestro equipo de nutrición)
14:00 - Torneo de CrossFit por equipos
16:00 - Premiación y reconocimientos
18:00 - Sesión de fotos y networking

🎁 SORPRESAS:
- Regalos para todo el equipo
- Sorteo de membresías anuales
- Reconocimiento a empleados destacados

Invitad a familia y amigos. Será un día para recordar.

RSVP antes del 10 de febrero: eventos@sportlife.com`,
    destinatarios: 'todos',
    departamentos: null,
    fecha_envio: new Date('2025-01-05T16:00:00'),
    fecha_programada: null,
    estado: 'enviado',
    total_destinatarios: 120,
    lecturas: 112,
    tasa_apertura: 93
  },
  {
    id: 'com-006',
    titulo: 'Recordatorio: Evaluaciones de Desempeño Q4',
    tipo: 'administrativo',
    categoria: 'recursos-humanos',
    prioridad: 'alta',
    cuerpo: `Estimado equipo,

Las evaluaciones de desempeño del último trimestre están programadas:

📅 CALENDARIO:
- Entrenamiento Personal: 18-20 enero
- Nutrición Deportiva: 22-23 enero
- Fisioterapia: 24-25 enero
- Clases Grupales: 26-27 enero
- Recepción y Atención: 29-30 enero

📋 PREPARACIÓN:
Por favor, completad el formulario de autoevaluación antes de vuestra reunión.

🎯 TEMAS A TRATAR:
• Logros del trimestre
• Áreas de desarrollo
• Objetivos 2025
• Plan de formación
• Expectativas salariales

Las reuniones serán individuales (45 min) con vuestro supervisor directo.

Cualquier duda, contactad con RRHH.`,
    destinatarios: 'todos',
    departamentos: null,
    fecha_envio: new Date('2025-01-03T10:00:00'),
    fecha_programada: null,
    estado: 'enviado',
    total_destinatarios: 120,
    lecturas: 105,
    tasa_apertura: 88
  },
  {
    id: 'com-007',
    titulo: 'Programa de Bienestar Emocional',
    tipo: 'bienestar',
    categoria: 'salud-mental',
    prioridad: 'media',
    cuerpo: `En SportLife nos preocupamos por el bienestar integral de nuestro equipo.

Lanzamos nuestro Programa de Bienestar Emocional:

🧘 SERVICIOS INCLUIDOS:
• Sesiones de mindfulness (lunes y miércoles 7:30am)
• Consultas con psicólogo deportivo (confidencial)
• Talleres de gestión del estrés
• Técnicas de respiración y relajación
• Grupo de apoyo entre compañeros

💙 BENEFICIOS:
- Reducción del estrés laboral
- Mejor manejo de presiones
- Mayor equilibrio vida-trabajo
- Ambiente laboral positivo

Todos los servicios son gratuitos y completamente confidenciales.

Para agendar: bienestar@sportlife.com

Recordad: cuidar vuestra salud mental es tan importante como vuestra salud física.`,
    destinatarios: 'todos',
    departamentos: null,
    fecha_envio: new Date('2024-12-28T13:00:00'),
    fecha_programada: null,
    estado: 'enviado',
    total_destinatarios: 120,
    lecturas: 94,
    tasa_apertura: 78
  },
  {
    id: 'com-008',
    titulo: 'Nueva Alianza: Descuentos en Productos Deportivos',
    tipo: 'beneficio',
    categoria: 'descuentos',
    prioridad: 'baja',
    cuerpo: `¡Tenemos una gran noticia para el equipo!

Hemos establecido alianzas con marcas líderes del sector:

🏃 NIKE - 30% descuento en toda la tienda
💪 UNDER ARMOUR - 25% en ropa deportiva
⌚ GARMIN - 20% en relojes y wearables
🥤 MYPROTEIN - 35% en suplementos
👟 ADIDAS - 30% en calzado deportivo

📱 CÓMO ACCEDER:
1. Descargad la app SportLife Benefits
2. Usad vuestro código de empleado
3. Disfrutad de los descuentos

Los descuentos son acumulables a ofertas especiales y válidos todo el año.

¡Aprovechad estos beneficios exclusivos para el equipo SportLife!`,
    destinatarios: 'todos',
    departamentos: null,
    fecha_envio: new Date('2024-12-20T15:00:00'),
    fecha_programada: null,
    estado: 'enviado',
    total_destinatarios: 120,
    lecturas: 118,
    tasa_apertura: 98
  },
  {
    id: 'com-009',
    titulo: 'Actualización: Horarios de Apertura Enero',
    tipo: 'informativo',
    categoria: 'operaciones',
    prioridad: 'alta',
    cuerpo: `Equipo SportLife,

Cambios en horarios para el mes de enero:

📅 HORARIO REGULAR:
Lunes a Viernes: 6:00 - 23:00
Sábados: 8:00 - 21:00
Domingos: 9:00 - 20:00

🔄 TURNOS DE TRABAJO:
• Turno mañana: 6:00 - 14:00
• Turno tarde: 14:00 - 23:00
• Turno fin de semana: consultar planificación

⚠️ DÍAS ESPECIALES:
26 enero (festivo local): horario reducido 10:00-18:00

Por favor, confirmad vuestros turnos con vuestro supervisor antes del 16 de enero.

Las planificaciones se publicarán el 17 de enero en la app del personal.`,
    destinatarios: 'departamentos',
    departamentos: ['Recepción y Atención', 'Entrenamiento Personal'],
    fecha_envio: new Date('2024-12-15T12:00:00'),
    fecha_programada: null,
    estado: 'enviado',
    total_destinatarios: 53,
    lecturas: 53,
    tasa_apertura: 100
  },
  {
    id: 'com-010',
    titulo: 'Felicitaciones: Récord de Satisfacción del Cliente',
    tipo: 'reconocimiento',
    categoria: 'logros',
    prioridad: 'media',
    cuerpo: `¡FELICIDADES A TODO EL EQUIPO!

Hemos alcanzado un hito histórico:

⭐ 4.9/5.0 en satisfacción del cliente
🏆 95% de retención de membresías
📈 +40% en recomendaciones
💬 Mejor valoración en Google (4.8 estrellas)

Este logro es resultado del esfuerzo, dedicación y pasión de cada uno de vosotros.

🌟 DESTACADOS DEL MES:
- Mejor entrenador: Carlos Martínez (EP)
- Mejor nutricionista: Laura González (Nutrición)
- Mejor fisioterapeuta: Javier Ruiz (Fisio)
- Mejor instructor: Ana Morales (Clases Grupales)
- Mejor atención: María López (Recepción)

Continuemos brindando experiencias excepcionales que transformen vidas.

¡GRACIAS POR HACER DE SPORTLIFE UN LUGAR ESPECIAL!`,
    destinatarios: 'todos',
    departamentos: null,
    fecha_envio: new Date('2024-12-10T17:00:00'),
    fecha_programada: null,
    estado: 'enviado',
    total_destinatarios: 120,
    lecturas: 120,
    tasa_apertura: 100
  },
  {
    id: 'com-011',
    titulo: 'Próximo: Workshop de Técnicas Avanzadas de Coaching',
    tipo: 'formacion',
    categoria: 'desarrollo-profesional',
    prioridad: 'media',
    cuerpo: `Entrenadores y Coaches:

Oportunidad de formación avanzada:

🎓 WORKSHOP: Técnicas Avanzadas de Coaching Deportivo
📅 Fecha: 30 de enero 2025
🕐 Horario: 9:00 - 18:00
📍 Sala de formación SportLife

👨‍🏫 INSTRUCTOR:
Dr. Roberto Sánchez (PhD en Ciencias del Deporte)
- 15 años entrenando atletas olímpicos
- Autor de 3 libros sobre coaching deportivo

📚 CONTENIDO:
• Programación avanzada del entrenamiento
• Periodización para objetivos específicos
• Psicología del rendimiento
• Prevención de lesiones
• Nutrición periodizada
• Casos de estudio reales

💼 INCLUYE:
- Material didáctico completo
- Certificado de asistencia
- Lunch y coffee breaks

Plazas limitadas a 20 personas. Inscripciones: formacion@sportlife.com`,
    destinatarios: 'departamentos',
    departamentos: ['Entrenamiento Personal', 'Clases Grupales'],
    fecha_envio: new Date('2024-12-05T11:00:00'),
    fecha_programada: null,
    estado: 'enviado',
    total_destinatarios: 63,
    lecturas: 58,
    tasa_apertura: 92
  },
  {
    id: 'com-012',
    titulo: 'Bono Navidad y Agradecimiento',
    tipo: 'reconocimiento',
    categoria: 'compensacion',
    prioridad: 'alta',
    cuerpo: `Querido equipo SportLife,

Al finalizar este año excepcional, queremos expresar nuestro profundo agradecimiento.

🎁 BONO NAVIDAD 2024:
Se ha depositado vuestro bono navidad según vuestra antigüedad y desempeño. Revisad vuestras cuentas.

📊 RESUMEN 2024:
• 2,500+ clientes transformados
• 15,000+ entrenamientos personalizados
• 8,000+ sesiones de fisioterapia
• 1,200+ planes nutricionales
• 98% satisfacción del cliente

🏆 LOGROS DESTACADOS:
- Premio "Mejor Centro Deportivo Regional"
- Certificación ISO en calidad de servicio
- Expansión del equipo: +25 nuevos profesionales
- Nuevas instalaciones y equipamiento

👏 GRACIAS:
Gracias por vuestra dedicación, profesionalismo y pasión. Sois el corazón de SportLife.

¡Felices fiestas y próspero 2025!

La Dirección`,
    destinatarios: 'todos',
    departamentos: null,
    fecha_envio: new Date('2024-12-01T10:00:00'),
    fecha_programada: null,
    estado: 'enviado',
    total_destinatarios: 120,
    lecturas: 120,
    tasa_apertura: 100
  }
];

export const getComunicadosPorEncuesta = (encuestaId) => {
  return comunicadosMock.filter(c => c.encuesta_id === encuestaId);
};

export const agregarComunicado = (comunicado) => {
  const nuevo = {
    ...comunicado,
    id: `com-${Date.now()}`,
    fecha_envio: new Date(),
    estado: 'enviado'
  };
  comunicadosMock.push(nuevo);
  return nuevo;
};
