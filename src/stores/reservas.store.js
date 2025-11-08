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

  async function crearReserva(sesion) {
    isLoading.value = true;
    try {
      const resultado = await reservasService.create(sesion);
      if (resultado.success) {
        misReservas.value.push(resultado.reserva);
      }
      return resultado;
    } catch (error) {
      console.error("Error en el store al crear reserva:", error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  return { misReservas, isLoading, fetchMisReservas, crearReserva };
});