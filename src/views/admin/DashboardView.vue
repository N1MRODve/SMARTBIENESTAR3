<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Card from '@/components/ui/Card.vue';
import Button from '@/components/ui/Button.vue';
import SubScoreCard from '@/components/admin/SubScoreCard.vue';
import ScoreGauge from '@/components/admin/ScoreGauge.vue';
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

// Función para calcular el color dinámico basado en el score
const getWellnessScoreColor = (score) => {
  // Normalizar el score entre 0 y 1
  const normalizedScore = Math.max(0, Math.min(10, score)) / 10;
  
  // Definir los puntos de color en el espectro rojo-amarillo-verde
  if (normalizedScore <= 0.5) {
    // De rojo (0) a amarillo (0.5)
    const ratio = normalizedScore * 2; // 0 a 1
    const red = 255;
    const green = Math.round(255 * ratio);
    const blue = 0;
    return `rgb(${red}, ${green}, ${blue})`;
  } else {
    // De amarillo (0.5) a verde (1)
    const ratio = (normalizedScore - 0.5) * 2; // 0 a 1
    const red = Math.round(255 * (1 - ratio));
    const green = 255;
    const blue = 0;
    return `rgb(${red}, ${green}, ${blue})`;
  }
};
</script>

<template>
  <div v-if="isLoading" class="text-center py-12">
    <p>Calculando métricas de bienestar...</p>
  </div>

  <div v-else-if="summary" class="space-y-8">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Wellness Score Gauge -->
      <div class="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-center">
        <ScoreGauge
          :score="summary.wellnessScore"
          title="Índice de Bienestar General"
          description="Puntuación global basada en todas las métricas de bienestar del equipo"
          :trend="0.3"
        />
      </div>
      
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