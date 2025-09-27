// /src/services/mock/servicios.service.js

const servicios = [
  { 
    id: 'serv-01', 
    titulo: 'Taller de Mindfulness y Gestión del Estrés', 
    descripcion: 'Una sesión grupal para aprender técnicas de meditación y control del estrés aplicables en el día a día laboral.', 
    palabraClave: 'estrés' 
  },
  { 
    id: 'serv-02', 
    titulo: 'Consulta de Ergonomía y Postura Laboral', 
    descripcion: 'Un especialista evaluará los puestos de trabajo para prevenir dolencias físicas y mejorar la comodidad.', 
    palabraClave: 'ergonomía' 
  },
  { 
    id: 'serv-03', 
    titulo: 'Sesión de Coaching de Equipo', 
    descripcion: 'Fomenta la comunicación y la colaboración para mejorar el clima y la eficiencia del equipo.', 
    palabraClave: 'comunicacion'
  },
  {
    id: 'serv-04',
    titulo: 'Clase de Yoga para Principiantes',
    descripcion: 'Una actividad relajante para reducir el estrés y mejorar el bienestar físico general.',
    palabraClave: 'estrés'
  }
];

export const getServicios = () => {
  // En una aplicación real, esto sería una llamada a la API.
  // Por ahora, devolvemos nuestros datos simulados.
  return servicios;
};

export const getServicioById = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const servicio = servicios.find(s => s.id === id);
      if (servicio) {
        // Añadir información adicional para la vista de detalle
        const servicioDetallado = {
          ...servicio,
          beneficios: getBeneficiosPorServicio(servicio.id),
          impartidoPor: getImpartidoPorServicio(servicio.id),
          duracion: getDuracionPorServicio(servicio.id),
          modalidad: getModalidadPorServicio(servicio.id),
          precio: getPrecioPorServicio(servicio.id),
          disponibilidad: 'Disponible para programar'
        };
        resolve(servicioDetallado);
      } else {
        reject(new Error('Servicio no encontrado'));
      }
    }, 300);
  });
};

// Funciones auxiliares para generar contenido detallado
const getBeneficiosPorServicio = (id) => {
  const beneficiosMap = {
    'serv-01': [
      'Reducción significativa del estrés laboral',
      'Mejora en la concentración y productividad',
      'Técnicas aplicables en el día a día',
      'Ambiente de trabajo más relajado'
    ],
    'serv-02': [
      'Prevención de dolores musculares',
      'Mejora en la postura corporal',
      'Reducción del ausentismo por dolencias físicas',
      'Espacios de trabajo más cómodos y eficientes'
    ],
    'serv-03': [
      'Mejor comunicación entre equipos',
      'Resolución efectiva de conflictos',
      'Aumento en la colaboración',
      'Clima laboral más positivo'
    ],
    'serv-04': [
      'Reducción del estrés y ansiedad',
      'Mejora en la flexibilidad física',
      'Fortalecimiento del core y postura',
      'Técnicas de relajación para el trabajo'
    ]
  };
  return beneficiosMap[id] || ['Beneficios personalizados según las necesidades del equipo'];
};

const getImpartidoPorServicio = (id) => {
  const instructoresMap = {
    'serv-01': 'Dra. María González - Especialista en Mindfulness Corporativo',
    'serv-02': 'Ing. Carlos Ruiz - Ergónomo Certificado',
    'serv-03': 'Lic. Ana Martínez - Coach Organizacional',
    'serv-04': 'Instructora Laura Pérez - Yoga Terapéutico'
  };
  return instructoresMap[id] || 'Especialista certificado en bienestar corporativo';
};

const getDuracionPorServicio = (id) => {
  const duracionMap = {
    'serv-01': '2 horas (sesión grupal)',
    'serv-02': '1 hora por puesto de trabajo',
    'serv-03': '3 horas (taller interactivo)',
    'serv-04': '1 hora (clase práctica)'
  };
  return duracionMap[id] || '1-2 horas según necesidades';
};

const getModalidadPorServicio = (id) => {
  const modalidadMap = {
    'serv-01': 'Presencial o Virtual',
    'serv-02': 'Presencial (evaluación in-situ)',
    'serv-03': 'Presencial (dinámicas grupales)',
    'serv-04': 'Presencial o Virtual'
  };
  return modalidadMap[id] || 'Presencial y Virtual disponible';
};

const getPrecioPorServicio = (id) => {
  const precioMap = {
    'serv-01': 'Desde 150€ por sesión grupal',
    'serv-02': 'Desde 80€ por evaluación',
    'serv-03': 'Desde 200€ por taller',
    'serv-04': 'Desde 120€ por clase'
  };
  return precioMap[id] || 'Cotización personalizada';
};