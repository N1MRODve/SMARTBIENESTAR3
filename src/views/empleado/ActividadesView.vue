<script setup>
import { ref, onMounted, computed } from 'vue';
import Card from '@/components/ui/Card.vue';
import Button from '@/components/ui/Button.vue';
import { useReservasStore } from '@/stores/reservas.store.js';
import { sesionesService, reservasService } from '@/services/servicios.service.js';
import { useAuthStore } from '@/stores/auth.store.js';

// --- Inicialización ---
const reservasStore = useReservasStore();
const authStore = useAuthStore();

// --- Estado Reactivo ---
const sesionesDisponibles = ref([]);
const isLoading = ref(true);

// --- Carga de Datos ---
onMounted(async () => {
  isLoading.value = true;
  try {
    // Get upcoming sessions
    sesionesDisponibles.value = await sesionesService.getProximas();
  } catch (error) {
    console.error("Error al cargar las actividades:", error);
  } finally {
    isLoading.value = false;
  }
});

// --- Lógica de Reserva ---
const handleReservar = async (sesion) => {
  const empleadoId = authStore.empleado?.id;
  if (!empleadoId) {
    alert('Debes estar autenticado para reservar una actividad');
    return;
  }

  const fecha = new Date(sesion.fecha_inicio).toLocaleDateString('es-ES');
  const confirmacion = confirm(`¿Confirmas tu reserva para "${sesion.servicio?.nombre || 'Actividad'}" el ${fecha}?`);

  if (confirmacion) {
    try {
      await reservasService.crear(empleadoId, sesion.id);
      alert('¡Reserva confirmada con éxito!');
      // Refresh the sessions list
      sesionesDisponibles.value = await sesionesService.getProximas();
    } catch (error) {
      console.error('Error al crear reserva:', error);
      alert(error.message || 'Error al crear la reserva');
    }
  }
};
</script>

<template>
  <div class="space-y-6">
    <header>
      <h1 class="text-3xl font-bold text-on-background">Actividades de Bienestar</h1>
      <p class="text-on-surface-variant">Explora y reserva tu plaza en nuestras próximas sesiones.</p>
    </header>

    <div v-if="isLoading" class="text-center py-10">
      <p>Cargando actividades...</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card v-for="sesion in sesionesDisponibles" :key="sesion.id">
        <template #header>
          <h2 class="text-xl font-semibold text-on-surface">{{ sesion.servicio?.nombre || 'Actividad' }}</h2>
        </template>

        <div class="space-y-2 text-on-surface-variant">
          <p><strong>Fecha:</strong> {{ new Date(sesion.fecha_inicio).toLocaleDateString('es-ES') }}</p>
          <p><strong>Hora:</strong> {{ new Date(sesion.fecha_inicio).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) }}</p>
          <p><strong>Plazas disponibles:</strong> {{ sesion.cupo_disponible || 0 }}</p>
        </div>

        <template #footer>
          <div class="text-right">
            <Button
              @click="handleReservar(sesion)"
              variant="primary"
              :disabled="!sesion.cupo_disponible || sesion.cupo_disponible <= 0"
            >
              Reservar Plaza
            </Button>
          </div>
        </template>
      </Card>
    </div>
     <div v-if="!isLoading && sesionesDisponibles.length === 0" class="text-center py-10">
        <p class="text-on-surface-variant">No hay actividades programadas próximamente.</p>
    </div>
  </div>
</template>