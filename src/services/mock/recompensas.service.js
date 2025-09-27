// /src/services/mock/recompensas.service.js

import { getPuntos, addPuntos } from './gamificacion.service.js';

// Catálogo de recompensas disponibles
const catalogo = [
  {
    id: 'rec-01',
    titulo: 'Día Libre Adicional',
    descripcion: 'Un día libre extra para disfrutar con tu familia',
    coste: 500,
    categoria: 'tiempo',
    icono: '🏖️',
    disponible: true,
    popularidad: 5
  },
  {
    id: 'rec-02',
    titulo: 'Almuerzo Premium',
    descripcion: 'Almuerzo gourmet en restaurante seleccionado',
    coste: 150,
    categoria: 'gastronomia',
    icono: '🍽️',
    disponible: true,
    popularidad: 4
  },
  {
    id: 'rec-03',
    titulo: 'Masaje Relajante',
    descripcion: 'Sesión de masaje de 60 minutos en spa',
    coste: 300,
    categoria: 'bienestar',
    icono: '💆‍♀️',
    disponible: true,
    popularidad: 5
  },
  {
    id: 'rec-04',
    titulo: 'Tarjeta Regalo Amazon',
    descripcion: 'Tarjeta regalo de 25€ para Amazon',
    coste: 250,
    categoria: 'compras',
    icono: '🎁',
    disponible: true,
    popularidad: 4
  },
  {
    id: 'rec-05',
    titulo: 'Entrada al Cine',
    descripcion: 'Entrada para cine con palomitas incluidas',
    coste: 100,
    categoria: 'entretenimiento',
    icono: '🎬',
    disponible: true,
    popularidad: 3
  },
  {
    id: 'rec-06',
    titulo: 'Clase de Yoga Privada',
    descripcion: 'Sesión personalizada de yoga con instructor',
    coste: 200,
    categoria: 'bienestar',
    icono: '🧘‍♀️',
    disponible: true,
    popularidad: 4
  },
  {
    id: 'rec-07',
    titulo: 'Parking Premium',
    descripcion: 'Plaza de parking reservada por un mes',
    coste: 180,
    categoria: 'comodidad',
    icono: '🚗',
    disponible: true,
    popularidad: 3
  },
  {
    id: 'rec-08',
    titulo: 'Kit de Productos Saludables',
    descripcion: 'Cesta con snacks saludables y bebidas naturales',
    coste: 120,
    categoria: 'salud',
    icono: '🥗',
    disponible: true,
    popularidad: 3
  },
  {
    id: 'rec-09',
    titulo: 'Medio Día Libre',
    descripcion: 'Salir 4 horas antes un día a tu elección',
    coste: 250,
    categoria: 'tiempo',
    icono: '⏰',
    disponible: true,
    popularidad: 5
  },
  {
    id: 'rec-10',
    titulo: 'Suscripción Spotify Premium',
    descripcion: '3 meses de Spotify Premium',
    coste: 90,
    categoria: 'entretenimiento',
    icono: '🎵',
    disponible: true,
    popularidad: 4
  }
];

// Historial de canjes por usuario
let historialCanjes = {};

// Función para obtener todas las recompensas
export const getRecompensas = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      // Ordenar por popularidad y luego por coste
      const catalogoOrdenado = [...catalogo].sort((a, b) => {
        if (a.popularidad !== b.popularidad) {
          return b.popularidad - a.popularidad;
        }
        return a.coste - b.coste;
      });
      resolve(catalogoOrdenado);
    }, 300);
  });
};

// Función para obtener recompensas por categoría
export const getRecompensasPorCategoria = (categoria) => {
  return new Promise(resolve => {
    setTimeout(() => {
      const recompensasFiltradas = catalogo.filter(r => r.categoria === categoria);
      resolve(recompensasFiltradas);
    }, 200);
  });
};

