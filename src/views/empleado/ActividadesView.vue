<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import {
  Calendar, Clock, MapPin, Users, Sparkles, Heart,
  Dumbbell, Brain, Music, Coffee, Star, ChevronRight,
  CalendarCheck, AlertCircle, Loader2, X, Check,
  Shield, Filter, RefreshCw, Bookmark, Zap
} from 'lucide-vue-next';
import { useReservasStore } from '@/stores/reservas.store.js';
import { sesionesService, reservasService } from '@/services/servicios.service.js';
import { useAuthStore } from '@/stores/auth.store.js';

// --- Stores ---
const reservasStore = useReservasStore();
const authStore = useAuthStore();

// --- Estado Reactivo ---
const sesionesDisponibles = ref([]);
const misReservas = ref([]);
const isLoading = ref(true);
const filtroActivo = ref('todos');
const mostrarModalConfirmacion = ref(false);
const sesionSeleccionada = ref(null);
const procesandoReserva = ref(false);
const reservaExitosa = ref(false);
const errorReserva = ref(null);
const tipIndex = ref(0);

// --- Tips rotativos ---
const tips = [
  {
    icon: Brain,
    titulo: 'Mindfulness reduce el estrés',
    texto: 'Solo 10 minutos de meditación al día pueden reducir la ansiedad hasta un 39%.'
  },
  {
    icon: Dumbbell,
    titulo: 'Ejercicio y productividad',
    texto: 'Los empleados activos son un 23% más productivos y reportan mayor satisfacción laboral.'
  },
  {
    icon: Heart,
    titulo: 'Conexión social',
    texto: 'Participar en actividades grupales fortalece el sentido de pertenencia y reduce el burnout.'
  },
  {
    icon: Coffee,
    titulo: 'Pausas activas',
    texto: 'Pequeñas pausas cada 90 minutos mejoran la concentración y creatividad.'
  }
];

// --- Tipos de actividad con iconos ---
const tiposActividad = {
  mindfulness: { icon: Brain, color: 'from-purple-500 to-indigo-600', bg: 'bg-purple-50', text: 'text-purple-700' },
  yoga: { icon: Sparkles, color: 'from-teal-500 to-emerald-600', bg: 'bg-teal-50', text: 'text-teal-700' },
  fitness: { icon: Dumbbell, color: 'from-orange-500 to-red-600', bg: 'bg-orange-50', text: 'text-orange-700' },
  nutricion: { icon: Coffee, color: 'from-green-500 to-lime-600', bg: 'bg-green-50', text: 'text-green-700' },
  musica: { icon: Music, color: 'from-pink-500 to-rose-600', bg: 'bg-pink-50', text: 'text-pink-700' },
  bienestar: { icon: Heart, color: 'from-red-500 to-pink-600', bg: 'bg-red-50', text: 'text-red-700' },
  default: { icon: Star, color: 'from-blue-500 to-cyan-600', bg: 'bg-blue-50', text: 'text-blue-700' }
};

// --- Filtros disponibles ---
const filtros = [
  { id: 'todos', label: 'Todas', icon: Calendar },
  { id: 'hoy', label: 'Hoy', icon: Clock },
  { id: 'semana', label: 'Esta semana', icon: CalendarCheck },
  { id: 'mindfulness', label: 'Mindfulness', icon: Brain },
  { id: 'fitness', label: 'Fitness', icon: Dumbbell }
];

// --- Computed ---
const tieneActividades = computed(() => sesionesDisponibles.value.length > 0);

const sesionesFiltradas = computed(() => {
  let sesiones = [...sesionesDisponibles.value];
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const finSemana = new Date(hoy);
  finSemana.setDate(finSemana.getDate() + 7);

  switch (filtroActivo.value) {
    case 'hoy':
      sesiones = sesiones.filter(s => {
        const fecha = new Date(s.fecha_inicio);
        return fecha.toDateString() === hoy.toDateString();
      });
      break;
    case 'semana':
      sesiones = sesiones.filter(s => {
        const fecha = new Date(s.fecha_inicio);
        return fecha >= hoy && fecha <= finSemana;
      });
      break;
    case 'mindfulness':
      sesiones = sesiones.filter(s =>
        getTipoActividad(s).toLowerCase().includes('mindfulness') ||
        getTipoActividad(s).toLowerCase().includes('meditacion') ||
        getTipoActividad(s).toLowerCase().includes('yoga')
      );
      break;
    case 'fitness':
      sesiones = sesiones.filter(s =>
        getTipoActividad(s).toLowerCase().includes('fitness') ||
        getTipoActividad(s).toLowerCase().includes('ejercicio') ||
        getTipoActividad(s).toLowerCase().includes('deporte')
      );
      break;
  }

  return sesiones;
});

