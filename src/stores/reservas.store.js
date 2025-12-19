import { defineStore } from 'pinia';
import { ref } from 'vue';
import { reservasService } from '@/services/servicios.service';

export const useReservasStore = defineStore('reservas', () => {
  // --- STATE ---
  const misReservas = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  // --- ACTIONS ---
  async function fetchMisReservas(empleadoId) {
    if (!empleadoId) {
      console.warn('fetchMisReservas: empleadoId no proporcionado');
      return;
    }

    isLoading.value = true;
    error.value = null;

    try {
      const reservas = await reservasService.getByEmpleado(empleadoId);
      // Filtrar solo reservas futuras y activas
      misReservas.value = (reservas || []).filter(r =>
        r.sesion &&
        new Date(r.sesion.fecha_inicio) > new Date() &&
        ['confirmada', 'asistio'].includes(r.estado)
      );
    } catch (err) {
      error.value = err.message || 'Error al obtener reservas';
      console.error("Error en el store al obtener reservas:", err);
    } finally {
      isLoading.value = false;
    }
  }

  async function crearReserva(empleadoId, sesionId) {
    if (!empleadoId || !sesionId) {
      throw new Error('empleadoId y sesionId son requeridos');
    }

    isLoading.value = true;
    error.value = null;

    try {
      const reserva = await reservasService.crear(empleadoId, sesionId);
      misReservas.value.unshift(reserva);
      return { success: true, reserva };
    } catch (err) {
      error.value = err.message || 'Error al crear reserva';
      console.error("Error en el store al crear reserva:", err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function cancelarReserva(reservaId) {
    if (!reservaId) {
      throw new Error('reservaId es requerido');
    }

    isLoading.value = true;
    error.value = null;

    try {
      await reservasService.cancelar(reservaId);
      // Remover del array local
      misReservas.value = misReservas.value.filter(r => r.id !== reservaId);
      return { success: true };
    } catch (err) {
      error.value = err.message || 'Error al cancelar reserva';
      console.error("Error en el store al cancelar reserva:", err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  // Reset del store
  function reset() {
    misReservas.value = [];
    error.value = null;
  }

  return {
    misReservas,
    isLoading,
    error,
    fetchMisReservas,
    crearReserva,
    cancelarReserva,
    reset
  };
});
