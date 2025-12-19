<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import {
  Megaphone,
  Bell,
  CheckCircle,
  Clock,
  ChevronRight,
  ChevronLeft,
  Shield,
  Star,
  AlertCircle,
  Info,
  Calendar,
  User,
  Eye,
  EyeOff,
  Filter,
  X,
  ArrowLeft,
  Sparkles,
  MessageSquare,
  FileText,
  Gift,
  Heart,
  TrendingUp,
  Zap,
  RefreshCw,
  Lock,
  ExternalLink,
  BookOpen
} from 'lucide-vue-next';

// Stores y servicios
import { useAuthStore } from '@/stores/auth.store.js';
import { comunicadosService } from '@/services/comunicados.service.js';

const router = useRouter();
const authStore = useAuthStore();
const { user, empleado } = storeToRefs(authStore);

// Estado local
const loading = ref(true);
const error = ref(null);
const comunicados = ref([]);
const comunicadoSeleccionado = ref(null);
const vistaDetalle = ref(false);
const filtroActivo = ref('todos');
const marcandoLeido = ref(false);

// Tipos de comunicados con iconos y colores
const tiposComunicado = {
  general: { nombre: 'General', icono: Megaphone, color: 'blue', bgColor: 'bg-blue-100', textColor: 'text-blue-600' },
  importante: { nombre: 'Importante', icono: AlertCircle, color: 'red', bgColor: 'bg-red-100', textColor: 'text-red-600' },
  bienestar: { nombre: 'Bienestar', icono: Heart, color: 'pink', bgColor: 'bg-pink-100', textColor: 'text-pink-600' },
  eventos: { nombre: 'Eventos', icono: Calendar, color: 'purple', bgColor: 'bg-purple-100', textColor: 'text-purple-600' },
  encuestas: { nombre: 'Encuestas', icono: FileText, color: 'indigo', bgColor: 'bg-indigo-100', textColor: 'text-indigo-600' },
  reconocimiento: { nombre: 'Reconocimiento', icono: Star, color: 'amber', bgColor: 'bg-amber-100', textColor: 'text-amber-600' },
  rrhh: { nombre: 'RRHH', icono: User, color: 'teal', bgColor: 'bg-teal-100', textColor: 'text-teal-600' },
  noticias: { nombre: 'Noticias', icono: BookOpen, color: 'green', bgColor: 'bg-green-100', textColor: 'text-green-600' }
};

// Opciones de filtro
const opcionesFiltro = [
  { value: 'todos', label: 'Todos', icono: Megaphone },
  { value: 'no_leidos', label: 'No leídos', icono: Bell },
  { value: 'importante', label: 'Importantes', icono: AlertCircle },
  { value: 'bienestar', label: 'Bienestar', icono: Heart },
  { value: 'eventos', label: 'Eventos', icono: Calendar }
];

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

// Comunicados filtrados
const comunicadosFiltrados = computed(() => {
  let resultado = comunicados.value;

  if (filtroActivo.value === 'no_leidos') {
    resultado = resultado.filter(c => !c.leido);
  } else if (filtroActivo.value !== 'todos') {
    resultado = resultado.filter(c => c.tipo === filtroActivo.value);
  }

  return resultado;
});

// Comunicado destacado (el más reciente importante o no leído)
const comunicadoDestacado = computed(() => {
  // Priorizar: importante no leído > cualquier no leído > importante leído
  const importanteNoLeido = comunicados.value.find(c => c.prioridad === 'alta' && !c.leido);
  if (importanteNoLeido) return importanteNoLeido;

  const cualquierNoLeido = comunicados.value.find(c => !c.leido);
  if (cualquierNoLeido) return cualquierNoLeido;

  return comunicados.value.find(c => c.prioridad === 'alta');
});

