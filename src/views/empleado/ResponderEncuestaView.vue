<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <Header subtitulo="Responder Encuesta de Bienestar" />
    
    <!-- Main Content -->
    <div class="py-8">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Encuesta de Pulso</h1>
        <p class="text-lg text-gray-600">Tu opinión es importante para mejorar nuestro ambiente laboral</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading && !encuestaActiva" class="bg-white rounded-lg shadow-sm p-8 text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent mx-auto mb-4"></div>
        <p class="text-gray-600">Cargando encuesta...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <AlertCircle class="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-red-800 mb-2">Error al cargar la encuesta</h3>
        <p class="text-red-600 mb-4">{{ error }}</p>
        <Button @click="cargarEncuesta" variant="outline">
          <RefreshCw class="h-4 w-4 mr-2" />
          Reintentar
        </Button>
      </div>

      <!-- Encuesta Form -->
      <div v-else-if="encuestaActiva" class="bg-white rounded-lg shadow-sm overflow-hidden">
        <!-- Encuesta Header -->
        <div class="bg-primary text-white p-6">
          <h2 class="text-2xl font-semibold">{{ encuestaActiva.titulo }}</h2>
          <p class="mt-2 text-primary-light">{{ encuestaActiva.preguntas.length }} preguntas</p>
        </div>

        <!-- Form -->
        <form @submit.prevent="enviarEncuesta" class="p-6 space-y-8">
          <!-- Preguntas -->
          <div v-for="(pregunta, index) in encuestaActiva.preguntas" :key="pregunta.id" class="space-y-4">
            <div class="border-l-4 border-primary pl-4">
              <h3 class="text-lg font-medium text-gray-900 mb-4">
                {{ index + 1 }}. {{ pregunta.texto }}
              </h3>

              <!-- Pregunta Opción Multiple -->
              <div v-if="pregunta.tipo === 'opcion_multiple'" class="space-y-3">
                <div 
                  v-for="opcion in pregunta.opciones" 
                  :key="opcion"
                  class="flex items-center"
                >
                  <input
                    :id="`pregunta_${pregunta.id}_${opcion}`"
                    v-model="respuestas[pregunta.id]"
                    :value="opcion"
                    type="radio"
                    :name="`pregunta_${pregunta.id}`"
                    class="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                    required
                  />
                  <label 
                    :for="`pregunta_${pregunta.id}_${opcion}`"
                    class="ml-3 text-gray-700 cursor-pointer hover:text-gray-900"
                  >
                    {{ opcion }}
                  </label>
                </div>
              </div>

              <!-- Pregunta Sí/No -->
              <div v-else-if="pregunta.tipo === 'si_no'" class="space-y-3">
                <div class="flex items-center">
                  <input
                    :id="`pregunta_${pregunta.id}_si`"
                    v-model="respuestas[pregunta.id]"
                    value="Sí"
                    type="radio"
                    :name="`pregunta_${pregunta.id}`"
                    class="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                    required
                  />
                  <label 
                    :for="`pregunta_${pregunta.id}_si`"
                    class="ml-3 text-gray-700 cursor-pointer hover:text-gray-900"
                  >
                    Sí
                  </label>
                </div>
                <div class="flex items-center">
                  <input
                    :id="`pregunta_${pregunta.id}_no`"
                    v-model="respuestas[pregunta.id]"
                    value="No"
                    type="radio"
                    :name="`pregunta_${pregunta.id}`"
                    class="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                    required
                  />
                  <label 
                    :for="`pregunta_${pregunta.id}_no`"
                    class="ml-3 text-gray-700 cursor-pointer hover:text-gray-900"
                  >
                    No
                  </label>
                </div>
              </div>

              <!-- Pregunta Escala 1-5 -->
              <div v-else-if="pregunta.tipo === 'escala_1_5'" class="space-y-4">
                <div class="flex items-center justify-between text-sm text-gray-500 mb-2">
                  <span>Muy insatisfecho</span>
                  <span>Muy satisfecho</span>
                </div>
                <div class="flex items-center justify-between">
                  <div 
                    v-for="valor in [1, 2, 3, 4, 5]" 
                    :key="valor"
                    class="flex flex-col items-center"
                  >
                    <input
                      :id="`pregunta_${pregunta.id}_${valor}`"
                      v-model="respuestas[pregunta.id]"
                      :value="valor"
                      type="radio"
                      :name="`pregunta_${pregunta.id}`"
                      class="h-5 w-5 text-primary focus:ring-primary border-gray-300"
                      required
                    />
                    <label 
                      :for="`pregunta_${pregunta.id}_${valor}`"
                      class="mt-2 text-sm font-medium text-gray-700 cursor-pointer hover:text-gray-900"
                    >
                      {{ valor }}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="pt-6 border-t border-gray-200">
            <div class="flex justify-end space-x-4">
              <Button 
                type="button" 
                variant="outline"
                @click="limpiarRespuestas"
                :disabled="loading"
              >
                <RotateCcw class="h-4 w-4 mr-2" />
                Limpiar
              </Button>
              <Button 
                type="submit" 
                :loading="loading"
                :disabled="!todasLasPreguntasRespondidas"
              >
                <Send class="h-4 w-4 mr-2" />
                Enviar Respuestas
              </Button>
            </div>
          </div>
        </form>
      </div>

      <!-- Success State -->
      <div v-if="encuestaEnviada" class="bg-green-50 border border-green-200 rounded-lg p-8 text-center mt-6">
        <CheckCircle class="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h3 class="text-xl font-semibold text-green-800 mb-2">¡Gracias por tu participación!</h3>
        <p class="text-green-600 mb-4">Tus respuestas han sido enviadas correctamente.</p>
        <Button @click="resetearEncuesta" variant="outline">
          Responder otra vez
        </Button>
      </div>
    </div>
  </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useEncuestasStore } from '@/stores/encuestas.store';
