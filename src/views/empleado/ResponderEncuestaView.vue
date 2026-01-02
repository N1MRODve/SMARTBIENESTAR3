<script setup>
import { onMounted, ref, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useGamificacionStore } from '@/stores/gamificacion.store';
import { useAuthStore } from '@/stores/auth.store';
import { useEncuestasStore } from '@/stores/encuestas.store';
import { useToast } from '@/composables/useToast';
// Servicio multiempresa
import { empleadoEncuestasService } from '@/services/empleado.encuestas.service';
import {
  Shield,
  Lock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  RotateCcw,
  Send,
  FileText,
  Star,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Award,
  Clock,
  Sparkles,
  ArrowRight,
  Gift,
  Home
} from 'lucide-vue-next';

const router = useRouter();
const route = useRoute();
const { showSuccess, showError, showWarning } = useToast();
const authStore = useAuthStore();

// --- Stores ---
const gamificacionStore = useGamificacionStore();
const encuestasStore = useEncuestasStore();

const { puntosUsuario } = storeToRefs(gamificacionStore);
const { empleado, user } = storeToRefs(authStore);
const { cargarPuntos } = gamificacionStore;
const { fetchEncuestasPendientesEmpleado } = encuestasStore;

// --- Estado local para encuesta ---
const activeSurvey = ref(null);
const isLoading = ref(false);
const error = ref(null);

// --- Estado local ---
const userAnswers = ref({});
const surveySubmitted = ref(false);
const currentStep = ref(0); // 0 = intro, 1+ = preguntas
const showPrivacyDetails = ref(false);
const submitting = ref(false);
const puntosGanados = ref(0); // Puntos ganados al completar la encuesta

// --- Computed ---
const totalPreguntas = computed(() => activeSurvey.value?.preguntas?.length || 0);

const preguntaActual = computed(() => {
  if (currentStep.value === 0 || !activeSurvey.value?.preguntas) return null;
  return activeSurvey.value.preguntas[currentStep.value - 1];
});

const progreso = computed(() => {
  if (totalPreguntas.value === 0) return 0;
  const respondidas = Object.keys(userAnswers.value).length;
  return Math.round((respondidas / totalPreguntas.value) * 100);
});

const allQuestionsAnswered = computed(() => {
  if (!activeSurvey.value) return false;
  return totalPreguntas.value === Object.keys(userAnswers.value).length;
});

const puedeAvanzar = computed(() => {
  if (currentStep.value === 0) return true;
  if (!preguntaActual.value) return false;
  return userAnswers.value[preguntaActual.value.id] !== undefined;
});

const esUltimaPregunta = computed(() => {
  return currentStep.value === totalPreguntas.value;
});

// Nivel de privacidad con iconos y colores
const privacidadConfig = computed(() => {
  const nivel = activeSurvey.value?.privacidad_nivel || activeSurvey.value?.privacidadNivel || 'anonimato_completo';
  const configs = {
    'anonimato_completo': {
      icon: EyeOff,
      color: 'green',
      titulo: 'Anonimato Total',
      descripcion: 'Tus respuestas son completamente anónimas. Nadie, ni siquiera RRHH, puede identificar quién respondió qué.',
      detalles: [
        'No se guarda tu nombre ni email junto a las respuestas',
        'Los resultados se muestran solo como promedios generales',
        'Tu manager no tiene acceso a respuestas individuales',
        'La empresa solo ve tendencias agregadas'
      ]
    },
    'anonimato_parcial': {
      icon: Eye,
      color: 'blue',
      titulo: 'Anonimato por Equipo',
      descripcion: 'Tus respuestas se agrupan con las de tu equipo. Se mostrarán promedios por departamento.',
      detalles: [
        'Las respuestas se agrupan por departamento',
        'Se requiere mínimo 5 respuestas para mostrar resultados',
        'Tu nombre no aparece en ningún reporte',
        'Los managers ven solo tendencias de su equipo'
      ]
    },
    'identificado': {
      icon: Lock,
      color: 'amber',
      titulo: 'Respuestas Confidenciales',
      descripcion: 'Tus respuestas serán visibles solo para el equipo de RRHH autorizado.',
      detalles: [
        'Solo personal autorizado de RRHH puede ver respuestas',
        'Tu manager directo NO tiene acceso',
        'Se usa para dar seguimiento personalizado',
        'Puedes solicitar ver qué datos se guardan'
      ]
    }
  };
  return configs[nivel];
});

