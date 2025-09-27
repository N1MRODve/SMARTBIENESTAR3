<script setup>
import { onMounted, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useReservasStore } from '@/stores/reservas.store.js';
import { useAuthStore } from '@/stores/auth.store.js';
import Card from '@/components/ui/Card.vue';
import Button from '@/components/ui/Button.vue';

// --- Inicialización ---
const reservasStore = useReservasStore();
const authStore = useAuthStore();
const { misReservas, isLoading } = storeToRefs(reservasStore);
const { user } = storeToRefs(authStore);

// --- Carga de Datos ---
onMounted(() => {
  if (user.value?.id) {
    reservasStore.fetchMisReservas(user.value.id);
  }
});

// --- Lógica de Cancelación (simulada) ---
const handleCancelar = (reservaId) => {
  if (confirm("¿Estás seguro de que quieres cancelar esta reserva?")) {
    alert("Reserva cancelada con éxito (simulación).");
    // Aquí iría la llamada al store para cancelar la reserva
  }
};
</script>

<template>
  <div class="space-y-6">
    <header>
      <h1 class="text-3xl font-bold text-on-background">Mis Reservas</h1>
      <p class="text-on-surface-variant">Aquí tienes el historial de todas tus sesiones y actividades.</p>
    </header>

    <div v-if="isLoading" class="text-center py-10">
      <p>Cargando tus reservas...</p>
    </div>

    <Card v-else-if="misReservas.length > 0">
      <ul class="divide-y divide-surface-variant">
        <li v-for="reserva in misReservas" :key="reserva.id" class="p-4 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <p class="font-semibold text-on-surface">{{ reserva.sesionInfo.titulo }}</p>
            <p class="text-sm text-on-surface-variant">
              {{ reserva.sesionInfo.fecha }} a las {{ reserva.sesionInfo.hora }} con {{ reserva.sesionInfo.especialista }}
            </p>
          </div>
          <Button variant="outline" class="mt-2 md:mt-0" @click="handleCancelar(reserva.id)">
            Cancelar Reserva
          </Button>
        </li>
      </ul>
    </Card>

    <div v-else class="text-center py-10 bg-surface rounded-xl">
      <p class="text-on-surface-variant">Aún no has realizado ninguna reserva.</p>
    </div>
  </div>
</template>