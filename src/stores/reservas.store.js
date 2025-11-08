import { defineStore } from 'pinia';
import { ref } from 'vue';
import { reservasService } from '@/services/servicios.service';

export const useReservasStore = defineStore('reservas', () => {
  // --- STATE ---
  const misReservas = ref([]);
  const isLoading = ref(false);

  // --- ACTIONS ---
  async function fetchMisReservas(empleadoId) {
    isLoading.value = true;
    try {
      misReservas.value = await getMisReservasAPI(empleadoId);
    } catch (error) {
      console.error("Error en el store al obtener reservas:", error);
    } finally {
      isLoading.value = false;
    }
  }

  async function crearReserva(empleadoId, sesion) {
    isLoading.value = true;
    try {
      const resultado = await crearReservaAPI(empleadoId, sesion);
      if (resultado.success) {
        // Si la reserva en el 'backend' fue exitosa, actualizamos el estado local.
        misReservas.value.push(resultado.reserva);
      }
    } catch (error) {
      console.error("Error en el store al crear reserva:", error);
    } finally {
      isLoading.value = false;
    }
  }

  return { misReservas, isLoading, fetchMisReservas, crearReserva };
});