// --- Métodos ---
const comenzarEncuesta = () => {
  currentStep.value = 1;
};

const siguientePregunta = () => {
  if (esUltimaPregunta.value) {
    handleSubmit();
  } else {
    currentStep.value++;
  }
};

const preguntaAnterior = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
};

const irAPregunta = (index) => {
  currentStep.value = index + 1;
};

const handleSubmit = async () => {
  console.log('[handleSubmit] Iniciando envío...');
  console.log('[handleSubmit] allQuestionsAnswered:', allQuestionsAnswered.value);
  console.log('[handleSubmit] submitting:', submitting.value);
  console.log('[handleSubmit] userAnswers:', JSON.stringify(userAnswers.value));
  console.log('[handleSubmit] activeSurvey.id:', activeSurvey.value?.id);

  if (!allQuestionsAnswered.value || submitting.value) {
    console.warn('[handleSubmit] Abortando - condiciones no cumplidas');
    return;
  }

  submitting.value = true;

  try {
    // Formatear respuestas para el servicio
    const respuestasFormateadas = Object.entries(userAnswers.value).map(([preguntaId, respuesta]) => ({
      pregunta_id: preguntaId,
      respuesta
    }));

    console.log('[handleSubmit] Respuestas formateadas:', JSON.stringify(respuestasFormateadas));

    // Usar el nuevo servicio multiempresa
    const resultado = await empleadoEncuestasService.enviarRespuestas(
      activeSurvey.value.id,
      respuestasFormateadas
    );

    console.log('[handleSubmit] Resultado del servicio:', resultado);

    // Guardar puntos ganados para mostrar en la pantalla de éxito
    puntosGanados.value = resultado.puntos_ganados || 0;

    if (resultado.puntos_ganados) {
      showSuccess('¡Encuesta enviada!', `+${resultado.puntos_ganados} puntos por completar la encuesta`);
    } else {
      showSuccess('¡Encuesta enviada!', 'Tus respuestas han sido guardadas correctamente.');
    }

    surveySubmitted.value = true;

    // IMPORTANTE: Forzar refresh del estado global de encuestas
    // Esto actualiza el badge del menú y el dashboard
    console.log('[handleSubmit] Refrescando estado global de encuestas...');
    await fetchEncuestasPendientesEmpleado();

    // Recargar puntos usando auth_user_id (consistente con el layout)
    if (user.value?.id) {
      await cargarPuntos(user.value.id, true);
    }
  } catch (err) {
    console.error('[handleSubmit] Error al enviar encuesta:', err);

    if (err.isDuplicate || err.ya_respondida) {
      showWarning('Encuesta ya completada', 'Ya has respondido esta encuesta anteriormente.');
      surveySubmitted.value = true;
    } else {
      showError('Error al enviar', err.message || 'No se pudo enviar la encuesta. Intenta de nuevo.');
    }
  } finally {
    submitting.value = false;
  }
};

const limpiarRespuestas = () => {
  userAnswers.value = {};
  currentStep.value = 1;
};

const volverAlDashboard = () => {
  router.push('/empleado/dashboard');
};

const volverAEncuestas = () => {
  router.push('/empleado/encuestas');
};

// Cargar encuesta por ID de ruta o la primera pendiente
const cargarEncuesta = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    const encuestaId = route.params.id;

    if (encuestaId) {
      // Si hay ID en la URL, cargar esa encuesta específica
      const encuesta = await empleadoEncuestasService.getEncuestaParaResponder(encuestaId);
      activeSurvey.value = encuesta;
    } else {
      // Si no hay ID, obtener la primera encuesta pendiente
      const pendientes = await empleadoEncuestasService.getPendientes();
      if (pendientes && pendientes.length > 0) {
        const encuesta = await empleadoEncuestasService.getEncuestaParaResponder(pendientes[0].id);
        activeSurvey.value = encuesta;
      }
    }
  } catch (err) {
    console.error('Error cargando encuesta:', err);
    if (err.ya_respondida) {
      showWarning('Encuesta completada', 'Ya has respondido esta encuesta.');
      surveySubmitted.value = true;
    } else {
      error.value = err.message || 'Error al cargar la encuesta';
    }
  } finally {
    isLoading.value = false;
  }
};

