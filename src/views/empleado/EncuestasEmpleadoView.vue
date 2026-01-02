<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import {
  FileText,
  CheckCircle,
  Clock,
  Star,
  Shield,
  ChevronRight,
  Gift,
  Calendar,
  Heart,
  Megaphone,
  Sparkles,
  Award,
  TrendingUp,
  AlertCircle,
  Lightbulb,
  RefreshCw,
  Lock,
  Zap,
  Target,
  PartyPopper,
  Trophy
} from 'lucide-vue-next';

// Stores
import { useAuthStore } from '@/stores/auth.store.js';
import { useGamificacionStore } from '@/stores/gamificacion.store.js';
// Servicio especializado para empleados (con filtrado multiempresa)
import { empleadoEncuestasService } from '@/services/empleado.encuestas.service.js';

const router = useRouter();

// Stores
const authStore = useAuthStore();
const gamificacionStore = useGamificacionStore();

const { user, empleado } = storeToRefs(authStore);
const { puntosUsuario } = storeToRefs(gamificacionStore);

// Estado local
const loading = ref(true);
const encuestasPendientes = ref([]);
const historialEncuestas = ref([]);
const currentTipIndex = ref(0);
const error = ref(null);

// ==========================================
// TIPS DE BIENESTAR ROTATIVOS
// ==========================================
const tipsData = [
  {
    categoria: 'Participación',
    icono: '📊',
    color: 'indigo',
    titulo: 'Tu voz importa',
    texto: 'Cada respuesta ayuda a crear un mejor ambiente de trabajo. ¡Gracias por participar!',
  },
  {
    categoria: 'Bienestar',
    icono: '🧘',
    color: 'purple',
    titulo: 'Pausa consciente',
    texto: 'Responder encuestas es un buen momento para reflexionar sobre tu bienestar.',
  },
  {
    categoria: 'Impacto',
    icono: '🌱',
    color: 'green',
    titulo: 'Pequeñas acciones, grandes cambios',
    texto: 'Las mejoras en la empresa empiezan con tu feedback honesto.',
  },
  {
    categoria: 'Comunidad',
    icono: '🤝',
    color: 'blue',
    titulo: 'Juntos somos más',
    texto: 'Tu participación junto a la de tus compañeros genera el cambio real.',
  },
  {
    categoria: 'Privacidad',
    icono: '🔒',
    color: 'teal',
    titulo: 'Respuestas protegidas',
    texto: 'Tus respuestas son 100% anónimas. Responde con total libertad.',
  }
];

// Rotar tips cada 25 segundos
let tipInterval;
onMounted(() => {
  currentTipIndex.value = Math.floor(Math.random() * tipsData.length);
  tipInterval = setInterval(() => {
    currentTipIndex.value = (currentTipIndex.value + 1) % tipsData.length;
  }, 25000);
});

onUnmounted(() => {
  if (tipInterval) clearInterval(tipInterval);
});

const tipActual = computed(() => tipsData[currentTipIndex.value]);

const siguienteTip = () => {
  currentTipIndex.value = (currentTipIndex.value + 1) % tipsData.length;
};

// ==========================================
// COMPUTED PROPERTIES
// ==========================================
const nombreEmpleado = computed(() => {
  if (empleado.value?.nombre) {
    return empleado.value.nombre.split(' ')[0];
  }
  if (user.value?.email) {
    const localPart = user.value.email.split('@')[0];
    return localPart.charAt(0).toUpperCase() + localPart.slice(1);
  }
  return 'Empleado';
});

const nombreEmpresa = computed(() => {
  if (empleado.value?.empresa?.nombre) {
    return empleado.value.empresa.nombre;
  }
  return 'tu empresa';
});

const tieneEncuestasPendientes = computed(() => encuestasPendientes.value.length > 0);

const totalPuntosDisponibles = computed(() => {
  // Usar puntos_base de la BD (fuente única de verdad), fallback a 50
  return encuestasPendientes.value.reduce((total, enc) => total + (enc.puntos_base || enc.puntos_recompensa || 50), 0);
});

