<script setup>
import { ref, onMounted } from 'vue';
import Card from '@/components/ui/Card.vue';
import Button from '@/components/ui/Button.vue';
import SubScoreCard from '@/components/admin/SubScoreCard.vue'; // Importamos el nuevo componente
import { getAnalyticsSummary } from '@/services/mock/analytics.service.js'; // Importamos el nuevo servicio

// --- Estado Reactivo ---
const summary = ref(null);
const isLoading = ref(true);

// --- Carga de Datos ---
onMounted(async () => {
  isLoading.value = true;
  try {
    summary.value = await getAnalyticsSummary();
  } catch (error) {
    console.error("Error al cargar el resumen de analítica:", error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div v-if="isLoading" class="text-center py-12">
    <p>Calculando métricas de bienestar...</p>
  </div>

  <div v-else-if="summary" class="space-y-8">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <Card class="lg:col-span-1 h-full text-center flex flex-col justify-center">
        <template #header>
          <h2 class="text-xl font-semibold text-on-surface">Índice de Bienestar General</h2>
        </template>
        <p class="text-7xl font-bold text-primary my-4">{{ summary.wellnessScore }}</p>
        <p class="text-on-surface-variant">sobre 10</p>
      </Card>
      
      <Card class="lg:col-span-2 h-full">
        <template #header>
          <h2 class="text-xl font-semibold text-on-surface">Insights Clave</h2>
        </template>
        <div class="space-y-4">
          <div v-for="insight in summary.insights" :key="insight.text" 
               class="p-3 rounded-lg text-sm" 
               :class="insight.type === 'strength' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
            <p>{{ insight.text }}</p>
          </div>
          <div class="text-right pt-4">
            <Button variant="outline">Ver Análisis Completo</Button>
          </div>
        </div>
      </Card>
    </div>

    <Card>
      <template #header>
        <h2 class="text-xl font-semibold text-on-surface">Desglose del Índice por Dimensión</h2>
      </template>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SubScoreCard 
          v-for="score in summary.subScores" 
          :key="score.titulo"
          :titulo="score.titulo"
          :puntuacion="score.puntuacion"
        />
      </div>
    </Card>
  </div>

  <Card>
    <template #header>
      <h2 class="text-xl font-semibold text-on-surface">Acciones Rápidas</h2>
    </template>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <router-link to="/admin/encuestas/crear">
        <Button variant="outline" class="w-full h-full">Crear Encuesta</Button>
      </router-link>
      <router-link to="/admin/empleados">
        <Button variant="outline" class="w-full h-full">Gestionar Empleados</Button>
      </router-link>
      <router-link to="/admin/recompensas">
        <Button variant="outline" class="w-full h-full">Gestionar Recompensas</Button>
      </router-link>
      <router-link to="/admin/comunicados/crear">
        <Button variant="outline" class="w-full h-full">Crear Comunicado</Button>
      </router-link>
    </div>
  </Card>

  <div v-else class="text-center py-12">
    <p class="text-on-surface-variant">No hay suficientes datos para generar un análisis.</p>
  </div>
</template>