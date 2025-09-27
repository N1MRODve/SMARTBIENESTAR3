<script setup>
import { ref, onMounted } from 'vue';
import Card from '@/components/ui/Card.vue';
import Button from '@/components/ui/Button.vue';
// Importa todos los stores necesarios
import { useAuthStore } from '@/stores/auth.store.js';
import { useReservasStore } from '@/stores/reservas.store.js';
import { useGamificacionStore } from '@/stores/gamificacion.store.js';
import { useEncuestasStore } from '@/stores/encuestas.store.js';
import { useComunicadosStore } from '@/stores/comunicados.store.js';
import { storeToRefs } from 'pinia';

// Inicialización de stores
const authStore = useAuthStore();
const reservasStore = useReservasStore();
const gamificacionStore = useGamificacionStore();
const encuestasStore = useEncuestasStore();
const comunicadosStore = useComunicadosStore();

// Desestructuración reactiva del estado
const { user } = storeToRefs(authStore);
const { misReservas } = storeToRefs(reservasStore);
const { puntosUsuario: puntos } = storeToRefs(gamificacionStore);
const { activeSurvey } = storeToRefs(encuestasStore);
const { comunicados } = storeToRefs(comunicadosStore);

// Carga de datos
onMounted(() => {
  const userId = user.value?.id || 'user-empleado-01';
  if (userId) {
    reservasStore.fetchMisReservas(userId);
    gamificacionStore.cargarPuntos(userId);
    encuestasStore.fetchActiveSurvey();
    comunicadosStore.cargarComunicados();
  }
});
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold text-on-background">Hola, {{ user?.name || 'Empleado' }}</h1>
      <div class="bg-primary text-on-primary font-bold py-2 px-4 rounded-xl shadow-lg">
        <span>{{ puntos || 0 }} Puntos de Bienestar</span>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

      <div class="lg:col-span-2 space-y-6">
        <Card v-if="activeSurvey">
          <template #header>
            <h2 class="text-xl font-semibold text-on-surface">Tienes una encuesta pendiente</h2>
          </template>
          <div class="flex justify-between items-center">
            <p>{{ activeSurvey.titulo }}</p>
            <Button variant="primary">Responder Ahora</Button>
          </div>
        </Card>

        <Card>
          <template #header>
            <h2 class="text-xl font-semibold text-on-surface">Próximas Sesiones Reservadas</h2>
          </template>
          <div v-if="misReservas.length > 0" class="space-y-3">
            <div v-for="reserva in misReservas" :key="reserva.id" class="bg-background p-3 rounded-lg">
              <p class="font-bold">{{ reserva.sesionInfo.titulo }}</p>
              <p class="text-sm text-on-surface-variant">{{ reserva.sesionInfo.fecha }} a las {{ reserva.sesionInfo.hora }}</p>
            </div>
          </div>
          <p v-else class="text-on-surface-variant">No tienes próximas sesiones.</p>
        </Card>
      </div>

      <div class="space-y-6">
        <Card>
          <template #header>
            <h2 class="text-xl font-semibold text-on-surface">Últimos Comunicados</h2>
          </template>
          <div v-if="comunicados.length > 0" class="space-y-2">
            <p v-for="comunicado in comunicados.slice(0, 3)" :key="comunicado.id" class="text-sm p-2 bg-background rounded-md">
              {{ comunicado.titulo }}
            </p>
          </div>
          <p v-else class="text-on-surface-variant">No hay comunicados recientes.</p>
          <template #footer>
            <div class="text-right">
              <Button variant="text">Ver todos</Button>
            </div>
          </template>
        </Card>

        <Card>
          <template #header>
            <h2 class="text-xl font-semibold text-on-surface">Explorar</h2>
          </template>
          <div class="space-y-3">
            <Button variant="outline" class="w-full">Ver Actividades</Button>
            <Button variant="outline" class="w-full">Canjear Recompensas</Button>
            <Button variant="outline" class="w-full">Buscar Apoyo Profesional</Button>
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>