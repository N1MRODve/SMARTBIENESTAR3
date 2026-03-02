// src/stores/sesiones.store.js
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { sesionesService, reservasService, solicitudesService } from '@/services/servicios.service';

export const useSesionesStore = defineStore('sesiones', () => {
  const sesiones = ref([]);
  const serviciosSolicitados = ref([]);
  const sesionesEmpleado = ref([]);
  const sesionSeleccionada = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const cargarSesiones = async () => {
    loading.value = true;
    error.value = null;

    try {
      const sesionesData = await sesionesService.getAll();
      sesiones.value = sesionesData || [];
    } catch (err) {
      error.value = err.message || 'Error al cargar las sesiones';
    } finally {
      loading.value = false;
    }
  };

  const cargarServiciosSolicitados = async () => {
    loading.value = true;
    error.value = null;

    try {
      const serviciosData = await solicitudesService.getAll();
      serviciosSolicitados.value = serviciosData || [];
    } catch (err) {
      error.value = err.message || 'Error al cargar los servicios solicitados';
    } finally {
      loading.value = false;
    }
  };

  const cargarSesionesEmpleado = async (empleadoId) => {
    loading.value = true;
    error.value = null;

    try {
      const reservas = await reservasService.getByEmpleado(empleadoId);
      sesionesEmpleado.value = reservas || [];
    } catch (err) {
      error.value = err.message || 'Error al cargar las sesiones del empleado';
    } finally {
      loading.value = false;
    }
  };

  const crearSesion = async (datosSesion) => {
    loading.value = true;
    error.value = null;

    try {
      const nuevaSesion = await sesionesService.create(datosSesion);
      sesiones.value.push(nuevaSesion);
      return { success: true, sesion: nuevaSesion };
    } catch (err) {
      error.value = err.message || 'Error al crear la sesión';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const reservarPlazaSesion = async (sesionId, empleadoId) => {
    loading.value = true;
    error.value = null;

    try {
      const reserva = await reservasService.crear(empleadoId, sesionId);

      // Actualizar cupo en estado local
      const sesionIndex = sesiones.value.findIndex(s => s.id === sesionId);
      if (sesionIndex !== -1 && sesiones.value[sesionIndex].cupo_disponible > 0) {
        sesiones.value[sesionIndex].cupo_disponible--;
      }

      return { success: true, reserva };
    } catch (err) {
      error.value = err.message || 'Error al reservar la plaza';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const cancelarReservaSesion = async (reservaId) => {
    loading.value = true;
    error.value = null;

    try {
      await reservasService.cancelar(reservaId);
      return { success: true };
    } catch (err) {
      error.value = err.message || 'Error al cancelar la reserva';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const cargarSesionPorId = async (id) => {
    loading.value = true;
    error.value = null;

    try {
      const sesion = await sesionesService.getById(id);
      sesionSeleccionada.value = sesion;
    } catch (err) {
      error.value = err.message || 'Error al cargar la sesión';
    } finally {
      loading.value = false;
    }
  };

  return {
    sesiones,
    serviciosSolicitados,
    sesionesEmpleado,
    sesionSeleccionada,
    loading,
    error,
    cargarSesiones,
    cargarServiciosSolicitados,
    cargarSesionesEmpleado,
    crearSesion,
    reservarPlazaSesion,
    cancelarReservaSesion,
    cargarSesionPorId
  };
});
