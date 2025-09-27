// /src/services/mock/colaboradores.service.js

// Base de datos simulada de colaboradores especializados
const colaboradores = [
  // Psicólogos
  {
    id: 'col-01',
    nombre: 'Dra. María González',
    apellido: 'González',
    especialidad: 'Psicología',
    subespecialidad: 'Psicología Organizacional',
    foto: 'https://i.pravatar.cc/150?u=maria.gonzalez',
    bio: 'Especialista en bienestar laboral con más de 10 años de experiencia ayudando a profesionales a gestionar el estrés y mejorar su rendimiento. Certificada en terapia cognitivo-conductual y mindfulness corporativo.',
    experiencia: 10,
    calificacion: 4.9,
    disponibilidad: {
      lunes: ['09:00', '10:00', '11:00', '14:00', '15:00'],
      martes: ['09:00', '10:00', '14:00', '15:00', '16:00'],
      miercoles: ['09:00', '11:00', '14:00', '15:00'],
      jueves: ['10:00', '11:00', '14:00', '15:00', '16:00'],
      viernes: ['09:00', '10:00', '11:00']
    },
    modalidades: ['presencial', 'virtual'],
    idiomas: ['Español', 'Inglés'],
    certificaciones: ['Colegio Oficial de Psicólogos', 'Certificación en Mindfulness', 'Especialización en Burnout'],
    tarifa: 80,
    estado: 'activo'
  },
  {
    id: 'col-02',
    nombre: 'Dr. Carlos Ruiz',
    apellido: 'Ruiz',
    especialidad: 'Psicología',
    subespecialidad: 'Psicología Clínica',
    foto: 'https://i.pravatar.cc/150?u=carlos.ruiz',
    bio: 'Psicólogo clínico especializado en ansiedad y depresión en el ámbito laboral. Enfoque terapéutico basado en evidencia científica, con técnicas de relajación y gestión emocional adaptadas al entorno corporativo.',
    experiencia: 8,
    calificacion: 4.8,
    disponibilidad: {
      lunes: ['10:00', '11:00', '15:00', '16:00'],
      martes: ['09:00', '10:00', '11:00', '15:00'],
      miercoles: ['10:00', '14:00', '15:00', '16:00'],
      jueves: ['09:00', '10:00', '14:00', '15:00'],
      viernes: ['10:00', '11:00', '14:00', '15:00']
    },
    modalidades: ['presencial', 'virtual'],
    idiomas: ['Español'],
    certificaciones: ['Colegio Oficial de Psicólogos', 'Especialización en Ansiedad', 'Terapia Cognitivo-Conductual'],
    tarifa: 75,
    estado: 'activo'
  },
  {
    id: 'col-03',
    nombre: 'Lic. Ana Martínez',
    apellido: 'Martínez',
    especialidad: 'Psicología',
    subespecialidad: 'Psicología Positiva',
    foto: 'https://i.pravatar.cc/150?u=ana.martinez',
    bio: 'Especialista en psicología positiva y desarrollo personal. Ayuda a profesionales a descubrir sus fortalezas, mejorar su autoestima y desarrollar resiliencia ante los desafíos laborales.',
    experiencia: 6,
    calificacion: 4.7,
    disponibilidad: {
      lunes: ['14:00', '15:00', '16:00', '17:00'],
      martes: ['14:00', '15:00', '16:00'],
      miercoles: ['09:00', '10:00', '14:00', '15:00'],
      jueves: ['14:00', '15:00', '16:00', '17:00'],
      viernes: ['09:00', '10:00', '11:00', '14:00']
    },
    modalidades: ['presencial', 'virtual'],
    idiomas: ['Español', 'Catalán'],
    certificaciones: ['Colegio Oficial de Psicólogos', 'Certificación en Psicología Positiva', 'Coaching Ontológico'],
    tarifa: 70,
    estado: 'activo'
  },

  // Coaches
  {
    id: 'col-04',
    nombre: 'Laura Pérez',
    apellido: 'Pérez',
    especialidad: 'Coaching',
    subespecialidad: 'Life Coaching',
    foto: 'https://i.pravatar.cc/150?u=laura.perez',
    bio: 'Coach certificada especializada en equilibrio vida-trabajo y desarrollo de liderazgo personal. Ayuda a profesionales a definir objetivos claros y desarrollar estrategias efectivas para alcanzarlos.',
    experiencia: 7,
    calificacion: 4.8,
    disponibilidad: {
      lunes: ['09:00', '10:00', '11:00', '16:00'],
      martes: ['09:00', '10:00', '15:00', '16:00'],
      miercoles: ['10:00', '11:00', '15:00', '16:00'],
      jueves: ['09:00', '10:00', '11:00', '15:00'],
      viernes: ['09:00', '10:00', '15:00', '16:00']
    },
    modalidades: ['presencial', 'virtual'],
    idiomas: ['Español', 'Inglés'],
    certificaciones: ['ICF Certified Coach', 'Especialización en Work-Life Balance', 'Certificación en PNL'],
    tarifa: 85,
    estado: 'activo'
  },
  {
    id: 'col-05',
    nombre: 'Miguel Fernández',
    apellido: 'Fernández',
    especialidad: 'Coaching',
    subespecialidad: 'Executive Coaching',
    foto: 'https://i.pravatar.cc/150?u=miguel.fernandez',
    bio: 'Coach ejecutivo con amplia experiencia en el desarrollo de habilidades de liderazgo y gestión del tiempo. Especializado en ayudar a profesionales a maximizar su potencial y mejorar su productividad.',
    experiencia: 12,
    calificacion: 4.9,
    disponibilidad: {
      lunes: ['08:00', '09:00', '17:00', '18:00'],
      martes: ['08:00', '09:00', '17:00', '18:00'],
      miercoles: ['08:00', '09:00', '17:00'],
      jueves: ['08:00', '09:00', '17:00', '18:00'],
      viernes: ['08:00', '09:00', '17:00']
    },
    modalidades: ['presencial', 'virtual'],
    idiomas: ['Español', 'Inglés', 'Francés'],
    certificaciones: ['ICF Master Certified Coach', 'Certificación en Liderazgo Ejecutivo', 'MBA en Gestión Empresarial'],
    tarifa: 120,
    estado: 'activo'
  },
  {
    id: 'col-06',
    nombre: 'Sofia López',
    apellido: 'López',
    especialidad: 'Coaching',
    subespecialidad: 'Career Coaching',
    foto: 'https://i.pravatar.cc/150?u=sofia.lopez',
    bio: 'Coach especializada en desarrollo profesional y transiciones de carrera. Ayuda a profesionales a identificar sus objetivos profesionales, desarrollar nuevas competencias y navegar cambios en su trayectoria laboral.',
    experiencia: 5,
    calificacion: 4.6,
    disponibilidad: {
      lunes: ['10:00', '11:00', '15:00', '16:00'],
      martes: ['10:00', '11:00', '14:00', '15:00'],
      miercoles: ['09:00', '10:00', '15:00', '16:00'],
      jueves: ['10:00', '11:00', '14:00', '15:00'],
      viernes: ['09:00', '10:00', '11:00', '15:00']
    },
    modalidades: ['presencial', 'virtual'],
    idiomas: ['Español', 'Inglés'],
    certificaciones: ['ICF Associate Certified Coach', 'Certificación en Career Development', 'Especialización en Transiciones Profesionales'],
    tarifa: 65,
    estado: 'activo'
  },

  // Especialistas adicionales
  {
    id: 'col-07',
    nombre: 'Dr. David Sánchez',
    apellido: 'Sánchez',
    especialidad: 'Psicología',
    subespecialidad: 'Neuropsicología',
    foto: 'https://i.pravatar.cc/150?u=david.sanchez',
    bio: 'Neuropsicólogo especializado en optimización cognitiva y gestión del rendimiento mental. Ayuda a profesionales a mejorar su concentración, memoria y capacidad de toma de decisiones bajo presión.',
    experiencia: 9,
    calificacion: 4.8,
    disponibilidad: {
      lunes: ['09:00', '10:00', '14:00'],
      martes: ['09:00', '10:00', '14:00', '15:00'],
      miercoles: ['10:00', '11:00', '14:00'],
      jueves: ['09:00', '10:00', '14:00', '15:00'],
      viernes: ['09:00', '10:00']
    },
    modalidades: ['presencial', 'virtual'],
    idiomas: ['Español', 'Inglés'],
    certificaciones: ['Colegio Oficial de Psicólogos', 'Especialización en Neuropsicología', 'Certificación en Optimización Cognitiva'],
    tarifa: 90,
    estado: 'activo'
  },
  {
    id: 'col-08',
    nombre: 'Elena Ruiz',
    apellido: 'Ruiz',
    especialidad: 'Coaching',
    subespecialidad: 'Wellness Coaching',
    foto: 'https://i.pravatar.cc/150?u=elena.ruiz',
    bio: 'Coach de bienestar integral especializada en crear hábitos saludables y sostenibles. Combina técnicas de coaching con conocimientos de nutrición y ejercicio para un enfoque holístico del bienestar.',
    experiencia: 4,
    calificacion: 4.5,
    disponibilidad: {
      lunes: ['11:00', '15:00', '16:00'],
      martes: ['11:00', '15:00', '16:00', '17:00'],
      miercoles: ['10:00', '11:00', '15:00'],
      jueves: ['11:00', '15:00', '16:00'],
      viernes: ['10:00', '11:00', '15:00', '16:00']
    },
    modalidades: ['presencial', 'virtual'],
    idiomas: ['Español'],
    certificaciones: ['ICF Certified Coach', 'Certificación en Wellness Coaching', 'Especialización en Hábitos Saludables'],
    tarifa: 60,
    estado: 'activo'
  }
];