const sesionDestacada = computed(() => {
  if (!sesionesFiltradas.value.length) return null;

  // Priorizar: cupo limitado (<5) o la más próxima
  const cupoLimitado = sesionesFiltradas.value.find(s =>
    s.cupo_disponible > 0 && s.cupo_disponible <= 5
  );

  if (cupoLimitado) return cupoLimitado;

  return sesionesFiltradas.value[0];
});

const otrasActividades = computed(() => {
  if (!sesionDestacada.value) return sesionesFiltradas.value;
  return sesionesFiltradas.value.filter(s => s.id !== sesionDestacada.value.id);
});

const misReservasActivas = computed(() => {
  return misReservas.value.filter(r =>
    r.estado === 'confirmada' &&
    new Date(r.sesion?.fecha_inicio) > new Date()
  );
});

const tipActual = computed(() => tips[tipIndex.value]);

// --- Funciones de utilidad ---
const getTipoActividad = (sesion) => {
  return sesion.servicio?.categoria || sesion.servicio?.nombre || 'bienestar';
};

const getConfigTipo = (sesion) => {
  const tipo = getTipoActividad(sesion).toLowerCase();

  if (tipo.includes('mindfulness') || tipo.includes('meditacion')) return tiposActividad.mindfulness;
  if (tipo.includes('yoga')) return tiposActividad.yoga;
  if (tipo.includes('fitness') || tipo.includes('ejercicio') || tipo.includes('deporte')) return tiposActividad.fitness;
  if (tipo.includes('nutricion') || tipo.includes('alimentacion')) return tiposActividad.nutricion;
  if (tipo.includes('musica')) return tiposActividad.musica;
  if (tipo.includes('bienestar') || tipo.includes('salud')) return tiposActividad.bienestar;

  return tiposActividad.default;
};

const formatFecha = (fecha) => {
  const date = new Date(fecha);
  const hoy = new Date();
  const mañana = new Date(hoy);
  mañana.setDate(mañana.getDate() + 1);

  if (date.toDateString() === hoy.toDateString()) {
    return 'Hoy';
  } else if (date.toDateString() === mañana.toDateString()) {
    return 'Mañana';
  }

  return date.toLocaleDateString('es-ES', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  });
};

