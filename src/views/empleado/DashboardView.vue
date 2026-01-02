<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import {
  FileText,
  Megaphone,
  Gift,
  Calendar,
  Heart,
  ArrowRight,
  Star,
  Clock,
  Shield,
  CheckCircle,
  Sparkles,
  ChevronRight,
  Lock,
  Lightbulb,
  AlertCircle,
  Zap,
  Sun,
  Moon,
  CloudSun,
  RefreshCw,
  Loader2,
  HelpCircle,
  Info,
  Play,
  Trophy
} from 'lucide-vue-next';

// Stores
import { useAuthStore } from '@/stores/auth.store.js';

// Servicios
import { empleadoDashboardService, tipsService } from '@/services/empleado.dashboard.service';

const router = useRouter();

// Store de autenticación
const authStore = useAuthStore();
const { user, empleado } = storeToRefs(authStore);

// Estado reactivo del dashboard
const loading = ref(true);
const error = ref(null);
const dashboardData = ref(null);
const currentTipIndex = ref(0);
const tipsData = ref([]);

// ==========================================
// CARGA DE DATOS
// ==========================================
onMounted(async () => {
  await cargarDashboard();
  await cargarTips();
  startTipRotation();
});

const cargarDashboard = async () => {
  loading.value = true;
  error.value = null;

  try {
    dashboardData.value = await empleadoDashboardService.getDashboardCompleto();
  } catch (err) {
    console.error('Error cargando dashboard:', err);
    error.value = err.message || 'Error al cargar los datos';
  } finally {
    loading.value = false;
  }
};

const cargarTips = async () => {
  try {
    tipsData.value = await tipsService.getTips();
    // Seleccionar tip aleatorio al iniciar
    currentTipIndex.value = Math.floor(Math.random() * tipsData.value.length);
  } catch (err) {
    console.error('Error cargando tips:', err);
  }
};

// Rotar tips cada 30 segundos
let tipInterval;
const startTipRotation = () => {
  tipInterval = setInterval(() => {
    if (tipsData.value.length > 0) {
      currentTipIndex.value = (currentTipIndex.value + 1) % tipsData.value.length;
    }
  }, 30000);
};

onUnmounted(() => {
  if (tipInterval) clearInterval(tipInterval);
});

const siguienteTip = () => {
  if (tipsData.value.length > 0) {
    currentTipIndex.value = (currentTipIndex.value + 1) % tipsData.value.length;
  }
};

const tipActual = computed(() => tipsData.value[currentTipIndex.value] || null);

// ==========================================
// COMPUTED PROPERTIES
// ==========================================
const nombreEmpleado = computed(() => {
  if (dashboardData.value?.perfil?.nombre) {
    return dashboardData.value.perfil.nombre.split(' ')[0];
  }
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
  if (dashboardData.value?.perfil?.empresa?.nombre) {
    return dashboardData.value.perfil.empresa.nombre;
  }
  if (empleado.value?.empresa?.nombre) {
    return empleado.value.empresa.nombre;
  }
  if (user.value?.email) {
    const domain = user.value.email.split('@')[1];
    return domain ? domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1) : 'Tu Empresa';
  }
  return 'Tu Empresa';
});

const saludoDelDia = computed(() => {
  const hora = new Date().getHours();
  if (hora >= 6 && hora < 12) return { texto: 'Buenos días', icono: Sun, emoji: '☀️' };
  if (hora >= 12 && hora < 19) return { texto: 'Buenas tardes', icono: CloudSun, emoji: '🌤️' };
  return { texto: 'Buenas noches', icono: Moon, emoji: '🌙' };
});

const mensajeMotivacional = computed(() => {
  const mensajes = [
    'Tu bienestar importa. ¿Qué hacemos hoy?',
    'Cada pequeña acción cuenta. ¡Vamos!',
    'Tu opinión hace la diferencia.',
    'Hoy es un buen día para cuidarte.',
    'Tu participación nos ayuda a mejorar.'
  ];
  const dayIndex = new Date().getDate() % mensajes.length;
  return mensajes[dayIndex];
});

// Encuestas
const encuestaPendiente = computed(() => dashboardData.value?.encuestas?.encuestaPrioritaria || null);
const tieneEncuestaPendiente = computed(() => !!encuestaPendiente.value);

const urgenciaEncuesta = computed(() => {
  if (!encuestaPendiente.value) return 'normal';
  return encuestaPendiente.value.urgencia || 'normal';
});

