// /src/services/mock/gamificacion.service.js

import { ref } from 'vue';

// Catálogo de logros disponibles en la plataforma
const catalogoLogros = [
  { id: 'logro-01', titulo: 'Primeros Pasos', descripcion: 'Completa tu primera encuesta de bienestar.', icono: '👣' },
  { id: 'logro-02', titulo: 'Participante Activo', descripcion: 'Asiste a tu primera actividad de bienestar.', icono: '🧘' },
  { id: 'logro-03', titulo: 'Comprador Inteligente', descripcion: 'Canjea tu primera recompensa.', icono: '🎁' },
  { id: 'logro-04', titulo: 'Campeón del Bienestar', descripcion: 'Acumula 1000 Puntos de Bienestar.', icono: '🏆' },
];

// Simula una tabla en la BD que guarda los logros de cada usuario
const logrosUsuarios = ref({
  'user-empleado-01': ['logro-01'], // El empleado demo ya tiene un logro
});

// Base de datos simulada de puntos por usuario
let puntosUsuarios = {
  'user-empleado-01': 50,
  'user-admin-01': 0,
  'emp-001': 75,
  'emp-002': 120
};

// Historial de transacciones de puntos (para tracking)
let historialPuntos = [];

// Función para obtener los puntos de un usuario
export const getPuntos = (usuarioId) => {
  return new Promise(resolve => {
    setTimeout(() => {
      const puntos = puntosUsuarios[usuarioId] || 0;
      console.log(`Puntos obtenidos para ${usuarioId}:`, puntos);
      resolve(puntos);
    }, 200);
  });
};

// Función para añadir puntos a un usuario
export const addPuntos = (usuarioId, cantidad, motivo = 'Actividad completada') => {
  return new Promise(resolve => {
    setTimeout(() => {
      if (!puntosUsuarios[usuarioId]) {
        puntosUsuarios[usuarioId] = 0;
      }
      
      puntosUsuarios[usuarioId] += cantidad;
      
      // Registrar en el historial
      const transaccion = {
        id: Date.now(),
        usuarioId,
        cantidad,
        motivo,
        fecha: new Date().toISOString(),
        puntosTotal: puntosUsuarios[usuarioId]
      };
      
      historialPuntos.unshift(transaccion);
      
      console.log(`Puntos añadidos: +${cantidad} para ${usuarioId}. Total: ${puntosUsuarios[usuarioId]}`);
      console.log(`Motivo: ${motivo}`);
      
      resolve({
        success: true,
        puntosNuevos: cantidad,
        puntosTotal: puntosUsuarios[usuarioId],
        transaccion
      });
    }, 300);
  });
};

// Función para obtener el historial de puntos de un usuario
export const getHistorialPuntos = (usuarioId) => {
  return new Promise(resolve => {
    setTimeout(() => {
      const historialUsuario = historialPuntos.filter(t => t.usuarioId === usuarioId);
      resolve(historialUsuario);
    }, 200);
  });
};

// Función para obtener el ranking de usuarios (top 10)
export const getRankingPuntos = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      const ranking = Object.entries(puntosUsuarios)
        .map(([usuarioId, puntos]) => ({ usuarioId, puntos }))
        .sort((a, b) => b.puntos - a.puntos)
        .slice(0, 10);
      
      resolve(ranking);
    }, 300);
  });
};

// Función para resetear puntos (útil para la demo)
export const resetPuntos = () => {
  puntosUsuarios = {
    'user-empleado-01': 50,
    'user-admin-01': 0,
    'emp-001': 75,
    'emp-002': 120
  };
  historialPuntos = [];
  
  console.log('Puntos reseteados al estado inicial');
  return puntosUsuarios;
};

// Constantes para diferentes tipos de actividades
export const PUNTOS_ACTIVIDADES = {
  RESPONDER_ENCUESTA: 10,
  RESERVAR_SESION: 25,
  ASISTIR_SESION: 50,
  COMPLETAR_PERFIL: 15,
  PRIMER_LOGIN: 5
};

// Función auxiliar para obtener puntos por tipo de actividad
export const getPuntosPorActividad = (tipoActividad) => {
  return PUNTOS_ACTIVIDADES[tipoActividad] || 0;