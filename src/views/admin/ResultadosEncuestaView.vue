<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Card from '@/components/ui/Card.vue';
import Button from '@/components/ui/Button.vue';
// Asumimos que estos servicios y componentes ya existen
// import { getSurveyResultsById } from '@/services/mock/encuestas.service.js';
// import SurveyChart from '@/components/admin/charts/SurveyChart.vue';

// --- Inicialización ---
const route = useRoute();
const router = useRouter();
const encuesta = ref(null);
const isLoading = ref(true);

// --- Simulación de Datos de una Encuesta Específica ---
const simularDatosEncuesta = () => {
  return {
    id: route.params.id,
    titulo: 'Encuesta de Pulso de Bienestar (Q3)',
    preguntas: [
      { 
        id: 'p1', 
        texto: '¿Cómo calificarías tu nivel de estrés esta semana?',
        resultados: { labels: ['Bajo', 'Medio', 'Alto'], data: [25, 45, 30] },
        insight: 'El 30% del equipo reporta un nivel de estrés alto.',
        recomendacion: {
          id: 'serv-01',
          titulo: 'Taller de Mindfulness y Gestión del Estrés',
          descripcion: 'Ideal para dar herramientas contra el estrés.'
        }
      },
      {
        id: 'p2',
        texto: '¿Sientes que tienes las herramientas adecuadas?',
        resultados: { labels: ['Sí', 'No'], data: [85, 15] },
        insight: 'La mayoría se siente equipada para su trabajo.',
        recomendacion: null
      }
    ]
  };
};

onMounted(() => {
  isLoading.value = true;
  // const resultados = await getSurveyResultsById(route.params.id);
  encuesta.value = simularDatosEncuesta();
  isLoading.value = false;
});

const handleSolicitarServicio = (servicioId) => {
  router.push(`/admin/servicios/${servicioId}`);
};
</script>

<template>
  <div v-if="isLoading" class="text-center py-12">
    <p>Cargando resultados de la encuesta...</p>
  </div>

  <div v-else-if="encuesta" class="space-y-6">
    <header>
      <h1 class="text-3xl font-bold text-on-background">Resultados: {{ encuesta.titulo }}</h1>
      <p class="text-on-surface-variant">Analiza los resultados, obtén recomendaciones y actúa.</p>
    </header>

    <div v-for="pregunta in encuesta.preguntas" :key="pregunta.id">
      <Card>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 divide-x-0 lg:divide-x divide-surface-variant">
          
          <div class="lg:pr-6">
            <h3 class="font-semibold text-on-surface mb-4">{{ pregunta.texto }}</h3>
            <div class="p-4 bg-background rounded-lg">Gráfico de resultados para esta pregunta.</div>
          </div>
          
          <div class="lg:px-6">
            <h3 class="font-semibold text-on-surface mb-4">Análisis del Resultado</h3>
            <div class="p-4 bg-yellow-100 text-yellow-800 rounded-lg">
              <p><strong>Insight:</strong> {{ pregunta.insight }}</p>
            </div>
          </div>

          <div class="lg:pl-6">
            <h3 class="font-semibold text-on-surface mb-4">Acción Recomendada</h3>
            <div v-if="pregunta.recomendacion" class="p-4 bg-primary/10 rounded-lg h-full flex flex-col justify-between">
              <div>
                <p class="font-bold text-primary-dark">{{ pregunta.recomendacion.titulo }}</p>
                <p class="text-sm text-on-surface-variant mt-1">{{ pregunta.recomendacion.descripcion }}</p>
              </div>
              <div class="text-right mt-4">
                <Button @click="handleSolicitarServicio(pregunta.recomendacion.id)" variant="primary">
                  Pedir este Servicio
                </Button>
              </div>
            </div>
            <div v-else class="p-4 text-center text-on-surface-variant bg-background rounded-lg h-full flex items-center justify-center">
              <p>¡Todo en orden! No se requiere acción inmediata.</p>
            </div>
          </div>

        </div>
      </Card>
    </div>
  </div>
</template>