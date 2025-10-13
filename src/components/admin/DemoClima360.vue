<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
    <div class="bg-white rounded-xl shadow-xl w-full max-w-4xl my-8">
      <div v-if="!mostrarResultados" class="p-8">
        <!-- Header -->
        <div class="mb-8">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h2 class="text-3xl font-bold text-gray-800">Clima360 Insight</h2>
              <p class="text-gray-600 mt-2">Diagnóstico integral del clima laboral y bienestar organizacional</p>
            </div>
            <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
              <X class="h-6 w-6" />
            </button>
          </div>
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p class="text-sm text-blue-800">
              <span class="font-semibold">Modo Demo:</span> Esta es una demostración de la plantilla Clima360 Insight.
              Responde las preguntas para ver cómo funciona el análisis automático.
            </p>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="mb-8">
          <div class="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progreso</span>
            <span>{{ Object.keys(respuestas).length }} / {{ totalPreguntas }}</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div
              class="bg-primary h-2 rounded-full transition-all duration-300"
              :style="{ width: `${(Object.keys(respuestas).length / totalPreguntas) * 100}%` }"
            ></div>
          </div>
        </div>

        <!-- Preguntas de Escala -->
        <div class="space-y-6 mb-8">
          <h3 class="text-xl font-semibold text-gray-800">Evaluación del Clima Laboral</h3>
          <p class="text-sm text-gray-600">Evalúa cada afirmación en una escala del 1 (Totalmente en desacuerdo) al 5 (Totalmente de acuerdo)</p>

          <div v-for="pregunta in preguntas" :key="pregunta.id" class="bg-gray-50 rounded-lg p-6">
            <p class="text-gray-800 font-medium mb-4">{{ pregunta.id }}. {{ pregunta.texto }}</p>
            <div class="flex items-center justify-between gap-2">
              <span class="text-xs text-gray-500 w-20">Totalmente en desacuerdo</span>
              <div class="flex gap-3 flex-1 justify-center">
                <label
                  v-for="valor in [1, 2, 3, 4, 5]"
                  :key="valor"
                  class="flex flex-col items-center cursor-pointer group"
                >
                  <input
                    type="radio"
                    :name="`pregunta-${pregunta.id}`"
                    :value="valor"
                    v-model="respuestas[pregunta.variable]"
                    class="hidden"
                  />
                  <div
                    :class="[
                      'w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-200',
                      respuestas[pregunta.variable] === valor
                        ? 'bg-primary border-primary text-white scale-110'
                        : 'border-gray-300 text-gray-600 hover:border-primary hover:scale-105'
                    ]"
                  >
                    <span class="font-semibold">{{ valor }}</span>
                  </div>
                </label>
              </div>
              <span class="text-xs text-gray-500 w-20 text-right">Totalmente de acuerdo</span>
            </div>
          </div>
        </div>

        <!-- Métricas Adicionales -->
        <div class="space-y-6 mb-8">
          <h3 class="text-xl font-semibold text-gray-800">Métricas Organizacionales</h3>

          <div v-for="metrica in metricas" :key="metrica.id" class="bg-gray-50 rounded-lg p-6">
            <p class="text-gray-800 font-medium mb-4">{{ metrica.texto }}</p>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
              <label
                v-for="(opcion, index) in metrica.opciones"
                :key="index"
                class="cursor-pointer"
              >
                <input
                  type="radio"
                  :name="`metrica-${metrica.id}`"
                  :value="metrica.valores[index]"
                  v-model="respuestasMetricas[metrica.id]"
                  class="hidden"
                />
                <div
                  :class="[
                    'p-4 rounded-lg border-2 text-center transition-all duration-200',
                    respuestasMetricas[metrica.id] === metrica.valores[index]
                      ? 'bg-primary border-primary text-white'
                      : 'border-gray-300 hover:border-primary'
                  ]"
                >
                  <span class="text-sm font-medium">{{ opcion }}</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        <!-- Botones de Acción -->
        <div class="flex justify-between items-center pt-6 border-t">
          <button
            @click="$emit('close')"
            class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            @click="calcularResultados"
            :disabled="!formularioCompleto"
            :class="[
              'px-6 py-2 rounded-lg font-medium transition-colors',
              formularioCompleto
                ? 'bg-primary text-white hover:bg-primary-dark'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            ]"
          >
            Ver Resultados del Diagnóstico
          </button>
        </div>
      </div>

      <!-- Resultados -->
      <DemoResultadosClima360
        v-else
        :resultados="resultadosCalculados"
        @close="$emit('close')"
        @volver="mostrarResultados = false"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { X } from 'lucide-vue-next';
import DemoResultadosClima360 from './DemoResultadosClima360.vue';

const emit = defineEmits(['close']);

// TODO: conectar con tabla "encuestas" y "respuestas_encuestas" cuando la BD esté activa.

const preguntas = [
  { id: 1, texto: 'La tasa de rotación está dentro de los estándares aceptables.', variable: 'rotacion' },
  { id: 2, texto: 'El absentismo no afecta significativamente la productividad.', variable: 'absentismo' },
  { id: 3, texto: 'Los empleados alcanzan consistentemente los objetivos de productividad establecidos.', variable: 'productividad' },
  { id: 4, texto: 'El liderazgo contribuye positivamente a la retención de talento.', variable: 'liderazgo' },
  { id: 5, texto: 'La comunicación interna es clara, transparente y efectiva.', variable: 'comunicacion' },
  { id: 6, texto: 'Ofrecemos oportunidades de desarrollo profesional y movilidad interna.', variable: 'desarrollo' },
  { id: 7, texto: 'Los empleados reciben reconocimiento oportuno y feedback constructivo.', variable: 'reconocimiento' },
  { id: 8, texto: 'Promovemos una cultura de bienestar y equilibrio vida-trabajo.', variable: 'bienestar' },
  { id: 9, texto: 'La empresa se adapta eficazmente a los cambios.', variable: 'adaptabilidad' },
  { id: 10, texto: 'Los empleados muestran sentido de pertenencia y compromiso.', variable: 'pertenencia' }
];

const metricas = [
  { id: 11, texto: 'Tasa de rotación anual', opciones: ['<5%', '5–10%', '11–15%', '>15%'], valores: [5, 4, 3, 1] },
  { id: 12, texto: 'Tasa de absentismo', opciones: ['Bajo', 'Medio', 'Alto'], valores: [5, 3, 1] },
  { id: 13, texto: 'Índice de productividad', opciones: ['Muy alta', 'Alta', 'Media', 'Baja', 'Muy baja'], valores: [5, 4, 3, 2, 1] }
];

const respuestas = ref({});
const respuestasMetricas = ref({});
const mostrarResultados = ref(false);
const resultadosCalculados = ref(null);

const totalPreguntas = computed(() => preguntas.length + metricas.length);

const formularioCompleto = computed(() => {
  const preguntasCompletas = preguntas.every(p => respuestas.value[p.variable] !== undefined);
  const metricasCompletas = metricas.every(m => respuestasMetricas.value[m.id] !== undefined);
  return preguntasCompletas && metricasCompletas;
});

const calcularResultados = () => {
  const total = Object.values(respuestas.value).reduce((sum, val) => sum + val, 0) +
                Object.values(respuestasMetricas.value).reduce((sum, val) => sum + val, 0);

  resultadosCalculados.value = {
    ...respuestas.value,
    metricas: respuestasMetricas.value,
    total
  };

  mostrarResultados.value = true;
};
</script>