// Función para obtener todos los colaboradores
export const getColaboradores = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([...colaboradores]);
    }, 300);
  });
};

// Función para obtener colaboradores por especialidad
export const getColaboradoresPorEspecialidad = (especialidad) => {
  return new Promise(resolve => {
    setTimeout(() => {
      const colaboradoresFiltrados = colaboradores.filter(c => 
        c.especialidad.toLowerCase() === especialidad.toLowerCase() && 
        c.estado === 'activo'
      );
      resolve(colaboradoresFiltrados);
    }, 300);
  });
};

// Función para obtener especialistas en salud mental (Psicología + Coaching)
export const getEspecialistasSaludMental = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      const especialistas = colaboradores.filter(c => 
        (c.especialidad === 'Psicología' || c.especialidad === 'Coaching') && 
        c.estado === 'activo'
      );
      // Ordenar por calificación descendente
      especialistas.sort((a, b) => b.calificacion - a.calificacion);
      resolve(especialistas);
    }, 400);
  });
};

// Función para obtener un colaborador específico por ID
export const getColaboradorById = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const colaborador = colaboradores.find(c => c.id === id);
      if (colaborador) {
        resolve({ ...colaborador });
      } else {
        reject(new Error('Colaborador no encontrado'));
      }
    }, 300);
  });
};