// Comunicados para la lista (excluyendo el destacado si existe)
const comunicadosLista = computed(() => {
  if (!comunicadoDestacado.value) return comunicadosFiltrados.value;
  return comunicadosFiltrados.value.filter(c => c.id !== comunicadoDestacado.value.id);
});

// Contadores
const conteoNoLeidos = computed(() => comunicados.value.filter(c => !c.leido).length);
const conteoTotal = computed(() => comunicados.value.length);

// Obtener configuración de tipo
const getTipoConfig = (tipo) => {
  return tiposComunicado[tipo] || tiposComunicado.general;
};

// ==========================================
// CARGAR DATOS
// ==========================================
const cargarComunicados = async () => {
  loading.value = true;
  error.value = null;

  try {
    comunicados.value = await comunicadosService.getMisComunicados();
  } catch (err) {
    console.error('Error cargando comunicados:', err);
    error.value = err.message || 'Error al cargar los comunicados';
  } finally {
    loading.value = false;
  }
};

onMounted(cargarComunicados);

// ==========================================
// ACCIONES
// ==========================================
const abrirComunicado = async (comunicado) => {
  comunicadoSeleccionado.value = comunicado;
  vistaDetalle.value = true;

  // Marcar como leído si no lo está
  if (!comunicado.leido) {
    await marcarComoLeido(comunicado);
  }
};

const cerrarDetalle = () => {
  vistaDetalle.value = false;
  comunicadoSeleccionado.value = null;
};

const marcarComoLeido = async (comunicado) => {
  if (comunicado.leido || marcandoLeido.value) return;

  marcandoLeido.value = true;
  try {
    await comunicadosService.marcarComoLeidoEmpleado(comunicado.id);

    // Actualizar estado local
    const index = comunicados.value.findIndex(c => c.id === comunicado.id);
    if (index !== -1) {
      comunicados.value[index].leido = true;
    }
    if (comunicadoSeleccionado.value?.id === comunicado.id) {
      comunicadoSeleccionado.value.leido = true;
    }
  } catch (err) {
    console.error('Error marcando como leído:', err);
  } finally {
    marcandoLeido.value = false;
  }
};

const marcarTodosLeidos = async () => {
  const noLeidos = comunicados.value.filter(c => !c.leido);

  for (const comunicado of noLeidos) {
    try {
      await comunicadosService.marcarComoLeidoEmpleado(comunicado.id);
      comunicado.leido = true;
    } catch (err) {
      console.error('Error marcando como leído:', err);
    }
  }
};

// Navegación
const irADashboard = () => router.push('/empleado/dashboard');

// Formatear fecha
const formatearFecha = (fecha) => {
  if (!fecha) return '';
  const date = new Date(fecha);
  const hoy = new Date();
  const ayer = new Date(hoy);
  ayer.setDate(ayer.getDate() - 1);

  if (date.toDateString() === hoy.toDateString()) return 'Hoy';
  if (date.toDateString() === ayer.toDateString()) return 'Ayer';

  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: date.getFullYear() !== hoy.getFullYear() ? 'numeric' : undefined
  });
};

