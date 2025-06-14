<script setup>
import { onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAdminStore } from '@/stores/admin';
import PageLoader from '@/components/ui/PageLoader.vue';
import Button from '@/components/ui/Button.vue';
// --- Importamos nuestro nuevo componente de gráfico ---
import SurveyChart from '@/components/admin/charts/SurveyChart.vue';

const route = useRoute();
const router = useRouter();
const adminStore = useAdminStore();

const encuestaId = route.params.id;

onMounted(() => {
  adminStore.loadResultadosEncuesta(encuestaId);
});

// --- Explicación de esta función ---
// Esta función auxiliar toma los resultados de una pregunta y los transforma
// al formato que la librería Chart.js necesita para poder dibujar el gráfico.
const prepareChartData = (resultados) => {
  const labels = resultados.map(r => `Valoración ${r.respuesta}`);
  const data = resultados.map(r => r.cantidad);
  
  return {
    labels: labels,
    datasets: [
      {
        label: 'Votos',
        data: data,
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };
};
</script>

<template>
  <div class="p-6 space-y-6">
    <Button variant="outline" @click="router.back()">
      &larr; Volver a Encuestas
    </Button>

    <div v-if="adminStore.loading">
      <PageLoader text="Cargando resultados..." />
    </div>

    <div v-else-if="adminStore.error" class="bg-red-100 text-red-700 p-4 rounded-lg">
      <p><strong>Error:</strong> {{ adminStore.error }}</p>
    </div>

    <div v-else-if="adminStore.resultadosEncuesta" class="space-y-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">
          Resultados: {{ adminStore.resultadosEncuesta.titulo_encuesta }}
        </h1>
        <p class="mt-1 text-lg text-gray-600">
          {{ adminStore.resultadosEncuesta.descripcion_encuesta }}
        </p>
      </div>

      <div 
        v-for="pregunta in adminStore.resultadosEncuesta.preguntas" 
        :key="pregunta.pregunta_id"
        class="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
      >
        <h3 class="text-xl font-semibold text-gray-800 mb-4">{{ pregunta.texto_pregunta }}</h3>
        
        <div v-if="pregunta.tipo_pregunta === 'escala' && pregunta.resultados.length > 0">
          <SurveyChart :chartData="prepareChartData(pregunta.resultados)" />
        </div>
        
        <ul v-else-if="pregunta.resultados.length > 0" class="space-y-2">
          <li 
            v-for="resultado in pregunta.resultados" 
            :key="resultado.respuesta"
            class="flex justify-between items-center text-gray-700 p-2 bg-gray-50 rounded-md"
          >
            <span>{{ resultado.respuesta }}</span>
            <span class="font-bold bg-gray-200 px-2 py-1 rounded">{{ resultado.cantidad }}</span>
          </li>
        </ul>

        <p v-else class="text-gray-500 text-center p-4">
          Aún no hay respuestas para esta pregunta.
        </p>
      </div>
    </div>
  </div>
</template>