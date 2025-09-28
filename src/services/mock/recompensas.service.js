// /src/services/mock/recompensas.service.js

import { ref } from 'vue';
import { getPuntos, addPuntos } from './gamificacion.service.js';

// Simula una tabla en la BD que guarda los canjes
const historialCanjes = ref([]);

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

// Historial de canjes por usuario (para vista individual)
let historialCanjesUsuario = {};

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
  const recompensa = catalogo.find(r => r.id === recompensaId);
  if (!recompensa) {
    return { success: false, message: 'La recompensa no existe.' };
  }

  const puntosActuales = await getPuntos(usuarioId);
  if (puntosActuales < recompensa.coste) {
    return { success: false, message: 'No tienes suficientes puntos.' };
  }

  const exito = await restarPuntos(usuarioId, recompensa.coste);
  if (exito) {
    // --- LÍNEAS NUEVAS ---
    // Añadimos el registro al historial
    historialCanjes.value.push({
      id: `canje-${Date.now()}`,
      usuarioId,
      recompensaId,
      recompensaTitulo: recompensa.titulo,
      coste: recompensa.coste,
      fecha: new Date().toISOString().slice(0, 10) // Guardamos la fecha del canje
    });
    // --- FIN LÍNEAS NUEVAS ---

    console.log(`Usuario ${usuarioId} ha canjeado "${recompensa.titulo}"`);
    return { success: true, message: '¡Recompensa canjeada con éxito!' };
  }

  return { success: false, message: 'Ha ocurrido un error al restar los puntos.' };
};

// Función para obtener el historial de canjes de un usuario
export const getHistorialCanjes = (usuarioId) => {
  return new Promise(resolve => {
    setTimeout(() => {
      // Si no se especifica usuarioId, devolver historial completo para admin
      if (!usuarioId) {
        return resolve([...historialCanjes.value]);
      }
      
      const historial = historialCanjesUsuario[usuarioId] || [];
      resolve(historial);
    }, 200);
  });
};

// Función para obtener el historial completo de canjes (para administrador)
export const getHistorialCanjesCompleto = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      // Ordenar por fecha descendente (más recientes primero)
      const historialOrdenado = [...historialCanjes.value].sort((a, b) => 
        new Date(b.fecha) - new Date(a.fecha)
      );
      resolve(historialOrdenado);
    }, 300);
  });
};

// Función para simular algunos canjes iniciales (para demo)
export const inicializarCanjesDemo = () => {
  const canjesDemo = [
    {
      id: 'canje-001',
      usuarioId: 'emp-001',
      nombreEmpleado: 'Ana García',
      emailEmpleado: 'ana.garcia@empresa.com',
      recompensaId: 'rec-02',
      recompensaTitulo: 'Almuerzo Premium',
      recompensaIcono: '🍽️',
      categoria: 'gastronomia',
      coste: 150,
      fechaCanje: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // Hace 2 días
      estado: 'completado'
    },
    {
      id: 'canje-002',
      usuarioId: 'emp-015',
      nombreEmpleado: 'Isabel Torres',
      emailEmpleado: 'isabel.torres@empresa.com',
      recompensaId: 'rec-05',
      recompensaTitulo: 'Entrada al Cine',
      recompensaIcono: '🎬',
      categoria: 'entretenimiento',
      coste: 100,
      fechaCanje: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // Hace 5 días
      estado: 'completado'
    },
    {
      id: 'canje-003',
      usuarioId: 'emp-022',
      nombreEmpleado: 'Sergio Delgado',
      emailEmpleado: 'sergio.delgado@empresa.com',
      recompensaId: 'rec-03',
      recompensaTitulo: 'Masaje Relajante',
      recompensaIcono: '💆‍♀️',
      categoria: 'bienestar',
      coste: 300,
      fechaCanje: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // Hace 1 día
      estado: 'completado'
    },
    {
      id: 'canje-004',
      usuarioId: 'emp-009',
      nombreEmpleado: 'Carmen Jiménez',
      emailEmpleado: 'carmen.jimenez@empresa.com',
      recompensaId: 'rec-09',
      recompensaTitulo: 'Medio Día Libre',
      recompensaIcono: '⏰',
      categoria: 'tiempo',
      coste: 250,
      fechaCanje: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // Hace 1 semana
      estado: 'completado'
    }
  ];
  
  historialCanjes.value = canjesDemo;
  console.log('Canjes demo inicializados:', canjesDemo.length);
  return canjesDemo;
};