// --- Lifecycle ---
onMounted(async () => {
  await cargarEncuesta();

  // Cargar puntos del empleado usando auth_user_id
  if (user.value?.id) {
    await cargarPuntos(user.value.id, true);
  }
});
</script>

<template>
  <div class="min-h-[calc(100vh-12rem)]">
    <!-- Loading State -->
    <div v-if="isLoading && !activeSurvey" class="flex flex-col items-center justify-center py-20">
      <div class="w-16 h-16 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mb-6"></div>
      <p class="text-gray-600 font-medium">Cargando encuesta...</p>
      <p class="text-gray-400 text-sm mt-1">Preparando tus preguntas</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="max-w-lg mx-auto">
      <div class="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle class="w-8 h-8 text-red-600" />
        </div>
        <h3 class="text-lg font-semibold text-red-800 mb-2">Error al cargar la encuesta</h3>
        <p class="text-red-600 mb-6">{{ error }}</p>
        <button
          @click="cargarEncuesta"
          class="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors"
        >
          <RefreshCw class="w-4 h-4" />
          Reintentar
        </button>
      </div>
    </div>

    <!-- No hay encuesta activa -->
    <div v-else-if="!activeSurvey && !isLoading" class="max-w-lg mx-auto">
      <div class="bg-white border border-gray-200 rounded-2xl p-8 text-center shadow-sm">
        <div class="w-20 h-20 bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <FileText class="w-10 h-10 text-teal-600" />
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">No hay encuestas pendientes</h3>
        <p class="text-gray-500 mb-6">
          ¡Estás al día! Te notificaremos cuando haya una nueva encuesta disponible para ti.
        </p>
        <div class="flex items-center justify-center gap-2 text-sm text-teal-600 bg-teal-50 rounded-lg px-4 py-3 mb-6">
          <Shield class="w-4 h-4" />
          <span>Tus respuestas siempre serán confidenciales</span>
        </div>
        <button
          @click="volverAlDashboard"
          class="text-teal-600 hover:text-teal-700 font-medium transition-colors"
        >
          ← Volver al inicio
        </button>
      </div>
    </div>

    <!-- Encuesta completada -->
    <div v-else-if="surveySubmitted" class="max-w-lg mx-auto">
      <div class="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-8 text-center shadow-lg overflow-hidden relative">
        <!-- Confetti decorativo -->
        <div class="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <div class="absolute top-4 left-8 w-3 h-3 bg-amber-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
          <div class="absolute top-8 right-12 w-2 h-2 bg-purple-400 rounded-full animate-bounce" style="animation-delay: 0.3s"></div>
          <div class="absolute top-16 left-16 w-2 h-2 bg-teal-400 rounded-full animate-bounce" style="animation-delay: 0.5s"></div>
          <div class="absolute top-6 right-24 w-3 h-3 bg-pink-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
        </div>

        <!-- Animación de éxito -->
        <div class="relative mb-6">
          <div class="w-28 h-28 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-xl animate-pulse-slow">
            <CheckCircle class="w-14 h-14 text-white" />
          </div>
          <!-- Badge de puntos ganados prominente -->
          <div v-if="puntosGanados > 0" class="absolute -top-3 -right-3 transform">
            <div class="bg-gradient-to-br from-amber-400 to-yellow-500 rounded-2xl px-4 py-2 shadow-lg animate-bounce">
              <div class="flex items-center gap-1">
                <Star class="w-5 h-5 text-amber-900 fill-amber-900" />
                <span class="text-amber-900 font-bold text-lg">+{{ puntosGanados }}</span>
              </div>
            </div>
          </div>
        </div>

        <h2 class="text-3xl font-bold text-green-800 mb-3">¡Encuesta completada!</h2>

        <!-- Mensaje de puntos ganados -->
        <div v-if="puntosGanados > 0" class="bg-gradient-to-r from-amber-100 to-yellow-100 border border-amber-300 rounded-xl p-4 mb-6">
          <p class="text-amber-800 font-semibold text-lg">
            Has ganado <span class="text-2xl font-bold text-amber-900">{{ puntosGanados }} puntos</span>
          </p>
          <p class="text-amber-700 text-sm mt-1">Ya se han sumado a tu cuenta</p>
        </div>

        <p class="text-green-700 mb-6">
          Tu opinión nos ayuda a mejorar el bienestar de todos en la empresa.
        </p>

        <!-- Balance total de puntos -->
        <div class="inline-flex items-center gap-3 bg-white px-5 py-3 rounded-2xl shadow-md mb-6 border border-gray-100">
          <div class="w-10 h-10 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl flex items-center justify-center">
            <Star class="w-5 h-5 text-amber-900 fill-amber-900" />
          </div>
          <div class="text-left">
            <p class="text-xs text-gray-500">Tu balance actual</p>
            <p class="text-xl font-bold text-gray-900">{{ puntosUsuario || 0 }} puntos</p>
          </div>
        </div>

        <!-- Mensaje de privacidad -->
        <div class="bg-white/60 rounded-xl p-4 mb-6">
          <div class="flex items-start gap-3">
            <Shield class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div class="text-left">
              <p class="text-sm font-medium text-green-800">Tus respuestas están protegidas</p>
              <p class="text-xs text-green-600 mt-1">
                Hemos registrado tu participación de forma anónima.
                Los resultados se comparten solo como tendencias generales.
              </p>
            </div>
          </div>
        </div>

        <!-- Botones de acción -->
        <div class="flex flex-col sm:flex-row gap-3">
          <button
            @click="volverAlDashboard"
            class="flex-1 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-teal-700 hover:to-emerald-700 transition-all shadow-lg shadow-teal-200 flex items-center justify-center gap-2"
          >
            <Home class="w-5 h-5" />
            Volver al inicio
          </button>
          <button
            @click="router.push('/empleado/recompensas')"
            class="flex-1 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-amber-900 font-semibold rounded-xl hover:from-amber-600 hover:to-yellow-600 transition-all shadow-lg shadow-amber-200 flex items-center justify-center gap-2"
          >
            <Gift class="w-5 h-5" />
            Ver recompensas
          </button>
        </div>
      </div>
    </div>

    <!-- Encuesta activa -->
    <div v-else-if="activeSurvey" class="max-w-2xl mx-auto">
      <!-- Pantalla de introducción -->
      <div v-if="currentStep === 0" class="space-y-6">
        <!-- Badge de recompensa prominente -->
        <div class="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 rounded-2xl p-4 shadow-lg">
          <div class="flex items-center justify-center gap-3">
            <div class="w-12 h-12 bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Star class="w-7 h-7 text-amber-900 fill-amber-900" />
            </div>
            <div class="text-center">
              <p class="text-amber-900/80 text-sm font-medium">Completa esta encuesta y gana</p>
              <p class="text-3xl font-bold text-amber-900">+{{ activeSurvey.puntos_base || activeSurvey.puntos_recompensa || 50 }} puntos</p>
            </div>
          </div>
        </div>

        <!-- Header de la encuesta -->
        <div class="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
          <div class="flex items-start gap-4">
            <div class="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
              <FileText class="w-7 h-7" />
            </div>
            <div>
              <h1 class="text-2xl font-bold mb-2">{{ activeSurvey.titulo }}</h1>
              <p class="text-white/80">{{ activeSurvey.descripcion || 'Tu opinión es importante para mejorar nuestro ambiente laboral' }}</p>
            </div>
          </div>

          <div class="flex items-center gap-6 mt-6 pt-6 border-t border-white/20">
            <div class="flex items-center gap-2">
              <FileText class="w-5 h-5 text-white/60" />
              <span>{{ totalPreguntas }} preguntas</span>
            </div>
            <div class="flex items-center gap-2">
              <Clock class="w-5 h-5 text-white/60" />
              <span>~{{ Math.ceil(totalPreguntas * 0.5) }} min</span>
            </div>
            <div class="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1">
              <Award class="w-5 h-5 text-amber-300" />
              <span class="font-semibold">+{{ activeSurvey.puntos_base || activeSurvey.puntos_recompensa || 50 }} pts</span>
            </div>
          </div>
        </div>

        <!-- Tarjeta de privacidad -->
        <div class="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <button
            @click="showPrivacyDetails = !showPrivacyDetails"
            class="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div class="flex items-center gap-4">
              <div
                class="w-12 h-12 rounded-xl flex items-center justify-center"
                :class="{
                  'bg-green-100': privacidadConfig.color === 'green',
                  'bg-blue-100': privacidadConfig.color === 'blue',
                  'bg-amber-100': privacidadConfig.color === 'amber'
                }"
              >
                <component
                  :is="privacidadConfig.icon"
                  class="w-6 h-6"
                  :class="{
                    'text-green-600': privacidadConfig.color === 'green',
                    'text-blue-600': privacidadConfig.color === 'blue',
                    'text-amber-600': privacidadConfig.color === 'amber'
                  }"
                />
              </div>
              <div class="text-left">
                <h3 class="font-semibold text-gray-900">{{ privacidadConfig.titulo }}</h3>
                <p class="text-sm text-gray-500">{{ privacidadConfig.descripcion }}</p>
              </div>
            </div>
            <ChevronRight
              class="w-5 h-5 text-gray-400 transition-transform"
              :class="{ 'rotate-90': showPrivacyDetails }"
            />
          </button>

          <!-- Detalles de privacidad expandidos -->
          <div v-if="showPrivacyDetails" class="px-6 pb-6 border-t border-gray-100">
            <div class="pt-4 space-y-3">
              <div
                v-for="(detalle, index) in privacidadConfig.detalles"
                :key="index"
                class="flex items-start gap-3"
              >
                <CheckCircle class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span class="text-sm text-gray-600">{{ detalle }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Mensaje de confianza -->
        <div class="bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 rounded-xl p-5">
          <div class="flex items-start gap-4">
            <div class="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield class="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <h4 class="font-semibold text-teal-900 mb-1">Tu confianza es nuestra prioridad</h4>
              <p class="text-sm text-teal-700">
                Sabemos que responder con honestidad requiere confianza. Por eso, tus respuestas
                <strong>nunca</strong> se comparten con tu manager ni afectan tu evaluación de desempeño.
              </p>
            </div>
          </div>
        </div>

        <!-- Botón comenzar -->
        <button
          @click="comenzarEncuesta"
          class="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-3 group"
        >
          <Sparkles class="w-5 h-5 group-hover:animate-pulse" />
          <span>Comenzar y ganar {{ activeSurvey.puntos_base || activeSurvey.puntos_recompensa || 50 }} puntos</span>
          <ArrowRight class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <!-- Vista de preguntas -->
      <div v-else class="space-y-6">
        <!-- Barra de progreso -->
        <div class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <div class="flex items-center justify-between mb-3">
            <span class="text-sm font-medium text-gray-700">
              Pregunta {{ currentStep }} de {{ totalPreguntas }}
            </span>
            <span class="text-sm font-semibold text-teal-600">{{ progreso }}% completado</span>
          </div>
          <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              class="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transition-all duration-500"
              :style="{ width: `${progreso}%` }"
            ></div>
          </div>

          <!-- Indicadores de preguntas -->
          <div class="flex items-center justify-center gap-2 mt-4">
            <button
              v-for="(pregunta, index) in activeSurvey.preguntas"
              :key="pregunta.id"
              @click="irAPregunta(index)"
              class="w-8 h-8 rounded-full text-xs font-medium transition-all"
              :class="{
                'bg-teal-600 text-white': currentStep === index + 1,
                'bg-teal-100 text-teal-700': userAnswers[pregunta.id] !== undefined && currentStep !== index + 1,
                'bg-gray-100 text-gray-400': userAnswers[pregunta.id] === undefined && currentStep !== index + 1
              }"
            >
              {{ index + 1 }}
            </button>
          </div>
        </div>

        <!-- Pregunta actual -->
        <div v-if="preguntaActual" class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">
            {{ preguntaActual.texto }}
          </h2>

          <!-- Opciones según tipo de pregunta -->

          <!-- Opción múltiple -->
          <div v-if="preguntaActual.tipo === 'opcion_multiple'" class="space-y-3">
            <label
              v-for="opcion in preguntaActual.opciones"
              :key="opcion"
              class="flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all"
              :class="userAnswers[preguntaActual.id] === opcion
                ? 'border-teal-500 bg-teal-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'"
            >
              <input
                type="radio"
                :name="`pregunta_${preguntaActual.id}`"
                :value="opcion"
                v-model="userAnswers[preguntaActual.id]"
                class="sr-only"
              />
              <div
                class="w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 flex-shrink-0"
                :class="userAnswers[preguntaActual.id] === opcion
                  ? 'border-teal-500 bg-teal-500'
                  : 'border-gray-300'"
              >
                <div v-if="userAnswers[preguntaActual.id] === opcion" class="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <span class="text-gray-700">{{ opcion }}</span>
            </label>
          </div>

          <!-- Sí/No -->
          <div v-else-if="preguntaActual.tipo === 'si_no'" class="flex gap-4">
            <label
              v-for="opcion in ['Sí', 'No']"
              :key="opcion"
              class="flex-1 p-6 border-2 rounded-xl cursor-pointer text-center transition-all"
              :class="userAnswers[preguntaActual.id] === opcion
                ? 'border-teal-500 bg-teal-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'"
            >
              <input
                type="radio"
                :name="`pregunta_${preguntaActual.id}`"
                :value="opcion"
                v-model="userAnswers[preguntaActual.id]"
                class="sr-only"
              />
              <span class="text-lg font-medium" :class="userAnswers[preguntaActual.id] === opcion ? 'text-teal-700' : 'text-gray-700'">
                {{ opcion }}
              </span>
            </label>
          </div>

          <!-- Escala 1-5 -->
          <div v-else-if="preguntaActual.tipo === 'escala_1_5'" class="space-y-4">
            <div class="flex items-center justify-between text-sm text-gray-500 px-2">
              <span>Muy insatisfecho</span>
              <span>Muy satisfecho</span>
            </div>
            <div class="flex justify-between gap-2">
              <label
                v-for="valor in [1, 2, 3, 4, 5]"
                :key="valor"
                class="flex-1 aspect-square flex items-center justify-center border-2 rounded-xl cursor-pointer text-xl font-bold transition-all"
                :class="userAnswers[preguntaActual.id] === valor
                  ? 'border-teal-500 bg-teal-500 text-white'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-600'"
              >
                <input
                  type="radio"
                  :name="`pregunta_${preguntaActual.id}`"
                  :value="valor"
                  v-model="userAnswers[preguntaActual.id]"
                  class="sr-only"
                />
                {{ valor }}
              </label>
            </div>
          </div>

          <!-- Texto abierto -->
          <div v-else-if="preguntaActual.tipo === 'texto_abierto'" class="space-y-4">
            <textarea
              v-model="userAnswers[preguntaActual.id]"
              rows="5"
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 resize-none transition-colors"
              placeholder="Comparte tus pensamientos, sugerencias o comentarios..."
            ></textarea>

            <!-- Mensaje de anonimato para texto abierto -->
            <div class="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg">
              <Shield class="w-4 h-4 flex-shrink-0" />
              <span>Tu respuesta de texto es <strong>100% anónima</strong>. Escribe con total libertad.</span>
            </div>
          </div>
        </div>

        <!-- Navegación -->
        <div class="flex items-center justify-between">
          <button
            @click="preguntaAnterior"
            :disabled="currentStep <= 1"
            class="flex items-center gap-2 px-5 py-3 text-gray-600 font-medium rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft class="w-5 h-5" />
            Anterior
          </button>

          <button
            @click="siguientePregunta"
            :disabled="!puedeAvanzar || submitting"
            class="flex items-center gap-2 px-6 py-3 font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            :class="esUltimaPregunta && allQuestionsAnswered
              ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-lg shadow-green-200'
              : 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white hover:from-teal-700 hover:to-emerald-700'"
          >
            <template v-if="submitting">
              <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Enviando...
            </template>
            <template v-else-if="esUltimaPregunta && allQuestionsAnswered">
              <Send class="w-5 h-5" />
              Enviar y ganar {{ activeSurvey?.puntos_base || activeSurvey?.puntos_recompensa || 50 }} puntos
            </template>
            <template v-else>
              Siguiente
              <ChevronRight class="w-5 h-5" />
            </template>
          </button>
        </div>

        <!-- Recordatorio de privacidad sutil -->
        <div class="text-center">
          <p class="text-xs text-gray-400 flex items-center justify-center gap-1">
            <Lock class="w-3 h-3" />
            Tus respuestas son confidenciales y no se comparten con tu manager
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Animación suave para las transiciones */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Animación de pulso lento para el check */
@keyframes pulse-slow {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4);
  }
  50% {
    box-shadow: 0 0 0 15px rgba(16, 185, 129, 0);
  }
}

.animate-pulse-slow {
  animation: pulse-slow 2s infinite;
}
</style>