// Función para obtener disponibilidad de un colaborador para una fecha específica
export const getDisponibilidadColaborador = (colaboradorId, fecha) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const colaborador = colaboradores.find(c => c.id === colaboradorId);
      if (!colaborador) {
        reject(new Error('Colaborador no encontrado'));
        return;
      }

      const fechaObj = new Date(fecha);
      const diaSemana = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'][fechaObj.getDay()];
      
      const horariosDisponibles = colaborador.disponibilidad[diaSemana] || [];
      
      resolve({
        colaborador: colaborador.nombre,
        fecha,
        diaSemana,
        horariosDisponibles,
        modalidades: colaborador.modalidades
      });
    }, 200);
  });
};

// Función para reservar una cita
export const reservarCita = (colaboradorId, fecha, hora, modalidad, motivo) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const colaborador = colaboradores.find(c => c.id === colaboradorId);
      if (!colaborador) {
        reject(new Error('Colaborador no encontrado'));
        return;
      }

      // Simular validación de disponibilidad
      const fechaObj = new Date(fecha);
      const diaSemana = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'][fechaObj.getDay()];
      const horariosDisponibles = colaborador.disponibilidad[diaSemana] || [];
      
      if (!horariosDisponibles.includes(hora)) {
        reject(new Error('Horario no disponible'));
        return;
      }

      if (!colaborador.modalidades.includes(modalidad)) {
        reject(new Error('Modalidad no disponible'));
        return;
      }

      const cita = {
        id: `cita-${Date.now()}`,
        colaboradorId,
        colaboradorNombre: `${colaborador.nombre} ${colaborador.apellido}`,
        fecha,
        hora,
        modalidad,
        motivo: motivo || 'Consulta de bienestar',
        estado: 'confirmada',
        fechaReserva: new Date().toISOString()
      };

      console.log('Cita reservada exitosamente:', cita);
      resolve({
        success: true,
        cita,
        mensaje: `Cita reservada con ${colaborador.nombre} para el ${fecha} a las ${hora}`
      });
    }, 800);
  });
};

