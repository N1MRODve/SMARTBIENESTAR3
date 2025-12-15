// src/stores/sesiones.store.js
import { defineStore } from 'pinia';
import { ref } from 'vue';
// TODO: Implement real sesiones service with Supabase
// These functions should be implemented in @/services/servicios.service.js
// import {
//   getSesiones,
//   getSesionesByEmpleado,
//   getServiciosSolicitados,
//   addSesion,
//   reservarPlaza,
//   cancelarReserva,
//   getSesionById
// } from '@/services/servicios.service';

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
      const sesionesData = await getSesiones();
      sesiones.value = sesionesData;
    } catch (err) {
      error.value = err.message || 'Error al cargar las sesiones';
      console.error('Error cargando sesiones:', err);
    } finally {
      loading.value = false;
    }
  };

  const cargarServiciosSolicitados = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      const serviciosData = await getServiciosSolicitados();
      serviciosSolicitados.value = serviciosData;
    } catch (err) {
      error.value = err.message || 'Error al cargar los servicios solicitados';
      console.error('Error cargando servicios solicitados:', err);
    } finally {
      loading.value = false;
    }
  };

  const cargarSesionesEmpleado = async (empleadoId) => {
    loading.value = true;
    error.value = null;
    
    try {
      const sesionesData = await getSesionesByEmpleado(empleadoId);
      sesionesEmpleado.value = sesionesData;
    } catch (err) {
      error.value = err.message || 'Error al cargar las sesiones del empleado';
      console.error('Error cargando sesiones del empleado:', err);
    } finally {
      loading.value = false;
    }
  };

  const crearSesion = async (datosSesion) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await addSesion(datosSesion);
      
      if (response.success) {
        // Añadir la nueva sesión al estado local
        sesiones.value.push(response.sesion);
        
        console.log('Sesión creada exitosamente:', response.sesion);
        return { success: true, sesion: response.sesion };
      }
    } catch (err) {
      error.value = err.message || 'Error al crear la sesión';
      console.error('Error creando sesión:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const reservarPlazaSesion = async (sesionId, empleado) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await reservarPlaza(sesionId, empleado);
      
      if (response.success) {
        // Actualizar la sesión en el estado local
        const sesionIndex = sesiones.value.findIndex(s => s.id === parseInt(sesionId));
        if (sesionIndex !== -1) {
          sesiones.value[sesionIndex] = response.sesion;
        }
        
        console.log('Plaza reservada exitosamente');
        return { success: true, plazasDisponibles: response.plazasDisponibles };
      }
    } catch (err) {
      error.value = err.message || 'Error al reservar la plaza';
      console.error('Error reservando plaza:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const cancelarReservaSesion = async (sesionId, empleadoId) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await cancelarReserva(sesionId, empleadoId);
      
      if (response.success) {
        // Actualizar la sesión en el estado local
        const sesionIndex = sesiones.value.findIndex(s => s.id === parseInt(sesionId));
        if (sesionIndex !== -1) {
          sesiones.value[sesionIndex] = response.sesion;
        }
        
        console.log('Reserva cancelada exitosamente');
        return { success: true, plazasDisponibles: response.plazasDisponibles };
      }
    } catch (err) {
      error.value = err.message || 'Error al cancelar la reserva';
      console.error('Error cancelando reserva:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const cargarSesionPorId = async (id) => {
    loading.value = true;
    error.value = null;
    
    try {
      const sesion = await getSesionById(id);
      sesionSeleccionada.value = sesion;
    } catch (err) {
      error.value = err.message || 'Error al cargar la sesión';
      console.error('Error cargando sesión por ID:', err);
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