// Inicializar canjes demo al cargar el módulo
inicializarCanjesDemo();
// Función para obtener estadísticas de canjes
export const getEstadisticasCanjes = (usuarioId) => {
  return new Promise(resolve => {
    setTimeout(() => {
      const historial = historialCanjesUsuario[usuarioId] || [];
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

// === FUNCIONES DE GESTIÓN PARA ADMINISTRADOR ===

// Función para añadir una nueva recompensa
export const addRecompensa = (nuevaRecompensa) => {
  return new Promise(resolve => {
    setTimeout(() => {
      const recompensa = {
        id: `rec-${Date.now()}`,
        titulo: nuevaRecompensa.titulo,
        descripcion: nuevaRecompensa.descripcion || '',
        coste: parseInt(nuevaRecompensa.coste),
        categoria: nuevaRecompensa.categoria || 'general',
        icono: nuevaRecompensa.icono || '🎁',
        disponible: nuevaRecompensa.disponible !== false,
        popularidad: nuevaRecompensa.popularidad || 3,
        fechaCreacion: new Date().toISOString()
      };
      
      catalogo.push(recompensa);
      console.log('Nueva recompensa añadida:', recompensa);
      console.log('Catálogo actualizado, total recompensas:', catalogo.length);
      resolve({ success: true, recompensa });
    }, 500);
  });
};

// Función para actualizar una recompensa existente
export const updateRecompensa = (recompensaActualizada) => {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('Actualizando recompensa con ID:', recompensaActualizada.id);
      console.log('Datos recibidos:', recompensaActualizada);
      
      const index = catalogo.findIndex(r => r.id === recompensaActualizada.id);
      
      if (index === -1) {
        console.error('Recompensa no encontrada para actualizar');
        resolve({ success: false, error: 'Recompensa no encontrada' });
        return;
      }
      
      // Actualizar la recompensa manteniendo algunos campos originales
      catalogo[index] = {
        ...catalogo[index],
        titulo: recompensaActualizada.titulo,
        descripcion: recompensaActualizada.descripcion,
        coste: parseInt(recompensaActualizada.coste),
        categoria: recompensaActualizada.categoria,
        icono: recompensaActualizada.icono,
        disponible: recompensaActualizada.disponible,
        popularidad: recompensaActualizada.popularidad || catalogo[index].popularidad,
        fechaActualizacion: new Date().toISOString()
      };
      
      console.log('Recompensa actualizada exitosamente:', catalogo[index]);
      console.log('Catálogo actualizado, total recompensas:', catalogo.length);
      resolve({ success: true, recompensa: catalogo[index] });
    }, 600);
  });
};

// Función para eliminar una recompensa
export const deleteRecompensa = (recompensaId) => {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('Eliminando recompensa con ID:', recompensaId);
      
      const index = catalogo.findIndex(r => r.id === recompensaId);
      
      if (index === -1) {
        console.error('Recompensa no encontrada para eliminar');
        resolve({ success: false, error: 'Recompensa no encontrada' });
        return;
      }
      
      const recompensaEliminada = catalogo[index];
      catalogo.splice(index, 1);
      
      console.log('Recompensa eliminada exitosamente:', recompensaEliminada.titulo);
      console.log('Catálogo actualizado, total recompensas:', catalogo.length);
      resolve({ success: true, recompensaEliminada });
    }, 400);
  });
};

// Función para resetear canjes (útil para la demo)
export const resetCanjes = () => {
  historialCanjesUsuario = {};
  historialCanjes.value = [];
  console.log('Historial de canjes reseteado');
  return historialCanjesUsuario;
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