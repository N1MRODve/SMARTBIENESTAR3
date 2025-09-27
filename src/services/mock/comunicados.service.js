// /src/services/mock/comunicados.service.js

// Base de datos simulada de comunicados
let comunicados = [
  {
    id: 1,
    titulo: 'Nuevas Medidas de Bienestar Implementadas',
    contenido: 'Gracias a su feedback en la última encuesta, hemos implementado nuevas medidas para mejorar el bienestar en el trabajo. A partir de la próxima semana, tendremos sesiones de mindfulness los martes y jueves de 12:00 a 12:30 en la sala de reuniones principal. También hemos mejorado la ergonomía de los puestos de trabajo en el área de desarrollo.',
    fechaCreacion: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // Hace 2 días
  },
  {
    id: 2,
    titulo: 'Programa de Coaching de Equipos',
    contenido: 'Hemos escuchado sus comentarios sobre la necesidad de mejorar la comunicación entre equipos. Por ello, hemos contratado a una especialista en coaching organizacional que trabajará con nosotros durante los próximos 3 meses. Las sesiones comenzarán el lunes 29 de enero. Más detalles próximamente.',
    fechaCreacion: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // Hace 5 días
  }
];

// Función para obtener todos los comunicados
export const getComunicados = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      // Ordenar del más reciente al más antiguo
      const comunicadosOrdenados = [...comunicados].sort((a, b) => 
        new Date(b.fechaCreacion) - new Date(a.fechaCreacion)
      );
      resolve(comunicadosOrdenados);
    }, 300);
  });
};

// Función para añadir un nuevo comunicado
export const addComunicado = (nuevoComunicado) => {
  return new Promise(resolve => {
    setTimeout(() => {
      const comunicado = {
        id: Date.now(),
        titulo: nuevoComunicado.titulo,
        contenido: nuevoComunicado.contenido,
        fechaCreacion: new Date().toISOString()
      };
      
      comunicados.unshift(comunicado); // Añadir al principio del array
      console.log('Nuevo comunicado añadido:', comunicado);
      resolve({ success: true, comunicado });
    }, 500);
  });
};

// Función para resetear comunicados (útil para la demo)
export const resetComunicados = () => {
  comunicados = [
    {
      id: 1,
      titulo: 'Nuevas Medidas de Bienestar Implementadas',
      contenido: 'Gracias a su feedback en la última encuesta, hemos implementado nuevas medidas para mejorar el bienestar en el trabajo. A partir de la próxima semana, tendremos sesiones de mindfulness los martes y jueves de 12:00 a 12:30 en la sala de reuniones principal. También hemos mejorado la ergonomía de los puestos de trabajo en el área de desarrollo.',
      fechaCreacion: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 2,
      titulo: 'Programa de Coaching de Equipos',
      contenido: 'Hemos escuchado sus comentarios sobre la necesidad de mejorar la comunicación entre equipos. Por ello, hemos contratado a una especialista en coaching organizacional que trabajará con nosotros durante los próximos 3 meses. Las sesiones comenzarán el lunes 29 de enero. Más detalles próximamente.',
      fechaCreacion: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];
  return comunicados;
};