const tiempoRestanteEncuesta = computed(() => {
  if (!encuestaPendiente.value?.fecha_fin) return null;

  const fechaFin = new Date(encuestaPendiente.value.fecha_fin);
  const ahora = new Date();
  const diff = fechaFin - ahora;

  if (diff <= 0) return 'Expirada';

  const horas = Math.floor(diff / (1000 * 60 * 60));
  const dias = Math.floor(horas / 24);

  if (dias > 0) return `${dias} día${dias > 1 ? 's' : ''} restante${dias > 1 ? 's' : ''}`;
  if (horas > 0) return `${horas} hora${horas > 1 ? 's' : ''} restante${horas > 1 ? 's' : ''}`;
  return 'Última hora';
});

// Comunicados
const comunicadosRecientes = computed(() => dashboardData.value?.comunicados?.recientes || []);
const comunicadosNoLeidos = computed(() => dashboardData.value?.comunicados?.noLeidos || 0);

// Actividades y reservas
const proximasReservas = computed(() => {
  const reservas = dashboardData.value?.actividades?.misReservas || [];
  return reservas.slice(0, 3);
});

// Puntos y recompensas
const puntosUsuario = computed(() => dashboardData.value?.gamificacion?.puntos || 0);
const siguienteRecompensa = computed(() => dashboardData.value?.gamificacion?.siguienteRecompensa || null);
const progresoRecompensa = computed(() => dashboardData.value?.gamificacion?.progreso || 0);
const puntosParaMeta = computed(() => dashboardData.value?.gamificacion?.puntosParaMeta || 0);
const recompensasCanjeables = computed(() => dashboardData.value?.gamificacion?.recompensasCanjeables || 0);

// Resumen rápido
const resumenRapido = computed(() => {
  const items = [];

  if (tieneEncuestaPendiente.value) {
    items.push({
      icono: FileText,
      texto: `${dashboardData.value?.encuestas?.totalPendientes || 1} encuesta${(dashboardData.value?.encuestas?.totalPendientes || 1) > 1 ? 's' : ''} pendiente${(dashboardData.value?.encuestas?.totalPendientes || 1) > 1 ? 's' : ''}`,
      color: 'indigo',
      accion: irAEncuesta
    });
  }

  if (comunicadosNoLeidos.value > 0) {
    items.push({
      icono: Megaphone,
      texto: `${comunicadosNoLeidos.value} comunicado${comunicadosNoLeidos.value > 1 ? 's' : ''} nuevo${comunicadosNoLeidos.value > 1 ? 's' : ''}`,
      color: 'orange',
      accion: irAComunicados
    });
  }

  if (proximasReservas.value.length > 0) {
    items.push({
      icono: Calendar,
      texto: `${proximasReservas.value.length} actividad${proximasReservas.value.length > 1 ? 'es' : ''} próxima${proximasReservas.value.length > 1 ? 's' : ''}`,
      color: 'blue',
      accion: irAActividades
    });
  }

  if (recompensasCanjeables.value > 0) {
    items.push({
      icono: Gift,
      texto: `${recompensasCanjeables.value} recompensa${recompensasCanjeables.value > 1 ? 's' : ''} disponible${recompensasCanjeables.value > 1 ? 's' : ''}`,
      color: 'amber',
      accion: irARecompensas
    });
  }

  return items;
});

// ==========================================
// NAVEGACIÓN Y ACCIONES
// ==========================================

/**
 * Navega directamente a la encuesta pendiente prioritaria.
 * Si hay un ID de encuesta, va directo a responderla.
 * Si no, va a la lista de encuestas.
 */
const irAEncuestaPendiente = () => {
  if (encuestaPendiente.value?.id) {
    // Ir directamente a responder la encuesta prioritaria
    router.push(`/empleado/encuesta/${encuestaPendiente.value.id}`);
  } else {
    // Fallback: ir a la lista de encuestas
    router.push('/empleado/encuestas');
  }
};

// Alias para compatibilidad con resumenRapido
const irAEncuesta = () => irAEncuestaPendiente();

const irARecompensas = () => router.push('/empleado/recompensas');
const irAComunicados = () => router.push('/empleado/comunicados');
const irAActividades = () => router.push('/empleado/actividades');
const irAApoyo = () => router.push('/empleado/apoyo-personal');

const refrescarDatos = async () => {
  await cargarDashboard();
};

// Formatear fecha
const formatearFecha = (fecha) => {
  if (!fecha) return '';
  const date = new Date(fecha);
  const hoy = new Date();
  const manana = new Date(hoy);
  manana.setDate(manana.getDate() + 1);

  if (date.toDateString() === hoy.toDateString()) return 'Hoy';
  if (date.toDateString() === manana.toDateString()) return 'Mañana';

  return date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' });
};

const formatearHora = (fecha) => {
  if (!fecha) return '';
  return new Date(fecha).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
};
</script>

