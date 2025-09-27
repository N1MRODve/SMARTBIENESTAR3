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