const formatearFechaCompleta = (fecha) => {
  if (!fecha) return '';
  return new Date(fecha).toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Extraer extracto del contenido
const obtenerExtracto = (contenido, maxLength = 150) => {
  if (!contenido) return '';
  // Remover HTML tags si hay
  const textoPlano = contenido.replace(/<[^>]*>/g, '');
  if (textoPlano.length <= maxLength) return textoPlano;
  return textoPlano.substring(0, maxLength).trim() + '...';
};
</script>

<template>
  <div class="space-y-6">
    <!-- ==========================================
         VISTA LISTA DE COMUNICADOS
         ========================================== -->
    <template v-if="!vistaDetalle">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl flex items-center justify-center">
              <Megaphone class="w-5 h-5 text-orange-600" />
            </div>
            Comunicados
          </h1>
          <p class="text-gray-500 mt-1">Novedades y mensajes de {{ nombreEmpresa }}</p>
        </div>

        <!-- Badge de no leídos y acción -->
        <div class="flex items-center gap-3">
          <div v-if="conteoNoLeidos > 0" class="flex items-center gap-2">
            <span class="px-3 py-1.5 bg-orange-100 text-orange-700 font-semibold text-sm rounded-full flex items-center gap-1.5">
              <Bell class="w-4 h-4" />
              {{ conteoNoLeidos }} nuevo{{ conteoNoLeidos > 1 ? 's' : '' }}
            </span>
            <button
              @click="marcarTodosLeidos"
              class="text-sm text-gray-500 hover:text-teal-600 font-medium transition-colors"
            >
              Marcar todos leídos
            </button>
          </div>
          <div v-else class="flex items-center gap-2 text-green-600 text-sm">
            <CheckCircle class="w-4 h-4" />
            <span>Todo leído</span>
          </div>
        </div>
      </div>

      <!-- ==========================================
           ESTADO: CARGANDO
           ========================================== -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-16">
        <div class="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mb-6"></div>
        <p class="text-gray-600 font-medium">Cargando comunicados...</p>
        <p class="text-gray-400 text-sm mt-1">Un momento por favor</p>
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
            @click="cargarComunicados"
            class="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors"
          >
            <RefreshCw class="w-4 h-4" />
            Reintentar
          </button>
        </div>
      </div>

      <!-- ==========================================
           ESTADO: VACÍO
           ========================================== -->
      <div v-else-if="comunicados.length === 0" class="max-w-lg mx-auto">
        <div class="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-8 text-center">
          <div class="w-20 h-20 bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Megaphone class="w-10 h-10 text-orange-500" />
          </div>
          <h3 class="text-xl font-bold text-orange-900 mb-2">
            No tienes comunicados nuevos
          </h3>
          <p class="text-orange-700 mb-6">
            Mantente atento, te notificaremos cuando {{ nombreEmpresa }} tenga novedades para ti.
          </p>

          <!-- Mensaje de privacidad -->
          <div class="bg-white/60 rounded-xl p-4 mb-6">
            <div class="flex items-center gap-3 justify-center text-sm text-orange-600">
              <Shield class="w-4 h-4 flex-shrink-0" />
              <span>Tus comunicaciones son <strong>privadas</strong> y solo visibles para ti</span>
            </div>
          </div>

          <button
            @click="irADashboard"
            class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg shadow-orange-200"
          >
            <ArrowLeft class="w-4 h-4" />
            Volver al inicio
          </button>
        </div>
      </div>

      <!-- ==========================================
           CONTENIDO: COMUNICADOS
           ========================================== -->
      <template v-else>
        <!-- Filtros -->
        <div class="flex items-center gap-2 overflow-x-auto pb-2 -mb-2">
          <button
            v-for="filtro in opcionesFiltro"
            :key="filtro.value"
            @click="filtroActivo = filtro.value"
            class="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all"
            :class="filtroActivo === filtro.value
              ? 'bg-orange-500 text-white shadow-lg shadow-orange-200'
              : 'bg-white border border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-600'"
          >
            <component :is="filtro.icono" class="w-4 h-4" />
            {{ filtro.label }}
            <span
              v-if="filtro.value === 'no_leidos' && conteoNoLeidos > 0"
              class="px-1.5 py-0.5 text-xs rounded-full"
              :class="filtroActivo === filtro.value ? 'bg-white/20' : 'bg-orange-100 text-orange-600'"
            >
              {{ conteoNoLeidos }}
            </span>
          </button>
        </div>

        <!-- Comunicado destacado -->
        <div
          v-if="comunicadoDestacado && filtroActivo === 'todos'"
          @click="abrirComunicado(comunicadoDestacado)"
          class="relative rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 group overflow-hidden"
          :class="comunicadoDestacado.prioridad === 'alta'
            ? 'bg-gradient-to-br from-red-500 via-orange-500 to-amber-500 text-white'
            : 'bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 text-white'"
        >
          <!-- Patrón decorativo -->
          <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl"></div>

          <!-- Badge de no leído -->
          <div
            v-if="!comunicadoDestacado.leido"
            class="absolute top-4 right-4 flex items-center gap-2"
          >
            <span class="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-bold rounded-full animate-pulse">
              NUEVO
            </span>
          </div>

          <div class="relative z-10">
            <div class="flex items-start gap-4">
              <div class="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                <component :is="getTipoConfig(comunicadoDestacado.tipo).icono" class="w-7 h-7" />
              </div>

              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-2">
                  <span class="px-2.5 py-0.5 bg-white/20 text-white text-xs font-semibold rounded-full">
                    {{ getTipoConfig(comunicadoDestacado.tipo).nombre }}
                  </span>
                  <span v-if="comunicadoDestacado.prioridad === 'alta'" class="px-2.5 py-0.5 bg-red-500/30 text-white text-xs font-bold rounded-full">
                    IMPORTANTE
                  </span>
                </div>

                <h2 class="text-xl font-bold mb-2 group-hover:underline">
                  {{ comunicadoDestacado.titulo }}
                </h2>

                <p class="text-white/80 mb-4 line-clamp-2">
                  {{ obtenerExtracto(comunicadoDestacado.contenido, 200) }}
                </p>

                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-4 text-sm text-white/70">
                    <span class="flex items-center gap-1.5">
                      <Calendar class="w-4 h-4" />
                      {{ formatearFecha(comunicadoDestacado.fecha_publicacion) }}
                    </span>
                    <span v-if="comunicadoDestacado.autor?.nombre" class="flex items-center gap-1.5">
                      <User class="w-4 h-4" />
                      {{ comunicadoDestacado.autor.nombre }}
                    </span>
                  </div>

                  <span class="flex items-center gap-2 font-semibold text-white group-hover:gap-3 transition-all">
                    Leer más
                    <ChevronRight class="w-5 h-5" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Lista de comunicados -->
        <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <div class="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 class="font-semibold text-gray-900">
              {{ filtroActivo === 'todos' ? 'Todos los comunicados' : opcionesFiltro.find(f => f.value === filtroActivo)?.label }}
            </h3>
            <span class="text-sm text-gray-500">
              {{ comunicadosFiltrados.length }} comunicado{{ comunicadosFiltrados.length !== 1 ? 's' : '' }}
            </span>
          </div>

          <!-- Lista -->
          <div v-if="comunicadosLista.length > 0" class="divide-y divide-gray-100">
            <div
              v-for="comunicado in comunicadosLista"
              :key="comunicado.id"
              @click="abrirComunicado(comunicado)"
              class="p-4 hover:bg-gray-50 transition-colors cursor-pointer group"
            >
              <div class="flex items-start gap-4">
                <!-- Indicador de no leído + icono de tipo -->
                <div class="relative flex-shrink-0">
                  <div
                    class="w-12 h-12 rounded-xl flex items-center justify-center"
                    :class="getTipoConfig(comunicado.tipo).bgColor"
                  >
                    <component
                      :is="getTipoConfig(comunicado.tipo).icono"
                      class="w-6 h-6"
                      :class="getTipoConfig(comunicado.tipo).textColor"
                    />
                  </div>
                  <!-- Punto de no leído -->
                  <div
                    v-if="!comunicado.leido"
                    class="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full border-2 border-white"
                  ></div>
                </div>

                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-1">
                    <h4
                      class="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors"
                      :class="{ 'font-bold': !comunicado.leido }"
                    >
                      {{ comunicado.titulo }}
                    </h4>
                    <span
                      v-if="comunicado.prioridad === 'alta'"
                      class="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded-full"
                    >
                      Importante
                    </span>
                    <span
                      v-if="!comunicado.leido"
                      class="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-medium rounded-full"
                    >
                      Nuevo
                    </span>
                  </div>

                  <p class="text-sm text-gray-500 line-clamp-2 mb-2">
                    {{ obtenerExtracto(comunicado.contenido, 120) }}
                  </p>

                  <div class="flex items-center gap-4 text-xs text-gray-400">
                    <span class="flex items-center gap-1">
                      <Calendar class="w-3.5 h-3.5" />
                      {{ formatearFecha(comunicado.fecha_publicacion) }}
                    </span>
                    <span class="px-2 py-0.5 bg-gray-100 rounded-full">
                      {{ getTipoConfig(comunicado.tipo).nombre }}
                    </span>
                  </div>
                </div>

                <ChevronRight class="w-5 h-5 text-gray-300 group-hover:text-orange-500 transition-colors flex-shrink-0" />
              </div>
            </div>
          </div>

          <!-- Estado vacío filtrado -->
          <div v-else class="p-8 text-center">
            <div class="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Filter class="w-8 h-8 text-gray-400" />
            </div>
            <p class="text-gray-600 font-medium">No hay comunicados con este filtro</p>
            <p class="text-sm text-gray-400 mt-1">Prueba con otro filtro o revisa todos los comunicados</p>
            <button
              @click="filtroActivo = 'todos'"
              class="mt-4 text-orange-600 hover:text-orange-700 font-medium text-sm"
            >
              Ver todos los comunicados
            </button>
          </div>
        </div>

        <!-- Mensaje de privacidad -->
        <div class="bg-gradient-to-r from-slate-50 to-gray-100 border border-gray-200 rounded-xl p-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-teal-100 to-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield class="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <p class="text-sm text-gray-600">
                <strong class="text-gray-900">Tu privacidad está protegida.</strong>
                Estos comunicados son exclusivos para ti y los empleados de {{ nombreEmpresa }}.
              </p>
            </div>
          </div>
        </div>
      </template>
    </template>

    <!-- ==========================================
         VISTA DETALLE DE COMUNICADO
         ========================================== -->
    <template v-else>
      <div class="max-w-3xl mx-auto">
        <!-- Botón volver -->
        <button
          @click="cerrarDetalle"
          class="flex items-center gap-2 text-gray-600 hover:text-orange-600 font-medium mb-6 transition-colors"
        >
          <ArrowLeft class="w-5 h-5" />
          Volver a comunicados
        </button>

        <!-- Card del comunicado -->
        <div class="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <!-- Header del comunicado -->
          <div
            class="p-6 border-b"
            :class="comunicadoSeleccionado.prioridad === 'alta'
              ? 'bg-gradient-to-r from-red-50 to-orange-50 border-red-100'
              : 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-100'"
          >
            <div class="flex items-start gap-4">
              <div
                class="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                :class="getTipoConfig(comunicadoSeleccionado.tipo).bgColor"
              >
                <component
                  :is="getTipoConfig(comunicadoSeleccionado.tipo).icono"
                  class="w-7 h-7"
                  :class="getTipoConfig(comunicadoSeleccionado.tipo).textColor"
                />
              </div>

              <div class="flex-1">
                <div class="flex flex-wrap items-center gap-2 mb-2">
                  <span
                    class="px-2.5 py-0.5 text-xs font-semibold rounded-full"
                    :class="`${getTipoConfig(comunicadoSeleccionado.tipo).bgColor} ${getTipoConfig(comunicadoSeleccionado.tipo).textColor}`"
                  >
                    {{ getTipoConfig(comunicadoSeleccionado.tipo).nombre }}
                  </span>
                  <span
                    v-if="comunicadoSeleccionado.prioridad === 'alta'"
                    class="px-2.5 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded-full"
                  >
                    IMPORTANTE
                  </span>
                  <span
                    v-if="comunicadoSeleccionado.leido"
                    class="flex items-center gap-1 px-2.5 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full"
                  >
                    <CheckCircle class="w-3 h-3" />
                    Leído
                  </span>
                </div>

                <h1 class="text-2xl font-bold text-gray-900 mb-3">
                  {{ comunicadoSeleccionado.titulo }}
                </h1>

                <div class="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <span class="flex items-center gap-1.5">
                    <Calendar class="w-4 h-4" />
                    {{ formatearFechaCompleta(comunicadoSeleccionado.fecha_publicacion) }}
                  </span>
                  <span v-if="comunicadoSeleccionado.autor?.nombre" class="flex items-center gap-1.5">
                    <User class="w-4 h-4" />
                    {{ comunicadoSeleccionado.autor.nombre }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Contenido del comunicado -->
          <div class="p-6">
            <div
              class="prose prose-gray max-w-none"
              v-html="comunicadoSeleccionado.contenido || comunicadoSeleccionado.descripcion"
            ></div>

            <!-- Si hay adjuntos o enlaces -->
            <div v-if="comunicadoSeleccionado.enlace_externo" class="mt-6 pt-6 border-t border-gray-100">
              <a
                :href="comunicadoSeleccionado.enlace_externo"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-700 font-medium rounded-lg hover:bg-orange-100 transition-colors"
              >
                <ExternalLink class="w-4 h-4" />
                Ver enlace relacionado
              </a>
            </div>
          </div>

          <!-- Footer con acciones -->
          <div class="p-6 bg-gray-50 border-t border-gray-100">
            <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
              <!-- Mensaje de privacidad -->
              <div class="flex items-center gap-2 text-sm text-gray-500">
                <Lock class="w-4 h-4" />
                <span>Este comunicado es privado y solo visible para ti</span>
              </div>

              <!-- Botones de acción -->
              <div class="flex items-center gap-3">
                <button
                  v-if="!comunicadoSeleccionado.leido"
                  @click="marcarComoLeido(comunicadoSeleccionado)"
                  :disabled="marcandoLeido"
                  class="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  <CheckCircle class="w-4 h-4" />
                  {{ marcandoLeido ? 'Marcando...' : 'Marcar como leído' }}
                </button>
                <button
                  @click="cerrarDetalle"
                  class="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
                >
                  <ArrowLeft class="w-4 h-4" />
                  Volver
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Navegación entre comunicados -->
        <div class="mt-6 flex items-center justify-between">
          <button
            v-if="comunicadosLista.indexOf(comunicadoSeleccionado) > 0 || comunicadoDestacado?.id === comunicadoSeleccionado?.id"
            @click="abrirComunicado(comunicados[comunicados.indexOf(comunicadoSeleccionado) - 1])"
            class="flex items-center gap-2 text-gray-600 hover:text-orange-600 font-medium transition-colors"
          >
            <ChevronLeft class="w-5 h-5" />
            Anterior
          </button>
          <div v-else></div>

          <button
            v-if="comunicados.indexOf(comunicadoSeleccionado) < comunicados.length - 1"
            @click="abrirComunicado(comunicados[comunicados.indexOf(comunicadoSeleccionado) + 1])"
            class="flex items-center gap-2 text-gray-600 hover:text-orange-600 font-medium transition-colors"
          >
            Siguiente
            <ChevronRight class="w-5 h-5" />
          </button>
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

/* Estilos para el contenido HTML del comunicado */
.prose {
  line-height: 1.75;
}

.prose p {
  margin-bottom: 1rem;
}

.prose h2,
.prose h3 {
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}

.prose ul,
.prose ol {
  margin-left: 1.5rem;
  margin-bottom: 1rem;
}

.prose li {
  margin-bottom: 0.25rem;
}

.prose a {
  color: #ea580c;
  text-decoration: underline;
}

.prose a:hover {
  color: #c2410c;
}

/* Scrollbar para filtros horizontales */
.overflow-x-auto::-webkit-scrollbar {
  height: 4px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 2px;
}
</style>
