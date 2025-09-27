<template>
  <!-- Header con botón de logout -->
  <div class="bg-white shadow-sm border-b border-gray-200 mb-8">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo y título -->
        <div class="flex items-center">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900">
                SMART<span class="text-primary">Bienestar</span>
              </h1>
              <p class="text-xs text-gray-500">Portal del Empleado</p>
            </div>
          </div>
        </div>

        <!-- Botón Cerrar Sesión -->
        <button
          @click="handleLogout"
          :disabled="loggingOut"
          class="inline-flex items-center px-4 py-2 border border-red-300 rounded-lg text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg v-if="loggingOut" class="animate-spin -ml-1 mr-2 h-4 w-4 text-red-700" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
          </svg>
          <span class="hidden sm:inline">{{ loggingOut ? 'Cerrando...' : 'Cerrar Sesión' }}</span>
          <span class="sm:hidden">{{ loggingOut ? '...' : 'Salir' }}</span>
        </button>
      </div>
    </div>
  </div>

  <div class="py-8">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">
            {{ activeSurvey?.titulo || 'Encuesta de Pulso' }}
          </h1>
          <p class="text-lg text-gray-600">Tu opinión es importante para mejorar nuestro ambiente laboral</p>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading && !activeSurvey" class="bg-white rounded-lg shadow-sm p-8 text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent mx-auto mb-4"></div>
          <p class="text-gray-600">Cargando encuesta...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle class="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-red-800 mb-2">Error al cargar la encuesta</h3>
          <p class="text-red-600 mb-4">{{ error }}</p>
          <Button @click="fetchActiveSurvey" variant="outline">
            <RefreshCw class="h-4 w-4 mr-2" />
            Reintentar
          </Button>
        </div>

        <!-- Encuesta Form -->
        <div v-else-if="activeSurvey && !surveySubmitted" class="bg-white rounded-lg shadow-sm overflow-hidden">
          <!-- Encuesta Header -->
          <div class="bg-primary text-white p-6">
            <h2 class="text-2xl font-semibold">{{ activeSurvey.titulo }}</h2>
            <p class="mt-2 text-primary-light">{{ activeSurvey.preguntas.length }} preguntas</p>
          </div>

          <!-- Form -->
          <form @submit.prevent="handleSubmit" class="p-6 space-y-8">
            <!-- Preguntas -->
            <div v-for="(pregunta, index) in activeSurvey.preguntas" :key="pregunta.id" class="space-y-4">
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
                      v-model="userAnswers[pregunta.id]"
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
                      v-model="userAnswers[pregunta.id]"
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
                      v-model="userAnswers[pregunta.id]"
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
                        v-model="userAnswers[pregunta.id]"
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

                <!-- Pregunta Texto Abierto -->
                <div v-else-if="pregunta.tipo === 'texto_abierto'" class="space-y-4">
                  <textarea
                    :id="`pregunta_${pregunta.id}_texto`"
                    v-model="userAnswers[pregunta.id]"
                    :name="`pregunta_${pregunta.id}`"
                    rows="4"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
                    placeholder="Comparte tus pensamientos, sugerencias o comentarios..."
                    :disabled="loading"
                  ></textarea>
                  <div class="flex items-center text-sm text-green-600 bg-green-50 p-3 rounded-lg border border-green-200">
                    <svg class="h-5 w-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.5-2a8.5 8.5 0 11-17 0 8.5 8.5 0 0117 0z"></path>
                    </svg>
                    <span class="font-medium">Tu respuesta a esta pregunta es 100% anónima</span>
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
                  :disabled="isLoading"
                >
                  <RotateCcw class="h-4 w-4 mr-2" />
                  Limpiar
                </Button>
                <Button 
                  type="submit" 
                  :loading="isLoading"
                  :disabled="!allQuestionsAnswered"
                >
                  <Send class="h-4 w-4 mr-2" />
                  Enviar Respuestas
                </Button>
              </div>
            </div>
          </form>
        </div>

        <!-- Success State -->
        <div v-if="surveySubmitted" class="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
          <CheckCircle class="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 class="text-xl font-semibold text-green-800 mb-2">¡Gracias por tu participación!</h3>
          <p class="text-green-600 mb-4">Tus respuestas han sido enviadas correctamente.</p>
          <Button @click="resetearEncuesta" variant="outline">
            Responder otra vez
          </Button>
        </div>

        <!-- Sección de Comunicados -->
        <div v-if="comunicados.length > 0" class="mt-12">
          <div class="mb-6">
            <div class="flex items-center">
              <Megaphone class="h-6 w-6 text-primary mr-3" />
              <h2 class="text-2xl font-bold text-gray-900">Últimos Comunicados</h2>
            </div>
            <p class="mt-2 text-gray-600">
              Mantente informado sobre las mejoras implementadas en base a tu feedback
            </p>
          </div>

          <!-- Loading State para Comunicados -->
          <div v-if="comunicadosLoading" class="bg-white rounded-lg shadow-sm p-8 text-center">
            <div class="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto mb-4"></div>
            <p class="text-gray-600">Cargando comunicados...</p>
          </div>

          <!-- Lista de Comunicados -->
          <div v-else class="space-y-6">
            <ComunicadoCard 
              v-for="comunicado in comunicados.slice(0, 3)" 
              :key="comunicado.id"
              :comunicado="comunicado"
            />
            
            <!-- Mostrar mensaje si hay más comunicados -->
            <div v-if="comunicados.length > 3" class="text-center">
              <p class="text-sm text-gray-500">
                Y {{ comunicados.length - 3 }} comunicado{{ comunicados.length - 3 !== 1 ? 's' : '' }} más...
              </p>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { storeToRefs } from 'pinia';
