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

// Mock data de comunicados enviados
export const comunicadosMock = [
  {
    id: 'com-001',
    nombre_encuesta: 'Encuesta de Pulso de Bienestar (Q3)',
    tipo: 'mejora',
    cuerpo: 'Tras los resultados de la encuesta Encuesta de Pulso de Bienestar (Q3), hemos detectado áreas de mejora...',
    destinatarios: ['todos'],
    fecha_envio: new Date('2025-09-20'),
    estado: 'enviado',
    total_destinatarios: 70
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