<template>
  <div class="space-y-6">
    <!-- Estado de carga -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-20">
      <Loader2 class="w-12 h-12 text-teal-500 animate-spin mb-4" />
      <p class="text-gray-600">Cargando tu dashboard...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
      <AlertCircle class="w-12 h-12 text-red-400 mx-auto mb-4" />
      <h3 class="text-lg font-semibold text-red-800 mb-2">Error al cargar</h3>
      <p class="text-red-600 mb-4">{{ error }}</p>
      <button
        @click="refrescarDatos"
        class="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
      >
        Intentar de nuevo
      </button>
    </div>

    <!-- Dashboard con datos -->
    <template v-else>
      <!-- ==========================================
           HERO: Saludo + Resumen Rápido
           ========================================== -->
      <div class="bg-gradient-to-br from-teal-500 via-teal-600 to-emerald-600 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden shadow-xl">
        <!-- Patrones decorativos -->
        <div class="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl"></div>
        <div class="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/4 blur-xl"></div>
        <div class="absolute top-1/2 right-1/4 w-24 h-24 bg-emerald-400/20 rounded-full blur-xl"></div>

        <div class="relative z-10">
          <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <!-- Saludo -->
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-2xl">{{ saludoDelDia.emoji }}</span>
                <p class="text-teal-100 font-medium">{{ saludoDelDia.texto }}</p>
              </div>
              <h1 class="text-3xl md:text-4xl font-bold mb-2">{{ nombreEmpleado }}</h1>
              <p class="text-teal-100 text-lg">{{ mensajeMotivacional }}</p>

              <!-- Resumen rápido -->
              <div v-if="resumenRapido.length > 0" class="flex flex-wrap gap-2 mt-4">
                <button
                  v-for="(item, index) in resumenRapido"
                  :key="index"
                  @click="item.accion"
                  class="flex items-center gap-2 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-full text-sm transition-colors backdrop-blur-sm"
                >
                  <component :is="item.icono" class="w-4 h-4" />
                  <span>{{ item.texto }}</span>
                </button>
              </div>
              <div v-else class="flex items-center gap-2 mt-4 text-teal-100">
                <CheckCircle class="w-5 h-5" />
                <span>¡Todo al día! No tienes pendientes</span>
              </div>
            </div>

            <!-- Widget de puntos compacto -->
            <div class="bg-white/15 backdrop-blur-md rounded-2xl p-5 min-w-[200px] border border-white/20">
              <div class="flex items-center justify-between mb-3">
                <span class="text-teal-100 text-sm font-medium flex items-center gap-1.5">
                  Tus puntos
                  <span class="group relative cursor-help">
                    <HelpCircle class="w-3.5 h-3.5 opacity-70 hover:opacity-100" />
                    <span class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-lg">
                      Acumula puntos completando encuestas y actividades
                    </span>
                  </span>
                </span>
                <div class="w-10 h-10 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Star class="w-5 h-5 text-amber-900" />
                </div>
              </div>

              <!-- Estado con puntos -->
              <template v-if="puntosUsuario > 0">
                <p class="text-4xl font-bold mb-1">{{ puntosUsuario }}</p>

                <!-- Progreso hacia meta -->
                <div v-if="siguienteRecompensa" class="mt-3">
                  <div class="flex items-center justify-between text-xs mb-1.5">
                    <span class="text-teal-100 truncate">Próxima: {{ siguienteRecompensa.nombre }}</span>
                    <span class="font-semibold">{{ progresoRecompensa }}%</span>
                  </div>
                  <div class="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div
                      class="h-full bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full transition-all duration-1000"
                      :style="{ width: `${progresoRecompensa}%` }"
                    ></div>
                  </div>
                  <p class="text-xs text-teal-100 mt-1.5">
                    Te faltan <strong class="text-white">{{ puntosParaMeta }}</strong> puntos
                  </p>
                </div>

                <button
                  @click="irARecompensas"
                  class="w-full mt-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Gift class="w-4 h-4" />
                  Ver recompensas
                </button>
              </template>

              <!-- Estado vacío: sin puntos aún -->
              <template v-else>
                <div class="text-center py-2">
                  <div class="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Trophy class="w-6 h-6 text-amber-300" />
                  </div>
                  <p class="text-2xl font-bold text-white/90 mb-1">0</p>
                  <p class="text-xs text-teal-100 mb-3">¡Comienza a ganar puntos!</p>
                </div>

                <button
                  v-if="tieneEncuestaPendiente"
                  @click="irAEncuesta"
                  class="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-amber-900 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Play class="w-4 h-4" />
                  Responder encuesta (+{{ encuestaPendiente?.puntos_base || 50 }} pts)
                </button>
                <button
                  v-else
                  @click="irAActividades"
                  class="w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Calendar class="w-4 h-4" />
                  Explorar actividades
                </button>
              </template>
            </div>
          </div>
        </div>
      </div>

      <!-- ==========================================
           ALERTA DE ENCUESTA (con sistema de urgencia)
           ========================================== -->
      <div
        v-if="tieneEncuestaPendiente"
        @click="irAEncuesta"
        class="relative rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 group overflow-hidden"
        :class="{
          'bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-300': urgenciaEncuesta === 'urgente',
          'bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-300': urgenciaEncuesta === 'pronto',
          'bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200': urgenciaEncuesta === 'normal'
        }"
      >
        <!-- Indicador de urgencia pulsante -->
        <div
          v-if="urgenciaEncuesta === 'urgente'"
          class="absolute top-4 right-4 w-3 h-3 bg-red-500 rounded-full animate-ping"
        ></div>
        <div
          v-if="urgenciaEncuesta === 'urgente'"
          class="absolute top-4 right-4 w-3 h-3 bg-red-500 rounded-full"
        ></div>

        <div class="flex items-start gap-4">
          <div
            class="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
            :class="{
              'bg-red-100': urgenciaEncuesta === 'urgente',
              'bg-amber-100': urgenciaEncuesta === 'pronto',
              'bg-indigo-100': urgenciaEncuesta === 'normal'
            }"
          >
            <FileText
              class="w-7 h-7"
              :class="{
                'text-red-600': urgenciaEncuesta === 'urgente',
                'text-amber-600': urgenciaEncuesta === 'pronto',
                'text-indigo-600': urgenciaEncuesta === 'normal'
              }"
            />
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex flex-wrap items-center gap-2 mb-1">
              <h3
                class="font-bold text-lg"
                :class="{
                  'text-red-900': urgenciaEncuesta === 'urgente',
                  'text-amber-900': urgenciaEncuesta === 'pronto',
                  'text-indigo-900': urgenciaEncuesta === 'normal'
                }"
              >
                {{ urgenciaEncuesta === 'urgente' ? '⚡ Última oportunidad' : 'Tienes una encuesta pendiente' }}
              </h3>
              <span
                class="px-2.5 py-0.5 text-xs font-bold rounded-full"
                :class="{
                  'bg-red-200 text-red-800': urgenciaEncuesta === 'urgente',
                  'bg-amber-200 text-amber-800': urgenciaEncuesta === 'pronto',
                  'bg-indigo-200 text-indigo-800': urgenciaEncuesta === 'normal'
                }"
              >
                +{{ encuestaPendiente?.puntos_base || encuestaPendiente?.puntos_recompensa || 50 }} puntos
              </span>
              <span
                v-if="tiempoRestanteEncuesta"
                class="px-2.5 py-0.5 text-xs font-medium rounded-full"
                :class="{
                  'bg-red-100 text-red-700': urgenciaEncuesta === 'urgente',
                  'bg-amber-100 text-amber-700': urgenciaEncuesta === 'pronto',
                  'bg-indigo-100 text-indigo-700': urgenciaEncuesta === 'normal'
                }"
              >
                <Clock class="w-3 h-3 inline mr-1" />
                {{ tiempoRestanteEncuesta }}
              </span>
            </div>

            <p
              class="mb-3"
              :class="{
                'text-red-700': urgenciaEncuesta === 'urgente',
                'text-amber-700': urgenciaEncuesta === 'pronto',
                'text-indigo-700': urgenciaEncuesta === 'normal'
              }"
            >
              {{ encuestaPendiente?.titulo || 'Encuesta de Bienestar' }}
            </p>

            <!-- Mensaje de privacidad -->
            <div
              class="inline-flex items-center gap-2 text-sm rounded-lg px-3 py-2"
              :class="{
                'bg-white/70 text-red-600': urgenciaEncuesta === 'urgente',
                'bg-white/70 text-amber-600': urgenciaEncuesta === 'pronto',
                'bg-white/70 text-indigo-600': urgenciaEncuesta === 'normal'
              }"
            >
              <Shield class="w-4 h-4 flex-shrink-0" />
              <span>Tus respuestas son <strong>100% anónimas</strong></span>
            </div>
          </div>

          <div
            class="flex items-center gap-2 font-semibold transition-transform group-hover:translate-x-1"
            :class="{
              'text-red-600': urgenciaEncuesta === 'urgente',
              'text-amber-600': urgenciaEncuesta === 'pronto',
              'text-indigo-600': urgenciaEncuesta === 'normal'
            }"
          >
            <span class="hidden sm:inline">Responder ahora</span>
            <ArrowRight class="w-5 h-5" />
          </div>
        </div>
      </div>

      <!-- Estado vacío: Sin encuestas -->
      <div v-else class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <CheckCircle class="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 class="font-semibold text-gray-900">¡Estás al día con las encuestas!</h3>
            <p class="text-gray-500 text-sm">Te notificaremos cuando haya una nueva encuesta disponible para ti.</p>
          </div>
        </div>
      </div>

      <!-- ==========================================
           GRID PRINCIPAL
           ========================================== -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Columna izquierda (2 cols) -->
        <div class="lg:col-span-2 space-y-6">

          <!-- ==========================================
               COMUNICADOS RECIENTES
               ========================================== -->
          <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div class="p-4 border-b border-gray-100 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-11 h-11 bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl flex items-center justify-center">
                  <Megaphone class="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <h2 class="font-semibold text-gray-900">Comunicados</h2>
                    <span
                      v-if="comunicadosNoLeidos > 0"
                      class="px-2 py-0.5 bg-orange-500 text-white text-xs font-bold rounded-full"
                    >
                      {{ comunicadosNoLeidos }} nuevo{{ comunicadosNoLeidos > 1 ? 's' : '' }}
                    </span>
                  </div>
                  <p class="text-xs text-gray-500">Novedades de {{ nombreEmpresa }}</p>
                </div>
              </div>
              <button
                @click="irAComunicados"
                class="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1 hover:gap-2 transition-all"
              >
                Ver todos <ChevronRight class="w-4 h-4" />
              </button>
            </div>

            <div v-if="comunicadosRecientes.length > 0" class="divide-y divide-gray-100">
              <div
                v-for="comunicado in comunicadosRecientes"
                :key="comunicado.id"
                @click="irAComunicados"
                class="p-4 hover:bg-gray-50 transition-colors cursor-pointer group"
              >
                <div class="flex items-start gap-3">
                  <div
                    class="w-2 h-2 mt-2 rounded-full flex-shrink-0 transition-colors"
                    :class="comunicado.leido ? 'bg-gray-200' : 'bg-teal-500'"
                  ></div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-start justify-between gap-2">
                      <h4
                        class="font-medium text-gray-900 group-hover:text-teal-600 transition-colors"
                        :class="{ 'font-semibold': !comunicado.leido }"
                      >
                        {{ comunicado.titulo }}
                      </h4>
                      <span
                        v-if="comunicado.prioridad === 'alta'"
                        class="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full flex-shrink-0"
                      >
                        Importante
                      </span>
                    </div>
                    <p class="text-sm text-gray-500 mt-1 line-clamp-2">
                      {{ comunicado.descripcion || comunicado.contenido?.substring(0, 120) + '...' }}
                    </p>
                    <p class="text-xs text-gray-400 mt-2">
                      {{ formatearFecha(comunicado.fecha_publicacion || comunicado.created_at) }}
                    </p>
                  </div>
                  <ChevronRight class="w-5 h-5 text-gray-300 group-hover:text-teal-500 transition-colors flex-shrink-0" />
                </div>
              </div>
            </div>

            <!-- Estado vacío -->
            <div v-else class="p-8 text-center">
              <div class="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Megaphone class="w-8 h-8 text-gray-400" />
              </div>
              <p class="text-gray-600 font-medium">No hay comunicados recientes</p>
              <p class="text-sm text-gray-400 mt-1">Aquí verás las novedades de {{ nombreEmpresa }}</p>
            </div>
          </div>

          <!-- ==========================================
               PRÓXIMAS ACTIVIDADES
               ========================================== -->
          <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div class="p-4 border-b border-gray-100 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-11 h-11 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                  <Calendar class="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 class="font-semibold text-gray-900">Próximas actividades</h2>
                  <p class="text-xs text-gray-500">Tus reservas y eventos</p>
                </div>
              </div>
              <button
                @click="irAActividades"
                class="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1 hover:gap-2 transition-all"
              >
                Explorar <ChevronRight class="w-4 h-4" />
              </button>
            </div>

            <div v-if="proximasReservas.length > 0" class="divide-y divide-gray-100">
              <div
                v-for="reserva in proximasReservas"
                :key="reserva.id"
                class="p-4 hover:bg-gray-50 transition-colors"
              >
                <div class="flex items-center gap-4">
                  <div class="w-14 h-14 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex flex-col items-center justify-center">
                    <span class="text-xs text-blue-600 font-medium">
                      {{ new Date(reserva.sesion?.fecha_inicio).toLocaleDateString('es-ES', { weekday: 'short' }).toUpperCase() }}
                    </span>
                    <span class="text-lg font-bold text-blue-700">
                      {{ new Date(reserva.sesion?.fecha_inicio).getDate() }}
                    </span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h4 class="font-medium text-gray-900">{{ reserva.sesion?.titulo || reserva.sesion?.servicio?.nombre || 'Sesión programada' }}</h4>
                    <div class="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-500">
                      <span class="flex items-center gap-1">
                        <Clock class="w-4 h-4" />
                        {{ formatearHora(reserva.sesion?.fecha_inicio) }}
                      </span>
                      <span v-if="reserva.sesion?.ubicacion" class="flex items-center gap-1">
                        📍 {{ reserva.sesion.ubicacion }}
                      </span>
                    </div>
                  </div>
                  <span class="px-3 py-1.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full flex items-center gap-1">
                    <CheckCircle class="w-3 h-3" />
                    Reservado
                  </span>
                </div>
              </div>
            </div>

            <!-- Estado vacío -->
            <div v-else class="p-8 text-center">
              <div class="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Calendar class="w-8 h-8 text-gray-400" />
              </div>
              <p class="text-gray-600 font-medium">No tienes actividades programadas</p>
              <p class="text-sm text-gray-400 mt-1 mb-4">Descubre eventos de bienestar disponibles</p>
              <button
                @click="irAActividades"
                class="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 text-teal-700 font-medium rounded-lg hover:bg-teal-100 transition-colors"
              >
                <Sparkles class="w-4 h-4" />
                Explorar actividades
              </button>
            </div>
          </div>
        </div>

        <!-- ==========================================
             COLUMNA DERECHA
             ========================================== -->
        <div class="space-y-6">

          <!-- Tarjeta de puntos detallada -->
          <div class="bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 border border-amber-200 rounded-2xl p-5 shadow-sm">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-semibold text-amber-900 flex items-center gap-1.5">
                Mi progreso
                <span class="group relative cursor-help">
                  <Info class="w-4 h-4 text-amber-500 opacity-70 hover:opacity-100" />
                  <span class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-lg">
                    Acumula puntos y canjéalos por recompensas
                  </span>
                </span>
              </h3>
              <div class="flex items-center gap-1">
                <Star class="w-5 h-5 text-amber-500 fill-amber-500" />
                <Star class="w-4 h-4 text-amber-400 fill-amber-400" />
                <Star class="w-3 h-3 text-amber-300 fill-amber-300" />
              </div>
            </div>

            <!-- Estado con puntos -->
            <template v-if="puntosUsuario > 0">
              <!-- Puntos grandes -->
              <div class="text-center py-3">
                <p class="text-5xl font-bold text-amber-700">{{ puntosUsuario }}</p>
                <p class="text-sm text-amber-600 mt-1">puntos acumulados</p>
              </div>

              <!-- Barra de progreso hacia meta -->
              <div v-if="siguienteRecompensa" class="mt-4 bg-white/60 rounded-xl p-4">
                <div class="flex items-center justify-between text-sm mb-2">
                  <span class="text-amber-700">
                    Próximo: <span class="font-semibold">{{ siguienteRecompensa.nombre }}</span>
                  </span>
                  <span class="font-bold text-amber-800">{{ siguienteRecompensa.costo_puntos }} pts</span>
                </div>
                <div class="h-3 bg-amber-100 rounded-full overflow-hidden">
                  <div
                    class="h-full bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full transition-all duration-1000 relative"
                    :style="{ width: `${progresoRecompensa}%` }"
                  >
                    <div class="absolute right-0 top-0 h-full w-2 bg-white/50 rounded-full"></div>
                  </div>
                </div>
                <p class="text-xs text-amber-600 mt-2 text-center">
                  <template v-if="puntosParaMeta > 0">
                    Te faltan <strong class="text-amber-800">{{ puntosParaMeta }}</strong> puntos
                  </template>
                  <template v-else>
                    <span class="text-green-600 font-semibold">¡Puedes canjear esta recompensa!</span>
                  </template>
                </p>
              </div>

              <button
                @click="irARecompensas"
                class="w-full mt-4 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-lg shadow-amber-200 flex items-center justify-center gap-2"
              >
                <Gift class="w-5 h-5" />
                Ver catálogo de recompensas
              </button>
            </template>

            <!-- Estado vacío: sin puntos aún -->
            <template v-else>
              <div class="text-center py-6">
                <div class="w-20 h-20 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                  <Trophy class="w-10 h-10 text-amber-400" />
                </div>
                <p class="text-4xl font-bold text-amber-300 mb-2">0</p>
                <p class="text-amber-700 font-medium mb-1">¡Empieza a acumular puntos!</p>
                <p class="text-sm text-amber-600">Completa encuestas y actividades para ganar recompensas</p>
              </div>

              <!-- CTA principal según estado -->
              <button
                v-if="tieneEncuestaPendiente"
                @click="irAEncuesta"
                class="w-full mt-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
              >
                <FileText class="w-5 h-5" />
                Responder encuesta (+{{ encuestaPendiente?.puntos_base || 50 }} pts)
              </button>
              <button
                v-else
                @click="irAActividades"
                class="w-full mt-4 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-lg shadow-teal-200 flex items-center justify-center gap-2"
              >
                <Calendar class="w-5 h-5" />
                Explorar actividades
              </button>
            </template>

            <!-- Cómo ganar puntos -->
            <div class="mt-4 pt-4 border-t border-amber-200">
              <p class="text-xs text-amber-700 font-semibold mb-3 flex items-center gap-1">
                <Zap class="w-3 h-3" /> Gana más puntos:
              </p>
              <div class="space-y-2 text-xs">
                <div
                  class="flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors"
                  :class="tieneEncuestaPendiente ? 'bg-indigo-50 hover:bg-indigo-100 border border-indigo-200' : 'bg-white/50'"
                  @click="tieneEncuestaPendiente && irAEncuesta()"
                >
                  <span class="flex items-center gap-2" :class="tieneEncuestaPendiente ? 'text-indigo-700' : 'text-amber-700'">
                    <FileText class="w-3 h-3" /> Completar encuesta
                    <span v-if="tieneEncuestaPendiente" class="px-1.5 py-0.5 bg-indigo-200 text-indigo-800 rounded text-[10px] font-bold">DISPONIBLE</span>
                  </span>
                  <span class="font-bold" :class="tieneEncuestaPendiente ? 'text-indigo-800' : 'text-amber-800'">+{{ encuestaPendiente?.puntos_base || 50 }}</span>
                </div>
                <div v-if="encuestaPendiente?.puntos_bonus_rapido > 0" class="flex items-center justify-between p-2 bg-white/50 rounded-lg">
                  <span class="text-amber-700 flex items-center gap-2">
                    <Clock class="w-3 h-3" /> Responder rápido ({{ encuestaPendiente?.bonus_horas_limite || 24 }}h)
                  </span>
                  <span class="font-bold text-amber-800">+{{ encuestaPendiente?.puntos_bonus_rapido }}</span>
                </div>
                <div
                  class="flex items-center justify-between p-2 bg-white/50 rounded-lg cursor-pointer hover:bg-white/70 transition-colors"
                  @click="irAActividades"
                >
                  <span class="text-amber-700 flex items-center gap-2">
                    <Calendar class="w-3 h-3" /> Asistir a actividad
                  </span>
                  <span class="font-bold text-amber-800">+75</span>
                </div>
              </div>
            </div>

            <!-- Mensaje de privacidad -->
            <div class="mt-4 flex items-center gap-2 text-xs text-amber-600 bg-white/40 rounded-lg p-2">
              <Lock class="w-3 h-3 flex-shrink-0" />
              <span>Tu saldo es privado. Solo tú puedes verlo.</span>
            </div>
          </div>

          <!-- Accesos rápidos -->
          <div class="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <h3 class="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Zap class="w-4 h-4 text-teal-600" />
              Accesos rápidos
            </h3>
            <div class="space-y-2">
              <button
                @click="irAEncuesta"
                class="w-full flex items-center gap-3 p-3 rounded-xl text-left hover:bg-indigo-50 transition-colors group"
              >
                <div class="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                  <FileText class="w-5 h-5 text-indigo-600" />
                </div>
                <div class="flex-1">
                  <p class="font-medium text-gray-900 group-hover:text-indigo-700">Encuestas</p>
                  <p class="text-xs text-gray-500">Comparte tu opinión</p>
                </div>
                <ChevronRight class="w-5 h-5 text-gray-300 group-hover:text-indigo-500 transition-colors" />
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
                @click="irAActividades"
                class="w-full flex items-center gap-3 p-3 rounded-xl text-left hover:bg-teal-50 transition-colors group"
              >
                <div class="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center group-hover:bg-teal-200 transition-colors">
                  <Calendar class="w-5 h-5 text-teal-600" />
                </div>
                <div class="flex-1">
                  <p class="font-medium text-gray-900 group-hover:text-teal-700">Actividades</p>
                  <p class="text-xs text-gray-500">Eventos y talleres</p>
                </div>
                <ChevronRight class="w-5 h-5 text-gray-300 group-hover:text-teal-500 transition-colors" />
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
                <h4 class="font-semibold text-gray-900 text-sm">Tu privacidad está protegida</h4>
                <p class="text-xs text-gray-600 mt-1 leading-relaxed">
                  Tus respuestas a encuestas son <strong>anónimas</strong>.
                  Solo ves información de <strong>{{ nombreEmpresa }}</strong> y nunca datos de otros empleados.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ==========================================
           TIP DE BIENESTAR (rotativo)
           ========================================== -->
      <div
        v-if="tipActual"
        class="rounded-2xl p-5 shadow-sm transition-colors duration-500"
        :class="{
          'bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200': tipActual.color === 'purple',
          'bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200': tipActual.color === 'blue',
          'bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200': tipActual.color === 'pink',
          'bg-gradient-to-r from-cyan-50 to-teal-50 border border-cyan-200': tipActual.color === 'cyan',
          'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200': tipActual.color === 'green',
          'bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200': tipActual.color === 'amber',
          'bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-200': tipActual.color === 'indigo',
          'bg-gradient-to-r from-slate-50 to-gray-100 border border-slate-200': tipActual.color === 'slate'
        }"
      >
        <div class="flex items-start gap-4">
          <div
            class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
            :class="{
              'bg-purple-100': tipActual.color === 'purple',
              'bg-blue-100': tipActual.color === 'blue',
              'bg-pink-100': tipActual.color === 'pink',
              'bg-cyan-100': tipActual.color === 'cyan',
              'bg-green-100': tipActual.color === 'green',
              'bg-amber-100': tipActual.color === 'amber',
              'bg-indigo-100': tipActual.color === 'indigo',
              'bg-slate-100': tipActual.color === 'slate'
            }"
          >
            {{ tipActual.icono }}
          </div>
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <span
                class="text-xs font-semibold px-2 py-0.5 rounded-full"
                :class="{
                  'bg-purple-200 text-purple-700': tipActual.color === 'purple',
                  'bg-blue-200 text-blue-700': tipActual.color === 'blue',
                  'bg-pink-200 text-pink-700': tipActual.color === 'pink',
                  'bg-cyan-200 text-cyan-700': tipActual.color === 'cyan',
                  'bg-green-200 text-green-700': tipActual.color === 'green',
                  'bg-amber-200 text-amber-700': tipActual.color === 'amber',
                  'bg-indigo-200 text-indigo-700': tipActual.color === 'indigo',
                  'bg-slate-200 text-slate-700': tipActual.color === 'slate'
                }"
              >
                {{ tipActual.categoria }}
              </span>
              <Lightbulb
                class="w-4 h-4"
                :class="{
                  'text-purple-500': tipActual.color === 'purple',
                  'text-blue-500': tipActual.color === 'blue',
                  'text-pink-500': tipActual.color === 'pink',
                  'text-cyan-500': tipActual.color === 'cyan',
                  'text-green-500': tipActual.color === 'green',
                  'text-amber-500': tipActual.color === 'amber',
                  'text-indigo-500': tipActual.color === 'indigo',
                  'text-slate-500': tipActual.color === 'slate'
                }"
              />
            </div>
            <h3
              class="font-bold text-lg"
              :class="{
                'text-purple-900': tipActual.color === 'purple',
                'text-blue-900': tipActual.color === 'blue',
                'text-pink-900': tipActual.color === 'pink',
                'text-cyan-900': tipActual.color === 'cyan',
                'text-green-900': tipActual.color === 'green',
                'text-amber-900': tipActual.color === 'amber',
                'text-indigo-900': tipActual.color === 'indigo',
                'text-slate-900': tipActual.color === 'slate'
              }"
            >
              {{ tipActual.titulo }}
            </h3>
            <p
              class="mt-1"
              :class="{
                'text-purple-700': tipActual.color === 'purple',
                'text-blue-700': tipActual.color === 'blue',
                'text-pink-700': tipActual.color === 'pink',
                'text-cyan-700': tipActual.color === 'cyan',
                'text-green-700': tipActual.color === 'green',
                'text-amber-700': tipActual.color === 'amber',
                'text-indigo-700': tipActual.color === 'indigo',
                'text-slate-700': tipActual.color === 'slate'
              }"
            >
              {{ tipActual.texto }}
            </p>
          </div>
          <button
            @click="siguienteTip"
            class="p-2 rounded-lg transition-colors flex-shrink-0"
            :class="{
              'hover:bg-purple-100 text-purple-500': tipActual.color === 'purple',
              'hover:bg-blue-100 text-blue-500': tipActual.color === 'blue',
              'hover:bg-pink-100 text-pink-500': tipActual.color === 'pink',
              'hover:bg-cyan-100 text-cyan-500': tipActual.color === 'cyan',
              'hover:bg-green-100 text-green-500': tipActual.color === 'green',
              'hover:bg-amber-100 text-amber-500': tipActual.color === 'amber',
              'hover:bg-indigo-100 text-indigo-500': tipActual.color === 'indigo',
              'hover:bg-slate-100 text-slate-500': tipActual.color === 'slate'
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
            :style="{ color: tipActual.color === 'purple' ? '#9333ea' : tipActual.color === 'blue' ? '#2563eb' : tipActual.color === 'pink' ? '#db2777' : tipActual.color === 'cyan' ? '#0891b2' : tipActual.color === 'green' ? '#16a34a' : tipActual.color === 'amber' ? '#d97706' : tipActual.color === 'indigo' ? '#4f46e5' : '#475569' }"
          ></button>
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

/* Animación suave para cambio de tips */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
