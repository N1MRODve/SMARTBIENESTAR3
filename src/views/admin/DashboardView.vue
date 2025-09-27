<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Card from '@/components/ui/Card.vue';
import Button from '@/components/ui/Button.vue';
import SubScoreCard from '@/components/admin/SubScoreCard.vue';
import { getAnalyticsSummary } from '@/services/mock/analytics.service.js';

// --- Inicialización ---
const router = useRouter();
const summary = ref(null);
const isLoading = ref(true);

// --- Simulación de Recomendaciones ---
const recomendaciones = ref([
  { 
    id: 'serv-01', 
    titulo: 'Taller de Mindfulness y Gestión del Estrés', 
    descripcion: 'Recomendado para abordar la puntuación de Salud Mental.' 
  }
]);

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
            <Button @click="router.push('/admin/encuestas')" variant="outline">Ver Análisis Completo</Button>
          </div>
        </div>
      </Card>
    </div>

    <Card>
      <template #header>
        <h2 class="text-xl font-semibold text-on-surface">Desglose del Índice</h2>
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

    <Card>
        <template #header>
            <h2 class="text-xl font-semibold text-on-surface">Recomendaciones Accionables</h2>
        </template>
        <div v-for="rec in recomendaciones" :key="rec.id" class="p-4 bg-primary/10 rounded-lg">
            <h3 class="font-bold text-primary-dark">{{ rec.titulo }}</h3>
            <p class="text-sm text-on-surface-variant my-2">{{ rec.descripcion }}</p>
            <div class="text-right">
                <Button @click="router.push('/admin/servicios')" variant="primary">Ver Servicio</Button>
            </div>
        </div>
    </Card>

    <Card>
      <template #header>
        <h2 class="text-xl font-semibold text-on-surface">Acciones Rápidas</h2>
      </template>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button @click="router.push('/admin/encuestas/crear')" variant="outline" class="w-full h-full">Crear Encuesta</Button>
        <Button @click="router.push('/admin/empleados')" variant="outline" class="w-full h-full">Gestionar Empleados</Button>
        <Button @click="router.push('/admin/recompensas')" variant="outline" class="w-full h-full">Gestionar Recompensas</Button>
        <Button @click="router.push('/admin/comunicados/crear')" variant="outline" class="w-full h-full">Crear Comunicado</Button>
      </div>
    </Card>
  </div>

  <div v-else class="text-center py-12">
    <p class="text-on-surface-variant">No hay suficientes datos para generar un análisis.</p>
  </div>
</template>