import { useEncuestasStore } from '@/stores/encuestas.store';
import { useComunicadosStore } from '@/stores/comunicados.store';
import { useAuthStore } from '@/stores/auth.store';
import ComunicadoCard from '@/components/empleado/ComunicadoCard.vue';
import { Megaphone } from 'lucide-vue-next';

const router = useRouter();
const toast = useToast();
const authStore = useAuthStore();

// --- Lógica del Store ---
const encuestasStore = useEncuestasStore();
const comunicadosStore = useComunicadosStore();
// 'storeToRefs' asegura que 'activeSurvey', 'isLoading', etc., sean reactivos.
const { activeSurvey, isLoading, error } = storeToRefs(encuestasStore);
const { comunicados, loading: comunicadosLoading } = storeToRefs(comunicadosStore);
const { fetchActiveSurvey, submitSurveyAnswers } = encuestasStore;
const { cargarComunicados } = comunicadosStore;

// --- Estado local del componente ---
const userAnswers = ref({});
const surveySubmitted = ref(false);
const loggingOut = ref(false);

// --- Cargar datos al montar el componente ---
onMounted(() => {
  if (!activeSurvey.value) {
    fetchActiveSurvey();
  }
  // Cargar comunicados
  cargarComunicados();
});

// --- Lógica de envío ---
const handleSubmit = async () => {
  if (!allQuestionsAnswered.value) return;
  await submitSurveyAnswers(activeSurvey.value.id, userAnswers.value);
  surveySubmitted.value = true;
};

// --- Propiedad computada para habilitar el botón de envío ---
const allQuestionsAnswered = computed(() => {
  if (!activeSurvey.value) return false;
  const totalPreguntas = activeSurvey.value.preguntas.length;
  const totalRespuestas = Object.keys(userAnswers.value).length;
  return totalPreguntas === totalRespuestas;
});

// --- Funciones auxiliares (para los botones del template) ---
const limpiarRespuestas = () => {
  userAnswers.value = {};
};

const resetearEncuesta = () => {
  limpiarRespuestas();
  surveySubmitted.value = false;
};

// --- Función para manejar el logout ---
const handleLogout = async () => {
  loggingOut.value = true;
  
  try {
    // Llamar a la acción logout del store
    await authStore.logout();
    
    // Mostrar mensaje de confirmación
    toast.add({
      severity: 'info',
      summary: 'Sesión cerrada',
      detail: 'Has cerrado sesión correctamente',
      life: 3000
    });
    
    // Redirigir a la página de login
    router.push('/login');
  } catch (error) {
    console.error('Error durante el logout:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudo cerrar la sesión',
      life: 4000
    });
  } finally {
    loggingOut.value = false;
  }
};
</script>

<style scoped>
.text-primary-light {
  color: rgba(255, 255, 255, 0.8);
}
</style>