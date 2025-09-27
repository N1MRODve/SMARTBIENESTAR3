// /src/services/mock/sesiones.service.js

// Base de datos simulada de sesiones
let sesiones = [
  {
    id: 1,
    servicioId: 'serv-01',
    titulo: 'Taller de Mindfulness - Sesión Matutina',
    descripcion: 'Aprende técnicas de mindfulness para reducir el estrés laboral',
    fecha: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // En 3 días
    hora: '09:00',
    duracion: 120, // minutos
    plazasTotales: 15,
    modalidad: 'presencial',
    ubicacion: 'Sala de Reuniones Principal',
    instructor: 'Dra. María González',
    participantes: [
      { id: 'emp-001', nombre: 'Ana García', email: 'ana@empresa.com' },
      { id: 'emp-002', nombre: 'Carlos López', email: 'carlos@empresa.com' }
    ],
    estado: 'programada', // programada, en_curso, completada, cancelada
    fechaCreacion: new Date().toISOString()
  },
  {
    id: 2,
    servicioId: 'serv-04',
    titulo: 'Clase de Yoga para Principiantes',
    descripcion: 'Sesión de yoga relajante para reducir el estrés',
    fecha: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // En 5 días (viernes)
    hora: '18:00',
    duracion: 60,
    plazasTotales: 12,
    modalidad: 'presencial',
    ubicacion: 'Sala de Bienestar',
    instructor: 'Instructora Laura Pérez',
    participantes: [],
    estado: 'programada',
    fechaCreacion: new Date().toISOString()
  }
];

// Servicios solicitados (simulando solicitudes previas)
let serviciosSolicitados = [
  {
    id: 'sol-001',
    servicioId: 'serv-01',
    servicioTitulo: 'Taller de Mindfulness y Gestión del Estrés',
    fechaSolicitud: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    solicitadoPor: 'admin@demo.com',
    estado: 'aprobado',
    notas: 'Solicitado para reducir el estrés del equipo de desarrollo'
  },
  {
    id: 'sol-002',
    servicioId: 'serv-04',
    servicioTitulo: 'Clase de Yoga para Principiantes',
    fechaSolicitud: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    solicitadoPor: 'admin@demo.com',
    estado: 'aprobado',
    notas: 'Actividad para mejorar el bienestar físico del equipo'
  },
  {
    id: 'sol-003',
    servicioId: 'serv-02',
    servicioTitulo: 'Consulta de Ergonomía y Postura Laboral',
    fechaSolicitud: new Date().toISOString(),
    solicitadoPor: 'admin@demo.com',
    estado: 'pendiente',
    notas: 'Evaluación de puestos de trabajo tras feedback de empleados'
  }
];

// Función para obtener todas las sesiones
export const getSesiones = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      // Ordenar por fecha y hora
      const sesionesSorted = [...sesiones].sort((a, b) => {
        const fechaA = new Date(`${a.fecha}T${a.hora}`);
        const fechaB = new Date(`${b.fecha}T${b.hora}`);
        return fechaA - fechaB;
      });
      resolve(sesionesSorted);
    }, 300);
  });
};

// Función para obtener sesiones por empleado
export const getSesionesByEmpleado = (empleadoId) => {
  return new Promise(resolve => {
    setTimeout(() => {
      const sesionesEmpleado = sesiones.filter(sesion => 
        sesion.participantes.some(p => p.id === empleadoId)
      );
      resolve(sesionesEmpleado);
    }, 300);
  });
};

// Función para obtener servicios solicitados
export const getServiciosSolicitados = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([...serviciosSolicitados]);
    }, 300);
  });
};

// Función para añadir una nueva sesión
export const addSesion = (nuevaSesion) => {
  return new Promise(resolve => {
    setTimeout(() => {
      const sesion = {
        id: Date.now(),
        servicioId: nuevaSesion.servicioId,
        titulo: nuevaSesion.titulo,
        descripcion: nuevaSesion.descripcion || '',
        fecha: nuevaSesion.fecha,
        hora: nuevaSesion.hora,
        duracion: nuevaSesion.duracion || 60,
        plazasTotales: nuevaSesion.plazasTotales,
        modalidad: nuevaSesion.modalidad || 'presencial',
        ubicacion: nuevaSesion.ubicacion || '',
        instructor: nuevaSesion.instructor || '',
        participantes: [],
        estado: 'programada',
        fechaCreacion: new Date().toISOString()
      };
      
      sesiones.push(sesion);
      console.log('Nueva sesión añadida:', sesion);
      resolve({ success: true, sesion });
    }, 500);
  });
};