const formatHora = (fecha) => {
  return new Date(fecha).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getUrgenciaBadge = (sesion) => {
  const cupo = sesion.cupo_disponible || 0;
  const fecha = new Date(sesion.fecha_inicio);
  const hoy = new Date();
  const diffHoras = (fecha - hoy) / (1000 * 60 * 60);

  if (cupo === 0) return { tipo: 'agotado', texto: 'Completo', color: 'bg-gray-100 text-gray-600' };
  if (cupo <= 3) return { tipo: 'urgente', texto: `¡Solo ${cupo} plaza${cupo > 1 ? 's' : ''}!`, color: 'bg-red-100 text-red-700' };
  if (cupo <= 5) return { tipo: 'limitado', texto: 'Plazas limitadas', color: 'bg-amber-100 text-amber-700' };
  if (diffHoras <= 24) return { tipo: 'pronto', texto: 'Muy pronto', color: 'bg-blue-100 text-blue-700' };

  return null;
};

const yaReservado = (sesionId) => {
  return misReservas.value.some(r =>
    r.sesion_id === sesionId && r.estado === 'confirmada'
  );
};

// --- Carga de Datos ---
const cargarDatos = async () => {
  isLoading.value = true;
  try {
    const empleadoId = authStore.empleado?.id;

    // Cargar sesiones disponibles
    sesionesDisponibles.value = await sesionesService.getProximas();

    // Cargar mis reservas si está autenticado
    if (empleadoId) {
      misReservas.value = await reservasService.getByEmpleado(empleadoId);
    }
  } catch (error) {
    console.error("Error al cargar datos:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  cargarDatos();

  // Rotar tips cada 8 segundos
  setInterval(() => {
    tipIndex.value = (tipIndex.value + 1) % tips.length;
  }, 8000);
});

// --- Lógica de Reserva ---
const abrirModalReserva = (sesion) => {
  sesionSeleccionada.value = sesion;
  mostrarModalConfirmacion.value = true;
  reservaExitosa.value = false;
  errorReserva.value = null;
};

const cerrarModal = () => {
  mostrarModalConfirmacion.value = false;
  sesionSeleccionada.value = null;
  reservaExitosa.value = false;
  errorReserva.value = null;
};

const confirmarReserva = async () => {
  const empleadoId = authStore.empleado?.id;
  if (!empleadoId || !sesionSeleccionada.value) return;

  procesandoReserva.value = true;
  errorReserva.value = null;

  try {
    await reservasService.crear(empleadoId, sesionSeleccionada.value.id);
    reservaExitosa.value = true;

    // Recargar datos después de un breve delay para mostrar la animación
    setTimeout(async () => {
      await cargarDatos();
      setTimeout(cerrarModal, 1500);
    }, 500);
  } catch (error) {
    console.error('Error al crear reserva:', error);
    errorReserva.value = error.message || 'Error al crear la reserva. Inténtalo de nuevo.';
  } finally {
    procesandoReserva.value = false;
  }
};

const cancelarReserva = async (reservaId) => {
  if (!confirm('¿Estás seguro de que deseas cancelar esta reserva?')) return;

  try {
    await reservasService.cancelar(reservaId);
    await cargarDatos();
  } catch (error) {
    console.error('Error al cancelar reserva:', error);
    alert('Error al cancelar la reserva');
  }
};
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 -m-6 p-6">
    <!-- Header -->
    <header class="mb-8">
      <div class="flex items-center gap-3 mb-2">
        <div class="p-2 bg-gradient-to-br from-primary to-primary-dark rounded-xl">
          <Calendar class="w-6 h-6 text-white" />
        </div>
        <h1 class="text-2xl md:text-3xl font-bold text-gray-900">
          Actividades de Bienestar
        </h1>
      </div>
      <p class="text-gray-600">
        Cuida tu bienestar participando en nuestras actividades. Tu salud es nuestra prioridad.
      </p>
    </header>

    <!-- Estado de carga -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-20">
      <Loader2 class="w-12 h-12 text-primary animate-spin mb-4" />
      <p class="text-gray-600">Cargando actividades disponibles...</p>
    </div>

    <!-- Estado vacío -->
    <div v-else-if="!tieneActividades" class="max-w-2xl mx-auto">
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <!-- Ilustración -->
        <div class="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
          <Calendar class="w-12 h-12 text-primary" />
        </div>

        <h2 class="text-xl font-semibold text-gray-900 mb-2">
          No hay actividades programadas
        </h2>
        <p class="text-gray-600 mb-6">
          Actualmente no hay sesiones disponibles, pero tu empresa está trabajando en nuevas actividades para ti.
        </p>

        <!-- Tip del día -->
        <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-6 text-left transition-all duration-500">
          <div class="flex items-start gap-3">
            <div class="p-2 bg-white rounded-lg shadow-sm">
              <component :is="tipActual.icon" class="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 class="font-medium text-gray-900 text-sm">{{ tipActual.titulo }}</h3>
              <p class="text-gray-600 text-sm mt-1">{{ tipActual.texto }}</p>
            </div>
          </div>
        </div>

        <!-- Acciones alternativas -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <router-link
            to="/empleado/apoyo-personal"
            class="flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-gray-700"
          >
            <Heart class="w-5 h-5" />
            <span>Apoyo Personal</span>
          </router-link>
          <router-link
            to="/empleado/recompensas"
            class="flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-gray-700"
          >
            <Star class="w-5 h-5" />
            <span>Mis Recompensas</span>
          </router-link>
        </div>
      </div>

      <!-- Mensaje de privacidad -->
      <div class="mt-6 flex items-start gap-2 text-sm text-gray-500 bg-white/60 rounded-lg p-3">
        <Shield class="w-4 h-4 mt-0.5 flex-shrink-0" />
        <p>Tu participación en actividades es completamente confidencial. Solo tú puedes ver tus reservas.</p>
      </div>
    </div>

    <!-- Estado con actividades -->
    <div v-else class="space-y-6">
      <!-- Mis reservas activas -->
      <div v-if="misReservasActivas.length > 0" class="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-5 text-white">
        <div class="flex items-center gap-2 mb-3">
          <CalendarCheck class="w-5 h-5" />
          <h2 class="font-semibold">Mis próximas reservas</h2>
          <span class="ml-auto bg-white/20 px-2 py-0.5 rounded-full text-sm">
            {{ misReservasActivas.length }}
          </span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div
            v-for="reserva in misReservasActivas.slice(0, 3)"
            :key="reserva.id"
            class="bg-white/10 backdrop-blur rounded-xl p-3"
          >
            <p class="font-medium truncate">{{ reserva.sesion?.servicio?.nombre || 'Actividad' }}</p>
            <div class="flex items-center gap-2 text-sm text-white/80 mt-1">
              <Calendar class="w-4 h-4" />
              <span>{{ formatFecha(reserva.sesion?.fecha_inicio) }}</span>
              <Clock class="w-4 h-4 ml-2" />
              <span>{{ formatHora(reserva.sesion?.fecha_inicio) }}</span>
            </div>
            <button
              @click="cancelarReserva(reserva.id)"
              class="mt-2 text-xs text-white/70 hover:text-white underline"
            >
              Cancelar reserva
            </button>
          </div>
        </div>
      </div>

      <!-- Filtros -->
      <div class="flex items-center gap-2 overflow-x-auto pb-2">
        <Filter class="w-4 h-4 text-gray-400 flex-shrink-0" />
        <button
          v-for="filtro in filtros"
          :key="filtro.id"
          @click="filtroActivo = filtro.id"
          :class="[
            'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap',
            filtroActivo === filtro.id
              ? 'bg-primary text-white shadow-sm'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          ]"
        >
          <component :is="filtro.icon" class="w-4 h-4" />
          {{ filtro.label }}
        </button>
        <button
          @click="cargarDatos"
          class="ml-auto p-2 text-gray-400 hover:text-gray-600 transition-colors"
          title="Actualizar"
        >
          <RefreshCw class="w-4 h-4" />
        </button>
      </div>

      <!-- Sin resultados para el filtro -->
      <div v-if="sesionesFiltradas.length === 0" class="bg-white rounded-xl p-8 text-center">
        <Calendar class="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p class="text-gray-600">No hay actividades para el filtro seleccionado.</p>
        <button
          @click="filtroActivo = 'todos'"
          class="mt-3 text-primary hover:underline text-sm"
        >
          Ver todas las actividades
        </button>
      </div>

      <template v-else>
        <!-- Actividad destacada -->
        <div v-if="sesionDestacada" class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div :class="['h-2 bg-gradient-to-r', getConfigTipo(sesionDestacada).color]"></div>
          <div class="p-5">
            <div class="flex items-start justify-between gap-4">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <span class="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-medium flex items-center gap-1">
                    <Zap class="w-3 h-3" />
                    Destacada
                  </span>
                  <span
                    v-if="getUrgenciaBadge(sesionDestacada)"
                    :class="['px-2 py-0.5 rounded-full text-xs font-medium', getUrgenciaBadge(sesionDestacada).color]"
                  >
                    {{ getUrgenciaBadge(sesionDestacada).texto }}
                  </span>
                </div>
                <h3 class="text-xl font-semibold text-gray-900 mb-2">
                  {{ sesionDestacada.servicio?.nombre || 'Actividad' }}
                </h3>
                <p v-if="sesionDestacada.servicio?.descripcion" class="text-gray-600 text-sm mb-4 line-clamp-2">
                  {{ sesionDestacada.servicio.descripcion }}
                </p>
                <div class="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <span class="flex items-center gap-1.5">
                    <Calendar class="w-4 h-4 text-gray-400" />
                    {{ formatFecha(sesionDestacada.fecha_inicio) }}
                  </span>
                  <span class="flex items-center gap-1.5">
                    <Clock class="w-4 h-4 text-gray-400" />
                    {{ formatHora(sesionDestacada.fecha_inicio) }}
                  </span>
                  <span v-if="sesionDestacada.ubicacion" class="flex items-center gap-1.5">
                    <MapPin class="w-4 h-4 text-gray-400" />
                    {{ sesionDestacada.ubicacion }}
                  </span>
                  <span class="flex items-center gap-1.5">
                    <Users class="w-4 h-4 text-gray-400" />
                    {{ sesionDestacada.cupo_disponible || 0 }} plazas
                  </span>
                </div>
              </div>
              <div :class="['p-3 rounded-xl', getConfigTipo(sesionDestacada).bg]">
                <component
                  :is="getConfigTipo(sesionDestacada).icon"
                  :class="['w-8 h-8', getConfigTipo(sesionDestacada).text]"
                />
              </div>
            </div>
            <div class="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
              <span v-if="yaReservado(sesionDestacada.id)" class="flex items-center gap-1.5 text-emerald-600 font-medium">
                <Check class="w-5 h-5" />
                Ya tienes reserva
              </span>
              <button
                v-else
                @click="abrirModalReserva(sesionDestacada)"
                :disabled="!sesionDestacada.cupo_disponible || sesionDestacada.cupo_disponible <= 0"
                :class="[
                  'flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all',
                  sesionDestacada.cupo_disponible > 0
                    ? 'bg-gradient-to-r from-primary to-primary-dark text-white hover:shadow-lg hover:shadow-primary/25'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                ]"
              >
                <Bookmark class="w-4 h-4" />
                Reservar mi plaza
              </button>
            </div>
          </div>
        </div>

        <!-- Grid de otras actividades -->
        <div v-if="otrasActividades.length > 0">
          <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar class="w-5 h-5 text-gray-400" />
            Más actividades
            <span class="text-sm font-normal text-gray-500">({{ otrasActividades.length }})</span>
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="sesion in otrasActividades"
              :key="sesion.id"
              class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div :class="['h-1 bg-gradient-to-r', getConfigTipo(sesion).color]"></div>
              <div class="p-4">
                <div class="flex items-start justify-between gap-3 mb-3">
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1">
                      <span
                        v-if="getUrgenciaBadge(sesion)"
                        :class="['px-2 py-0.5 rounded-full text-xs font-medium', getUrgenciaBadge(sesion).color]"
                      >
                        {{ getUrgenciaBadge(sesion).texto }}
                      </span>
                    </div>
                    <h3 class="font-semibold text-gray-900 truncate">
                      {{ sesion.servicio?.nombre || 'Actividad' }}
                    </h3>
                  </div>
                  <div :class="['p-2 rounded-lg flex-shrink-0', getConfigTipo(sesion).bg]">
                    <component
                      :is="getConfigTipo(sesion).icon"
                      :class="['w-5 h-5', getConfigTipo(sesion).text]"
                    />
                  </div>
                </div>

                <div class="space-y-1.5 text-sm text-gray-600 mb-4">
                  <div class="flex items-center gap-2">
                    <Calendar class="w-4 h-4 text-gray-400" />
                    <span>{{ formatFecha(sesion.fecha_inicio) }}</span>
                    <span class="text-gray-300">|</span>
                    <Clock class="w-4 h-4 text-gray-400" />
                    <span>{{ formatHora(sesion.fecha_inicio) }}</span>
                  </div>
                  <div v-if="sesion.ubicacion" class="flex items-center gap-2">
                    <MapPin class="w-4 h-4 text-gray-400" />
                    <span class="truncate">{{ sesion.ubicacion }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <Users class="w-4 h-4 text-gray-400" />
                    <span>{{ sesion.cupo_disponible || 0 }} plazas disponibles</span>
                  </div>
                </div>

                <div v-if="yaReservado(sesion.id)" class="flex items-center justify-center gap-1.5 text-emerald-600 font-medium py-2">
                  <Check class="w-4 h-4" />
                  Reservado
                </div>
                <button
                  v-else
                  @click="abrirModalReserva(sesion)"
                  :disabled="!sesion.cupo_disponible || sesion.cupo_disponible <= 0"
                  :class="[
                    'w-full py-2 rounded-lg font-medium transition-all text-sm',
                    sesion.cupo_disponible > 0
                      ? 'bg-primary/10 text-primary hover:bg-primary hover:text-white'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  ]"
                >
                  {{ sesion.cupo_disponible > 0 ? 'Reservar plaza' : 'Sin plazas' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- Mensaje de privacidad -->
      <div class="flex items-start gap-2 text-sm text-gray-500 bg-white/60 rounded-lg p-3 mt-6">
        <Shield class="w-4 h-4 mt-0.5 flex-shrink-0" />
        <p>Tu participación en actividades es completamente confidencial. Solo tú puedes ver tus reservas y asistencia.</p>
      </div>
    </div>

    <!-- Modal de confirmación -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="mostrarModalConfirmacion"
          class="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div class="absolute inset-0 bg-black/50" @click="cerrarModal"></div>
          <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <!-- Estado de éxito -->
            <div v-if="reservaExitosa" class="p-8 text-center">
              <div class="w-16 h-16 mx-auto mb-4 bg-emerald-100 rounded-full flex items-center justify-center animate-bounce">
                <Check class="w-8 h-8 text-emerald-600" />
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">¡Reserva confirmada!</h3>
              <p class="text-gray-600">Tu plaza está asegurada. Te esperamos.</p>
            </div>

            <!-- Formulario de confirmación -->
            <template v-else>
              <div class="p-6">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-lg font-semibold text-gray-900">Confirmar reserva</h3>
                  <button @click="cerrarModal" class="p-1 text-gray-400 hover:text-gray-600">
                    <X class="w-5 h-5" />
                  </button>
                </div>

                <div v-if="sesionSeleccionada" class="bg-gray-50 rounded-xl p-4 mb-4">
                  <div class="flex items-start gap-3">
                    <div :class="['p-2 rounded-lg', getConfigTipo(sesionSeleccionada).bg]">
                      <component
                        :is="getConfigTipo(sesionSeleccionada).icon"
                        :class="['w-5 h-5', getConfigTipo(sesionSeleccionada).text]"
                      />
                    </div>
                    <div>
                      <h4 class="font-medium text-gray-900">
                        {{ sesionSeleccionada.servicio?.nombre || 'Actividad' }}
                      </h4>
                      <div class="text-sm text-gray-600 mt-1 space-y-1">
                        <p class="flex items-center gap-1.5">
                          <Calendar class="w-4 h-4" />
                          {{ formatFecha(sesionSeleccionada.fecha_inicio) }} a las {{ formatHora(sesionSeleccionada.fecha_inicio) }}
                        </p>
                        <p v-if="sesionSeleccionada.ubicacion" class="flex items-center gap-1.5">
                          <MapPin class="w-4 h-4" />
                          {{ sesionSeleccionada.ubicacion }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Error -->
                <div v-if="errorReserva" class="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm flex items-start gap-2">
                  <AlertCircle class="w-4 h-4 mt-0.5 flex-shrink-0" />
                  {{ errorReserva }}
                </div>

                <p class="text-sm text-gray-600 mb-4">
                  Al confirmar, reservarás una plaza en esta actividad. Recibirás un recordatorio antes de la sesión.
                </p>

                <div class="flex gap-3">
                  <button
                    @click="cerrarModal"
                    class="flex-1 py-2.5 px-4 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    @click="confirmarReserva"
                    :disabled="procesandoReserva"
                    class="flex-1 py-2.5 px-4 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl font-medium hover:shadow-lg hover:shadow-primary/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Loader2 v-if="procesandoReserva" class="w-4 h-4 animate-spin" />
                    <span>{{ procesandoReserva ? 'Reservando...' : 'Confirmar reserva' }}</span>
                  </button>
                </div>
              </div>
            </template>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95) translateY(10px);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
