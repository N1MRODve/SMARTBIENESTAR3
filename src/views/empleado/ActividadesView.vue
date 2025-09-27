<script setup>
import { ref, onMounted, computed } from 'vue';
import Card from '@/components/ui/Card.vue';
import Button from '@/components/ui/Button.vue';
// Asumimos que estos servicios y stores ya existen y funcionan
import { useReservasStore } from '@/stores/reservas.store.js';
import { getSesiones } from '@/services/mock/sesiones.service.js';
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
    // Obtenemos todas las sesiones y las filtramos para el futuro
    const todasLasSesiones = await getSesiones();
    sesionesDisponibles.value = todasLasSesiones.filter(s => new Date(s.fecha) >= new Date());
  } catch (error) {
    console.error("Error al cargar las actividades:", error);
  } finally {
    isLoading.value = false;
  }
});

// --- Lógica de Reserva ---
const handleReservar = async (sesion) => {
  const userId = authStore.user?.id;
  if (!userId) return;

  const confirmacion = confirm(`¿Confirmas tu reserva para "${sesion.titulo}" el ${sesion.fecha}?`);
  if (confirmacion) {
    await reservasStore.crearReserva(userId, sesion);
    alert('¡Reserva confirmada con éxito!');
    // Idealmente, aquí se actualiza el estado de la sesión para mostrar que ya está reservada
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
          <h2 class="text-xl font-semibold text-on-surface">{{ sesion.titulo }}</h2>
        </template>
        
        <div class="space-y-2 text-on-surface-variant">
          <p><strong>Fecha:</strong> {{ sesion.fecha }}</p>
          <p><strong>Hora:</strong> {{ sesion.hora }}</p>
          <p><strong>Plazas disponibles:</strong> {{ sesion.plazasTotales - (sesion.participantes?.length || 0) }}</p>
        </div>

        <template #footer>
          <div class="text-right">
            <Button @click="handleReservar(sesion)" variant="primary">
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