// Función para reservar una plaza
export const reservarPlaza = (sesionId, empleado) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const sesion = sesiones.find(s => s.id === parseInt(sesionId));
      
      if (!sesion) {
        reject(new Error('Sesión no encontrada'));
        return;
      }
      
      // Verificar si ya está reservado
      const yaReservado = sesion.participantes.some(p => p.id === empleado.id);
      if (yaReservado) {
        reject(new Error('Ya tienes una reserva para esta sesión'));
        return;
      }
      
      // Verificar plazas disponibles
      if (sesion.participantes.length >= sesion.plazasTotales) {
        reject(new Error('No hay plazas disponibles'));
        return;
      }
      
      // Añadir participante
      sesion.participantes.push({
        id: empleado.id,
        nombre: empleado.nombre || 'Empleado Demo',
        email: empleado.email || 'empleado@demo.com',
        fechaReserva: new Date().toISOString()
      });
      
      console.log('Plaza reservada:', { sesionId, empleado: empleado.nombre });
      resolve({ 
        success: true, 
        sesion,
        plazasDisponibles: sesion.plazasTotales - sesion.participantes.length
      });
    }, 800);
  });
};

// Función para cancelar una reserva
export const cancelarReserva = (sesionId, empleadoId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const sesion = sesiones.find(s => s.id === parseInt(sesionId));
      
      if (!sesion) {
        reject(new Error('Sesión no encontrada'));
        return;
      }
      
      const participanteIndex = sesion.participantes.findIndex(p => p.id === empleadoId);
      if (participanteIndex === -1) {
        reject(new Error('No tienes una reserva para esta sesión'));
        return;
      }
      
      // Remover participante
      sesion.participantes.splice(participanteIndex, 1);
      
      console.log('Reserva cancelada:', { sesionId, empleadoId });
      resolve({ 
        success: true, 
        sesion,
        plazasDisponibles: sesion.plazasTotales - sesion.participantes.length
      });
    }, 500);
  });
};

// Función para obtener una sesión específica
export const getSesionById = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const sesion = sesiones.find(s => s.id === parseInt(id));
      if (sesion) {
        resolve({ ...sesion });
      } else {
        reject(new Error('Sesión no encontrada'));
      }
    }, 300);
  });
};

// Función para resetear sesiones (útil para la demo)
export const resetSesiones = () => {
  sesiones = [
    {
      id: 1,
      servicioId: 'serv-01',
      titulo: 'Taller de Mindfulness - Sesión Matutina',
      descripcion: 'Aprende técnicas de mindfulness para reducir el estrés laboral',
      fecha: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      hora: '09:00',
      duracion: 120,
      plazasTotales: 15,
      modalidad: 'presencial',
      ubicacion: 'Sala de Reuniones Principal',
      instructor: 'Dra. María González',
      participantes: [
        { id: 'emp-001', nombre: 'Ana García', email: 'ana@empresa.com' },
        { id: 'emp-002', nombre: 'Carlos López', email: 'carlos@empresa.com' }
      ],
      estado: 'programada',
      fechaCreacion: new Date().toISOString()
    },
    {
      id: 2,
      servicioId: 'serv-04',
      titulo: 'Clase de Yoga para Principiantes',
      descripcion: 'Sesión de yoga relajante para reducir el estrés',
      fecha: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      hora: '18:00',
      duracion: 60,
      plazasTotales: 12,
      modalidad: 'presencial',
      ubicacion: 'Sala de Bienestar',
      instructor: 'Instructora Laura Pérez',
      participantes: [],
      estado: 'programada',
      fechaCreacion: new Date().toISOString()
    }
  ];
  return sesiones;
};