// Función para obtener estadísticas de colaboradores
export const getEstadisticasColaboradores = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      const totalColaboradores = colaboradores.length;
      const colaboradoresActivos = colaboradores.filter(c => c.estado === 'activo').length;
      const especialidadesPorTipo = colaboradores.reduce((acc, c) => {
        acc[c.especialidad] = (acc[c.especialidad] || 0) + 1;
        return acc;
      }, {});
      
      const calificacionPromedio = colaboradores.reduce((sum, c) => sum + c.calificacion, 0) / totalColaboradores;

      resolve({
        totalColaboradores,
        colaboradoresActivos,
        especialidadesPorTipo,
        calificacionPromedio: Math.round(calificacionPromedio * 10) / 10,
        modalidadesDisponibles: ['presencial', 'virtual']
      });
    }, 200);
  });
};

// Función para resetear colaboradores (útil para la demo)
export const resetColaboradores = () => {
  console.log('Colaboradores reseteados al estado inicial');
  return colaboradores;
};

/**
 * Genera y devuelve una lista de huecos de disponibilidad para un colaborador.
 * @param {string} colaboradorId - El ID del colaborador.
 * @returns {Promise<Array>} Una promesa que resuelve con la lista de huecos.
 */
export const getDisponibilidad = async (colaboradorId) => {
  console.log(`Buscando disponibilidad para el colaborador: ${colaboradorId}`);
  const disponibilidad = [];
  const hoy = new Date();

  // Generar huecos para los próximos 7 días
  for (let i = 1; i < 8; i++) {
    const dia = new Date(hoy);
    dia.setDate(hoy.getDate() + i);

    // Solo generar huecos en días laborables
    if (dia.getDay() > 0 && dia.getDay() < 6) {
      // Generar huecos de 9 a 17h
      for (let hora = 9; hora < 17; hora++) {
        // Añadir algo de aleatoriedad para que no todos los huecos estén disponibles
        if (Math.random() > 0.4) { 
          disponibilidad.push({
            id: `slot-${colaboradorId}-${dia.toISOString().slice(0,10)}-${hora}`,
            fecha: dia.toISOString().slice(0, 10),
            hora: `${hora}:00`,
            disponible: true
          });
        }
      }
    }
  }

  return new Promise(resolve => setTimeout(() => resolve(disponibilidad), 400));
};