// Sistema de urgencia
const calcularUrgencia = (encuesta) => {
  if (!encuesta.fecha_fin) return 'normal';

  const fechaFin = new Date(encuesta.fecha_fin);
  const ahora = new Date();
  const horasRestantes = (fechaFin - ahora) / (1000 * 60 * 60);

  if (horasRestantes <= 24) return 'urgente';
  if (horasRestantes <= 72) return 'pronto';
  return 'normal';
};

const calcularTiempoRestante = (fechaFin) => {
  if (!fechaFin) return null;

  const fecha = new Date(fechaFin);
  const ahora = new Date();
  const diff = fecha - ahora;

  if (diff <= 0) return 'Expirada';

  const horas = Math.floor(diff / (1000 * 60 * 60));
  const dias = Math.floor(horas / 24);

  if (dias > 0) return `${dias} día${dias > 1 ? 's' : ''}`;
  if (horas > 0) return `${horas}h`;
  return 'Última hora';
};

// Progreso de participación
const progresoParticipacion = computed(() => {
  const total = encuestasPendientes.value.length + historialEncuestas.value.length;
  if (total === 0) return 100;
  return Math.round((historialEncuestas.value.length / total) * 100);
});

// ==========================================
// SISTEMA DE PROGRESO DE PUNTOS
// ==========================================
const recompensasDisponibles = [
  { nombre: 'Café premium', puntos: 100, icono: '☕' },
  { nombre: 'Día flexible', puntos: 250, icono: '📅' },
  { nombre: 'Sesión spa', puntos: 500, icono: '💆' },
  { nombre: 'Día libre', puntos: 1000, icono: '🏖️' }
];

const siguienteRecompensa = computed(() => {
  const puntos = puntosUsuario.value || 0;
  return recompensasDisponibles.find(r => r.puntos > puntos) || recompensasDisponibles[recompensasDisponibles.length - 1];
});

const progresoRecompensa = computed(() => {
  const puntos = puntosUsuario.value || 0;
  const meta = siguienteRecompensa.value.puntos;
  const recompensaAnterior = recompensasDisponibles.find((r, i) =>
    recompensasDisponibles[i + 1]?.puntos === meta
  );
  const puntoBase = recompensaAnterior?.puntos || 0;

  return Math.min(100, Math.round(((puntos - puntoBase) / (meta - puntoBase)) * 100));
});

const puntosParaMeta = computed(() => {
  const puntos = puntosUsuario.value || 0;
  return Math.max(0, siguienteRecompensa.value.puntos - puntos);
});

// ==========================================
// CARGAR DATOS (usando servicio multiempresa)
// ==========================================
const cargarDatos = async () => {
  loading.value = true;
  error.value = null;

  try {
    // Usar el servicio especializado que filtra por empresa automáticamente
    const resultado = await empleadoEncuestasService.getDatosCompletos();

    if (!resultado.success) {
      throw new Error(resultado.error || 'Error al cargar encuestas');
    }

    // Formatear encuestas pendientes con datos adicionales de UI
    encuestasPendientes.value = (resultado.pendientes || []).map(enc => ({
      ...enc,
      preguntas: [{ count: enc.num_preguntas || 5 }]
    }));

    historialEncuestas.value = resultado.historial || [];

    // Cargar puntos del store (se sincroniza con el empleado)
    if (empleado.value?.id) {
      await gamificacionStore.cargarPuntos(empleado.value.id);
    }
  } catch (err) {
    console.error('Error cargando encuestas:', err);
    error.value = err.message || 'Error al cargar las encuestas';
  } finally {
    loading.value = false;
  }
};

onMounted(cargarDatos);

// ==========================================
// NAVEGACIÓN Y ACCIONES
// ==========================================
const irAResponder = (encuestaId) => {
  router.push(`/empleado/encuesta/${encuestaId}`);
};

const irARecompensas = () => router.push('/empleado/recompensas');
const irAActividades = () => router.push('/empleado/actividades');
const irAComunicados = () => router.push('/empleado/comunicados');
const irAApoyo = () => router.push('/empleado/apoyo-personal');

