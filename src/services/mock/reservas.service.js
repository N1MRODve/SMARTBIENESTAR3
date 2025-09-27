// /src/services/mock/reservas.service.js
import { ref } from 'vue';

// Simulamos una tabla de reservas en la base de datos
const misReservasDb = ref([]);

export const getMisReservasAPI = async (empleadoId) => {
  console.log(`API MOCK: Obteniendo reservas para ${empleadoId}`);
  return new Promise(resolve => resolve([...misReservasDb.value]));
};

export const crearReservaAPI = async (empleadoId, sesion) => {
  console.log(`API MOCK: Creando reserva para ${empleadoId} en la sesión ${sesion.id}`);
  const nuevaReserva = {
    id: `res-${Date.now()}`,
    empleadoId,
    sesionInfo: sesion
  };
  misReservasDb.value.push(nuevaReserva);
  return new Promise(resolve => resolve({ success: true, reserva: nuevaReserva }));
};