import Button from '@/components/ui/Button.vue';
import Header from '@/components/common/Header.vue';
import { 
  AlertCircle, 
  RefreshCw, 
  Send, 
  RotateCcw, 
  CheckCircle 
} from 'lucide-vue-next';

const toast = useToast();
const encuestasStore = useEncuestasStore();

// Estados reactivos
const respuestas = ref({});
const encuestaEnviada = ref(false);

// Computed properties
const { encuestaActiva, loading, error } = encuestasStore;

const todasLasPreguntasRespondidas = computed(() => {
  if (!encuestaActiva || !encuestaActiva.preguntas) return false;
  
  return encuestaActiva.preguntas.every(pregunta => {
    const respuesta = respuestas.value[pregunta.id];
    return respuesta !== undefined && respuesta !== null && respuesta !== '';
  });
});

// Métodos
const cargarEncuesta = async () => {
  await encuestasStore.cargarEncuestaActiva();
};

const limpiarRespuestas = () => {
  respuestas.value = {};
  toast.add({
    severity: 'info',
    summary: 'Respuestas limpiadas',
    detail: 'Puedes volver a responder la encuesta',
    life: 3000
  });
};

const enviarEncuesta = async () => {
  try {
    await encuestasStore.enviarRespuestas(respuestas.value);
    
    encuestaEnviada.value = true;
    
    toast.add({
      severity: 'success',
      summary: '¡Encuesta enviada!',
      detail: 'Gracias por tu participación',
      life: 5000
    });
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error al enviar',
      detail: error.message || 'No se pudo enviar la encuesta',
      life: 5000
    });
  }
};

const resetearEncuesta = () => {
  encuestaEnviada.value = false;
  respuestas.value = {};
  cargarEncuesta();
};

// Lifecycle
onMounted(() => {
  cargarEncuesta();
});
</script>

<style scoped>
.text-primary-light {
  color: rgba(255, 255, 255, 0.8);
}
</style>