// Función para canjear una recompensa
export const canjearRecompensa = async (usuarioId, recompensaId) => {
  return new Promise(async (resolve, reject) => {
    setTimeout(async () => {
      try {
        // Buscar la recompensa
        const recompensa = catalogo.find(r => r.id === recompensaId);
        if (!recompensa) {
          reject(new Error('Recompensa no encontrada'));
          return;
        }

        if (!recompensa.disponible) {
          reject(new Error('Esta recompensa no está disponible actualmente'));
          return;
        }

        // Verificar puntos del usuario
        const puntosActuales = await getPuntos(usuarioId);
        if (puntosActuales < recompensa.coste) {
          reject(new Error(`Puntos insuficientes. Necesitas ${recompensa.coste} puntos, tienes ${puntosActuales}`));
          return;
        }

        // Restar los puntos (cantidad negativa)
        await addPuntos(usuarioId, -recompensa.coste, `Canje: ${recompensa.titulo}`);

        // Registrar el canje
        const canje = {
          id: Date.now(),
          usuarioId,
          recompensaId,
          recompensaTitulo: recompensa.titulo,
          coste: recompensa.coste,
          fecha: new Date().toISOString(),
          estado: 'procesando' // procesando, completado, cancelado
        };

        if (!historialCanjes[usuarioId]) {
          historialCanjes[usuarioId] = [];
        }
        historialCanjes[usuarioId].unshift(canje);

        console.log(`Canje exitoso: ${recompensa.titulo} por ${recompensa.coste} puntos`);
        
        resolve({
          success: true,
          canje,
          puntosRestantes: puntosActuales - recompensa.coste,
          mensaje: `¡Has canjeado "${recompensa.titulo}" por ${recompensa.coste} puntos!`
        });

      } catch (error) {
        console.error('Error en canje:', error);
        reject(error);
      }
    }, 800); // Simular tiempo de procesamiento
  });
};

// Función para obtener el historial de canjes de un usuario
export const getHistorialCanjes = (usuarioId) => {
  return new Promise(resolve => {
    setTimeout(() => {
      const historial = historialCanjes[usuarioId] || [];
      resolve(historial);
    }, 200);
  });
};

// Función para obtener estadísticas de canjes
export const getEstadisticasCanjes = (usuarioId) => {
  return new Promise(resolve => {
    setTimeout(() => {
      const historial = historialCanjes[usuarioId] || [];
      const totalCanjes = historial.length;
      const puntosGastados = historial.reduce((total, canje) => total + canje.coste, 0);
      const categoriasFavoritas = {};
      
      historial.forEach(canje => {
        const recompensa = catalogo.find(r => r.id === canje.recompensaId);
        if (recompensa) {
          categoriasFavoritas[recompensa.categoria] = (categoriasFavoritas[recompensa.categoria] || 0) + 1;
        }
      });

      resolve({
        totalCanjes,
        puntosGastados,
        categoriasFavoritas,
        ultimoCanje: historial[0] || null
      });
    }, 300);
  });
};

// Función para resetear canjes (útil para la demo)
export const resetCanjes = () => {
  historialCanjes = {};
  console.log('Historial de canjes reseteado');
  return historialCanjes;
};

// Constantes para categorías
export const CATEGORIAS_RECOMPENSAS = {
  tiempo: { nombre: 'Tiempo Libre', icono: '⏰', color: 'blue' },
  bienestar: { nombre: 'Bienestar', icono: '💆‍♀️', color: 'green' },
  gastronomia: { nombre: 'Gastronomía', icono: '🍽️', color: 'orange' },
  compras: { nombre: 'Compras', icono: '🎁', color: 'purple' },
  entretenimiento: { nombre: 'Entretenimiento', icono: '🎬', color: 'red' },
  comodidad: { nombre: 'Comodidad', icono: '🚗', color: 'gray' },
  salud: { nombre: 'Salud', icono: '🥗', color: 'emerald' }
};