// Formatear fecha
const formatearFecha = (fecha) => {
  if (!fecha) return '';
  const date = new Date(fecha);
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
  });
};
</script>

<template>
  <div class="space-y-6">
    <!-- ==========================================
         HEADER DE LA PÁGINA
         ========================================== -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Mis Encuestas</h1>
        <p class="text-gray-500 mt-1">Tu opinión construye un mejor lugar de trabajo</p>
      </div>

      <!-- Badge de puntos -->
      <div class="flex items-center gap-3">
        <div class="flex items-center gap-2 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 px-4 py-2 rounded-xl">
          <Star class="w-5 h-5 text-amber-500 fill-amber-500" />
          <span class="font-bold text-amber-700">{{ puntosUsuario || 0 }}</span>
          <span class="text-amber-600 text-sm">puntos</span>
        </div>
      </div>
    </div>

    <!-- ==========================================
         ESTADO: CARGANDO
         ========================================== -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-16">
      <div class="w-16 h-16 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mb-6"></div>
      <p class="text-gray-600 font-medium">Cargando encuestas...</p>
      <p class="text-gray-400 text-sm mt-1">Preparando tu información</p>
    </div>

    <!-- ==========================================
         ESTADO: ERROR
         ========================================== -->
    <div v-else-if="error" class="max-w-lg mx-auto">
      <div class="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle class="w-8 h-8 text-red-600" />
        </div>
        <h3 class="text-lg font-semibold text-red-800 mb-2">Error al cargar</h3>
        <p class="text-red-600 mb-6">{{ error }}</p>
        <button
          @click="cargarDatos"
          class="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors"
        >
          <RefreshCw class="w-4 h-4" />
          Reintentar
        </button>
      </div>
    </div>

    <!-- ==========================================
         CONTENIDO PRINCIPAL
         ========================================== -->
    <template v-else>
      <!-- ==========================================
           ESTADO ACTIVO: CON ENCUESTAS PENDIENTES
           ========================================== -->
      <template v-if="tieneEncuestasPendientes">
        <!-- Hero motivador -->
        <div class="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden shadow-xl">
          <!-- Patrones decorativos -->
          <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl"></div>
          <div class="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/4 blur-xl"></div>

          <div class="relative z-10">
            <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <FileText class="w-6 h-6" />
                  <span class="text-white/80 font-medium">
                    {{ encuestasPendientes.length }} encuesta{{ encuestasPendientes.length > 1 ? 's' : '' }} disponible{{ encuestasPendientes.length > 1 ? 's' : '' }}
                  </span>
                </div>
                <h2 class="text-2xl md:text-3xl font-bold mb-2">
                  ¡{{ nombreEmpleado }}, tu opinión nos importa!
                </h2>
                <p class="text-white/80 text-lg">
                  Completa las encuestas y ayuda a mejorar el bienestar en {{ nombreEmpresa }}.
                </p>

                <!-- Puntos disponibles -->
                <div class="flex items-center gap-4 mt-4">
                  <div class="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                    <Award class="w-5 h-5 text-yellow-300" />
                    <span class="font-semibold">+{{ totalPuntosDisponibles }} puntos disponibles</span>
                  </div>
                </div>
              </div>

              <!-- Indicador de progreso circular -->
              <div class="bg-white/15 backdrop-blur-md rounded-2xl p-5 text-center border border-white/20">
                <p class="text-white/80 text-sm mb-2">Tu participación</p>
                <div class="relative w-24 h-24 mx-auto mb-3">
                  <svg class="w-full h-full -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="42"
                      fill="none"
                      stroke="rgba(255,255,255,0.2)"
                      stroke-width="8"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="42"
                      fill="none"
                      stroke="white"
                      stroke-width="8"
                      stroke-linecap="round"
                      :stroke-dasharray="`${progresoParticipacion * 2.64} 264`"
                    />
                  </svg>
                  <div class="absolute inset-0 flex items-center justify-center">
                    <span class="text-2xl font-bold">{{ progresoParticipacion }}%</span>
                  </div>
                </div>
                <p class="text-sm text-white/70">
                  {{ historialEncuestas.length }} completada{{ historialEncuestas.length !== 1 ? 's' : '' }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Lista de encuestas pendientes -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Zap class="w-5 h-5 text-indigo-600" />
            Encuestas pendientes
          </h3>

          <div class="space-y-3">
            <div
              v-for="encuesta in encuestasPendientes"
              :key="encuesta.id"
              @click="irAResponder(encuesta.id)"
              class="bg-white border-2 rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 group"
              :class="{
                'border-red-300 bg-gradient-to-r from-red-50 to-orange-50': calcularUrgencia(encuesta) === 'urgente',
                'border-amber-300 bg-gradient-to-r from-amber-50 to-yellow-50': calcularUrgencia(encuesta) === 'pronto',
                'border-gray-200 hover:border-indigo-300': calcularUrgencia(encuesta) === 'normal'
              }"
            >
              <div class="flex items-start gap-4">
                <!-- Icono con urgencia -->
                <div
                  class="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                  :class="{
                    'bg-red-100': calcularUrgencia(encuesta) === 'urgente',
                    'bg-amber-100': calcularUrgencia(encuesta) === 'pronto',
                    'bg-indigo-100': calcularUrgencia(encuesta) === 'normal'
                  }"
                >
                  <FileText
                    class="w-7 h-7"
                    :class="{
                      'text-red-600': calcularUrgencia(encuesta) === 'urgente',
                      'text-amber-600': calcularUrgencia(encuesta) === 'pronto',
                      'text-indigo-600': calcularUrgencia(encuesta) === 'normal'
                    }"
                  />
                </div>

                <div class="flex-1 min-w-0">
                  <div class="flex flex-wrap items-center gap-2 mb-1">
                    <h4
                      class="font-bold text-lg"
                      :class="{
                        'text-red-900': calcularUrgencia(encuesta) === 'urgente',
                        'text-amber-900': calcularUrgencia(encuesta) === 'pronto',
                        'text-gray-900': calcularUrgencia(encuesta) === 'normal'
                      }"
                    >
                      {{ encuesta.titulo }}
                    </h4>

                    <!-- Badge de urgencia -->
                    <span
                      v-if="calcularUrgencia(encuesta) === 'urgente'"
                      class="px-2.5 py-0.5 bg-red-200 text-red-800 text-xs font-bold rounded-full animate-pulse"
                    >
                      ⚡ Urgente
                    </span>
                    <span
                      v-else-if="calcularUrgencia(encuesta) === 'pronto'"
                      class="px-2.5 py-0.5 bg-amber-200 text-amber-800 text-xs font-bold rounded-full"
                    >
                      Vence pronto
                    </span>
                  </div>

                  <p class="text-gray-600 text-sm mb-3 line-clamp-2">
                    {{ encuesta.descripcion || 'Comparte tu opinión y ayuda a mejorar nuestro ambiente laboral.' }}
                  </p>

                  <div class="flex flex-wrap items-center gap-4 text-sm">
                    <span class="flex items-center gap-1.5 text-gray-500">
                      <FileText class="w-4 h-4" />
                      {{ encuesta.preguntas?.[0]?.count || '~5' }} preguntas
                    </span>
                    <span class="flex items-center gap-1.5 text-gray-500">
                      <Clock class="w-4 h-4" />
                      ~{{ Math.ceil((encuesta.preguntas?.[0]?.count || 5) * 0.5) }} min
                    </span>
                    <span class="flex items-center gap-1.5 font-semibold text-amber-600">
                      <Award class="w-4 h-4" />
                      +{{ encuesta.puntos_base || encuesta.puntos_recompensa || 50 }} puntos
                    </span>
                    <span
                      v-if="encuesta.fecha_fin"
                      class="flex items-center gap-1.5"
                      :class="{
                        'text-red-600 font-semibold': calcularUrgencia(encuesta) === 'urgente',
                        'text-amber-600': calcularUrgencia(encuesta) === 'pronto',
                        'text-gray-500': calcularUrgencia(encuesta) === 'normal'
                      }"
                    >
                      <Clock class="w-4 h-4" />
                      {{ calcularTiempoRestante(encuesta.fecha_fin) }} restantes
                    </span>
                  </div>
                </div>

                <!-- Botón de acción -->
                <div class="flex items-center gap-2 flex-shrink-0">
                  <span
                    class="hidden sm:inline font-semibold transition-transform group-hover:translate-x-1"
                    :class="{
                      'text-red-600': calcularUrgencia(encuesta) === 'urgente',
                      'text-amber-600': calcularUrgencia(encuesta) === 'pronto',
                      'text-indigo-600': calcularUrgencia(encuesta) === 'normal'
                    }"
                  >
                    Responder
                  </span>
                  <ChevronRight
                    class="w-6 h-6 transition-transform group-hover:translate-x-1"
                    :class="{
                      'text-red-500': calcularUrgencia(encuesta) === 'urgente',
                      'text-amber-500': calcularUrgencia(encuesta) === 'pronto',
                      'text-indigo-500': calcularUrgencia(encuesta) === 'normal'
                    }"
                  />
                </div>
              </div>

              <!-- Mensaje de privacidad -->
              <div
                class="mt-4 pt-4 border-t flex items-center gap-2 text-sm"
                :class="{
                  'border-red-200 text-red-600': calcularUrgencia(encuesta) === 'urgente',
                  'border-amber-200 text-amber-600': calcularUrgencia(encuesta) === 'pronto',
                  'border-gray-100 text-gray-500': calcularUrgencia(encuesta) === 'normal'
                }"
              >
                <Shield class="w-4 h-4 flex-shrink-0" />
                <span>Tus respuestas son <strong>100% anónimas</strong></span>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- ==========================================
           ESTADO VACÍO: SIN ENCUESTAS PENDIENTES
           ========================================== -->
      <template v-else>
        <!-- Hero de celebración -->
        <div class="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl p-8 md:p-10 text-white relative overflow-hidden shadow-xl">
          <!-- Partículas decorativas -->
          <div class="absolute top-4 left-8 text-4xl animate-bounce" style="animation-delay: 0.1s;">🎉</div>
          <div class="absolute top-12 right-12 text-3xl animate-bounce" style="animation-delay: 0.3s;">✨</div>
          <div class="absolute bottom-8 left-16 text-3xl animate-bounce" style="animation-delay: 0.5s;">🌟</div>
          <div class="absolute bottom-4 right-8 text-4xl animate-bounce" style="animation-delay: 0.2s;">🎊</div>

          <div class="relative z-10 text-center max-w-2xl mx-auto">
            <!-- Icono de éxito -->
            <div class="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
              <div class="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                <Trophy class="w-10 h-10 text-emerald-600" />
              </div>
            </div>

            <h2 class="text-3xl md:text-4xl font-bold mb-3">
              ¡Felicidades, {{ nombreEmpleado }}!
            </h2>
            <p class="text-xl text-white/90 mb-2">
              Estás al día con todas tus encuestas
            </p>
            <p class="text-white/70">
              Te notificaremos cuando haya una nueva encuesta disponible para ti.
            </p>

            <!-- Stats -->
            <div class="flex flex-wrap items-center justify-center gap-6 mt-8">
              <div class="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl">
                <p class="text-3xl font-bold">{{ historialEncuestas.length }}</p>
                <p class="text-sm text-white/80">Encuestas completadas</p>
              </div>
              <div class="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl">
                <p class="text-3xl font-bold">{{ puntosUsuario || 0 }}</p>
                <p class="text-sm text-white/80">Puntos acumulados</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Mensaje de privacidad destacado -->
        <div class="bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 rounded-xl p-5">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Shield class="w-6 h-6 text-teal-600" />
            </div>
            <div>
              <h4 class="font-semibold text-teal-900 mb-1">Tu privacidad siempre protegida</h4>
              <p class="text-sm text-teal-700">
                Todas las respuestas que envíes son <strong>completamente anónimas</strong>.
                Ni tu manager ni RRHH pueden identificar quién respondió qué.
                Solo se comparten tendencias generales para mejorar el ambiente laboral.
              </p>
            </div>
          </div>
        </div>
      </template>

      <!-- ==========================================
           GRID INFERIOR: WIDGETS Y ACCIONES
           ========================================== -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Columna izquierda (2 cols) -->
        <div class="lg:col-span-2 space-y-6">

          <!-- Historial de encuestas completadas -->
          <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div class="p-4 border-b border-gray-100 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-11 h-11 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                  <CheckCircle class="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h2 class="font-semibold text-gray-900">Historial de participación</h2>
                  <p class="text-xs text-gray-500">Encuestas que has completado</p>
                </div>
              </div>
              <span class="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                {{ historialEncuestas.length }} completada{{ historialEncuestas.length !== 1 ? 's' : '' }}
              </span>
            </div>

            <div v-if="historialEncuestas.length > 0" class="divide-y divide-gray-100 max-h-80 overflow-y-auto">
              <div
                v-for="encuesta in historialEncuestas"
                :key="encuesta.id"
                class="p-4 hover:bg-gray-50 transition-colors"
              >
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle class="w-5 h-5 text-green-600" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <h4 class="font-medium text-gray-900">{{ encuesta.titulo }}</h4>
                    <p class="text-sm text-gray-500">
                      Completada el {{ formatearFecha(encuesta.fecha_completado) }}
                    </p>
                  </div>
                  <div class="flex items-center gap-1 text-green-600 font-medium text-sm">
                    <CheckCircle class="w-4 h-4" />
                    +{{ encuesta.puntos_otorgados || encuesta.puntos_base || 50 }} pts
                  </div>
                </div>
              </div>
            </div>

            <!-- Estado vacío del historial -->
            <div v-else class="p-8 text-center">
              <div class="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText class="w-8 h-8 text-gray-400" />
              </div>
              <p class="text-gray-600 font-medium">Aún no has completado encuestas</p>
              <p class="text-sm text-gray-400 mt-1">Tu historial aparecerá aquí cuando completes tu primera encuesta</p>
            </div>
          </div>

          <!-- Tip de bienestar -->
          <div
            class="rounded-2xl p-5 shadow-sm transition-colors duration-500"
            :class="{
              'bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200': tipActual.color === 'indigo',
              'bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200': tipActual.color === 'purple',
              'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200': tipActual.color === 'green',
              'bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200': tipActual.color === 'blue',
              'bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200': tipActual.color === 'teal'
            }"
          >
            <div class="flex items-start gap-4">
              <div
                class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                :class="{
                  'bg-indigo-100': tipActual.color === 'indigo',
                  'bg-purple-100': tipActual.color === 'purple',
                  'bg-green-100': tipActual.color === 'green',
                  'bg-blue-100': tipActual.color === 'blue',
                  'bg-teal-100': tipActual.color === 'teal'
                }"
              >
                {{ tipActual.icono }}
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <span
                    class="text-xs font-semibold px-2 py-0.5 rounded-full"
                    :class="{
                      'bg-indigo-200 text-indigo-700': tipActual.color === 'indigo',
                      'bg-purple-200 text-purple-700': tipActual.color === 'purple',
                      'bg-green-200 text-green-700': tipActual.color === 'green',
                      'bg-blue-200 text-blue-700': tipActual.color === 'blue',
                      'bg-teal-200 text-teal-700': tipActual.color === 'teal'
                    }"
                  >
                    {{ tipActual.categoria }}
                  </span>
                  <Lightbulb
                    class="w-4 h-4"
                    :class="{
                      'text-indigo-500': tipActual.color === 'indigo',
                      'text-purple-500': tipActual.color === 'purple',
                      'text-green-500': tipActual.color === 'green',
                      'text-blue-500': tipActual.color === 'blue',
                      'text-teal-500': tipActual.color === 'teal'
                    }"
                  />
                </div>
                <h3
                  class="font-bold text-lg"
                  :class="{
                    'text-indigo-900': tipActual.color === 'indigo',
                    'text-purple-900': tipActual.color === 'purple',
                    'text-green-900': tipActual.color === 'green',
                    'text-blue-900': tipActual.color === 'blue',
                    'text-teal-900': tipActual.color === 'teal'
                  }"
                >
                  {{ tipActual.titulo }}
                </h3>
                <p
                  class="mt-1"
                  :class="{
                    'text-indigo-700': tipActual.color === 'indigo',
                    'text-purple-700': tipActual.color === 'purple',
                    'text-green-700': tipActual.color === 'green',
                    'text-blue-700': tipActual.color === 'blue',
                    'text-teal-700': tipActual.color === 'teal'
                  }"
                >
                  {{ tipActual.texto }}
                </p>
              </div>
              <button
                @click="siguienteTip"
                class="p-2 rounded-lg transition-colors flex-shrink-0"
                :class="{
                  'hover:bg-indigo-100 text-indigo-500': tipActual.color === 'indigo',
                  'hover:bg-purple-100 text-purple-500': tipActual.color === 'purple',
                  'hover:bg-green-100 text-green-500': tipActual.color === 'green',
                  'hover:bg-blue-100 text-blue-500': tipActual.color === 'blue',
                  'hover:bg-teal-100 text-teal-500': tipActual.color === 'teal'
                }"
                title="Siguiente tip"
              >
                <RefreshCw class="w-5 h-5" />
              </button>
            </div>

            <!-- Indicadores de tip -->
            <div class="flex items-center justify-center gap-1.5 mt-4">
              <button
                v-for="(tip, index) in tipsData"
                :key="index"
                @click="currentTipIndex = index"
                class="w-2 h-2 rounded-full transition-all"
                :class="index === currentTipIndex
                  ? 'w-4 bg-current opacity-100'
                  : 'bg-current opacity-30 hover:opacity-50'"
                :style="{ color: tipActual.color === 'indigo' ? '#6366f1' : tipActual.color === 'purple' ? '#9333ea' : tipActual.color === 'green' ? '#16a34a' : tipActual.color === 'blue' ? '#2563eb' : '#0d9488' }"
              ></button>
            </div>
          </div>
        </div>

        <!-- ==========================================
             COLUMNA DERECHA: WIDGETS
             ========================================== -->
        <div class="space-y-6">
          <!-- Widget de puntos y progreso -->
          <div class="bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 border border-amber-200 rounded-2xl p-5 shadow-sm">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-semibold text-amber-900">Mi progreso</h3>
              <div class="flex items-center gap-1">
                <Star class="w-5 h-5 text-amber-500 fill-amber-500" />
                <Star class="w-4 h-4 text-amber-400 fill-amber-400" />
              </div>
            </div>

            <!-- Puntos -->
            <div class="text-center py-2">
              <p class="text-4xl font-bold text-amber-700">{{ puntosUsuario || 0 }}</p>
              <p class="text-sm text-amber-600 mt-1">puntos acumulados</p>
            </div>

            <!-- Progreso hacia meta -->
            <div class="mt-4 bg-white/60 rounded-xl p-4">
              <div class="flex items-center justify-between text-sm mb-2">
                <span class="text-amber-700">
                  {{ siguienteRecompensa.icono }} {{ siguienteRecompensa.nombre }}
                </span>
                <span class="font-bold text-amber-800">{{ siguienteRecompensa.puntos }} pts</span>
              </div>
              <div class="h-3 bg-amber-100 rounded-full overflow-hidden">
                <div
                  class="h-full bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full transition-all duration-1000"
                  :style="{ width: `${progresoRecompensa}%` }"
                ></div>
              </div>
              <p class="text-xs text-amber-600 mt-2 text-center">
                <template v-if="puntosParaMeta > 0">
                  Te faltan <strong class="text-amber-800">{{ puntosParaMeta }}</strong> puntos
                </template>
                <template v-else>
                  <span class="text-green-600 font-semibold">🎉 ¡Puedes canjear!</span>
                </template>
              </p>
            </div>

            <button
              @click="irARecompensas"
              class="w-full mt-4 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-lg shadow-amber-200 flex items-center justify-center gap-2"
            >
              <Gift class="w-5 h-5" />
              Ver recompensas
            </button>

            <!-- Mensaje de privacidad -->
            <div class="mt-4 flex items-center gap-2 text-xs text-amber-600 bg-white/40 rounded-lg p-2">
              <Lock class="w-3 h-3 flex-shrink-0" />
              <span>Tu saldo es privado. Solo tú lo ves.</span>
            </div>
          </div>

          <!-- Acciones alternativas -->
          <div class="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <h3 class="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Sparkles class="w-4 h-4 text-teal-600" />
              Mientras tanto...
            </h3>
            <div class="space-y-2">
              <button
                @click="irARecompensas"
                class="w-full flex items-center gap-3 p-3 rounded-xl text-left hover:bg-amber-50 transition-colors group"
              >
                <div class="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                  <Gift class="w-5 h-5 text-amber-600" />
                </div>
                <div class="flex-1">
                  <p class="font-medium text-gray-900 group-hover:text-amber-700">Recompensas</p>
                  <p class="text-xs text-gray-500">Canjea tus puntos</p>
                </div>
                <ChevronRight class="w-5 h-5 text-gray-300 group-hover:text-amber-500 transition-colors" />
              </button>

              <button
                @click="irAActividades"
                class="w-full flex items-center gap-3 p-3 rounded-xl text-left hover:bg-blue-50 transition-colors group"
              >
                <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <Calendar class="w-5 h-5 text-blue-600" />
                </div>
                <div class="flex-1">
                  <p class="font-medium text-gray-900 group-hover:text-blue-700">Actividades</p>
                  <p class="text-xs text-gray-500">Eventos de bienestar</p>
                </div>
                <ChevronRight class="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors" />
              </button>

              <button
                @click="irAApoyo"
                class="w-full flex items-center gap-3 p-3 rounded-xl text-left hover:bg-pink-50 transition-colors group"
              >
                <div class="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center group-hover:bg-pink-200 transition-colors">
                  <Heart class="w-5 h-5 text-pink-600" />
                </div>
                <div class="flex-1">
                  <p class="font-medium text-gray-900 group-hover:text-pink-700">Apoyo personal</p>
                  <p class="text-xs text-gray-500">Recursos de bienestar</p>
                </div>
                <ChevronRight class="w-5 h-5 text-gray-300 group-hover:text-pink-500 transition-colors" />
              </button>

              <button
                @click="irAComunicados"
                class="w-full flex items-center gap-3 p-3 rounded-xl text-left hover:bg-orange-50 transition-colors group"
              >
                <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                  <Megaphone class="w-5 h-5 text-orange-600" />
                </div>
                <div class="flex-1">
                  <p class="font-medium text-gray-900 group-hover:text-orange-700">Comunicados</p>
                  <p class="text-xs text-gray-500">Novedades de {{ nombreEmpresa }}</p>
                </div>
                <ChevronRight class="w-5 h-5 text-gray-300 group-hover:text-orange-500 transition-colors" />
              </button>
            </div>
          </div>

          <!-- Mensaje de privacidad general -->
          <div class="bg-gradient-to-br from-slate-50 to-gray-100 border border-gray-200 rounded-2xl p-4 shadow-sm">
            <div class="flex items-start gap-3">
              <div class="w-10 h-10 bg-gradient-to-br from-teal-100 to-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield class="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <h4 class="font-semibold text-gray-900 text-sm">Tu privacidad primero</h4>
                <p class="text-xs text-gray-600 mt-1 leading-relaxed">
                  Todas tus respuestas son <strong>anónimas</strong>.
                  Solo se comparten tendencias generales, nunca datos individuales.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Scrollbar personalizado */
.max-h-80::-webkit-scrollbar {
  width: 6px;
}

.max-h-80::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.max-h-80::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.max-h-80::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
