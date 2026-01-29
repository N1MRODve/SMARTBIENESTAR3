<template>
  <div class="min-h-screen bg-gray-50">
    <div class="py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mb-8">
          <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">
                Catalogo de Servicios SMART Bienestar
              </h1>
              <p class="text-gray-600 mt-2">
                Acciones recomendadas para mejorar el bienestar de tu equipo basadas en los resultados de tus encuestas.
              </p>
            </div>
            <div class="flex items-center gap-2 px-4 py-2 bg-teal-100 rounded-full self-start">
              <Briefcase class="h-5 w-5 text-teal-600" />
              <span class="text-sm font-semibold text-teal-700">
                {{ serviciosFiltrados.length }} servicio{{ serviciosFiltrados.length !== 1 ? 's' : '' }} disponible{{ serviciosFiltrados.length !== 1 ? 's' : '' }}
              </span>
            </div>
          </div>

          <div class="flex flex-wrap gap-2">
            <button
              v-for="cat in categoriasDisponibles"
              :key="cat.id"
              @click="categoriaSeleccionada = cat.id"
              class="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              :class="categoriaSeleccionada === cat.id
                ? 'bg-teal-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm border border-gray-200'"
            >
              {{ cat.nombre }}
            </button>
          </div>
        </div>

        <div v-if="loading" class="flex items-center justify-center py-20">
          <div class="text-center">
            <div class="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p class="text-gray-600">Cargando servicios...</p>
          </div>
        </div>

        <div v-else-if="serviciosFiltrados.length > 0">
          <div
            v-for="(serviciosPorCategoria, categoriaId) in serviciosAgrupados"
            :key="categoriaId"
            class="mb-10"
          >
            <div class="flex items-center gap-3 mb-4">
              <div
                class="w-10 h-10 rounded-lg flex items-center justify-center"
                :class="getCategoriaConfig(categoriaId).bgIcon"
              >
                <component :is="getCategoriaConfig(categoriaId).icon" class="h-5 w-5" :class="getCategoriaConfig(categoriaId).iconColor" />
              </div>
              <div>
                <h2 class="text-xl font-bold text-gray-900">{{ getCategoriaConfig(categoriaId).nombre }}</h2>
                <p class="text-sm text-gray-500">{{ serviciosPorCategoria.length }} servicio{{ serviciosPorCategoria.length !== 1 ? 's' : '' }}</p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <div
                v-for="(servicio, index) in serviciosPorCategoria"
                :key="servicio.id"
                class="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer group border border-gray-100"
                @click="abrirDetalleServicio(servicio)"
                :style="{ animationDelay: `${index * 0.05}s` }"
              >
                <div class="relative h-3" :class="getCategoriaConfig(servicio.categoria).gradient"></div>

                <div class="p-5">
                  <div class="flex items-start justify-between mb-3">
                    <span
                      class="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium"
                      :class="getCategoriaConfig(servicio.categoria).badge"
                    >
                      {{ getTipoLabel(servicio.tipo) }}
                    </span>
                    <ArrowUpRight class="h-5 w-5 text-gray-300 group-hover:text-teal-500 transition-colors" />
                  </div>

                  <h3 class="text-lg font-semibold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors line-clamp-2">
                    {{ servicio.nombre }}
                  </h3>

                  <p class="text-sm text-gray-600 mb-4 line-clamp-3">
                    {{ servicio.descripcion }}
                  </p>

                  <div class="flex flex-wrap items-center gap-3 mb-4 text-xs text-gray-500">
                    <div v-if="servicio.duracion_minutos" class="flex items-center gap-1">
                      <Clock class="h-4 w-4" />
                      <span>{{ formatDuracion(servicio.duracion_minutos) }}</span>
                    </div>
                    <div v-if="servicio.frecuencia" class="flex items-center gap-1">
                      <Calendar class="h-4 w-4" />
                      <span>{{ servicio.frecuencia }}</span>
                    </div>
                  </div>

                  <div v-if="servicio.beneficios && servicio.beneficios.length > 0" class="mb-4">
                    <div class="flex items-center gap-1 text-xs font-medium text-gray-700 mb-2">
                      <Sparkles class="h-3.5 w-3.5 text-amber-500" />
                      Beneficios clave:
                    </div>
                    <div class="space-y-1">
                      <div
                        v-for="(beneficio, bIndex) in servicio.beneficios.slice(0, 2)"
                        :key="bIndex"
                        class="flex items-start gap-2 text-xs text-gray-600"
                      >
                        <CheckCircle class="h-3.5 w-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span class="line-clamp-1">{{ beneficio.titulo }}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    @click.stop="abrirDetalleServicio(servicio)"
                    class="w-full flex items-center justify-center gap-2 bg-gray-50 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-teal-50 hover:text-teal-700 transition-colors text-sm font-medium border border-gray-200 hover:border-teal-200"
                  >
                    <Eye class="h-4 w-4" />
                    Ver detalles
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="categoriaSeleccionada !== 'todos'" class="text-center py-12">
          <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search class="h-8 w-8 text-gray-400" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">
            No hay servicios en esta categoria
          </h3>
          <p class="text-gray-600 mb-4">
            Explora otras categorias para encontrar servicios disponibles.
          </p>
          <button
            @click="categoriaSeleccionada = 'todos'"
            class="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            <Briefcase class="h-4 w-4" />
            Ver todos los servicios
          </button>
        </div>

        <div v-else class="text-center py-16">
          <div class="max-w-md mx-auto">
            <div class="w-32 h-32 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Briefcase class="h-16 w-16 text-teal-400" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">
              El catalogo de servicios esta en camino
            </h3>
            <p class="text-gray-600 mb-6 leading-relaxed">
              Pronto tendras acceso a programas de bienestar diseñados para mejorar la salud y productividad de tu equipo.
            </p>
          </div>
        </div>
      </div>
    </div>

    <Dialog
      v-model:visible="modalDetalleAbierto"
      modal
      :dismissableMask="true"
      :style="{ width: '56rem' }"
      :breakpoints="{ '1199px': '80vw', '575px': '95vw' }"
      :pt="{
        header: { class: 'border-b border-gray-100 pb-4' },
        content: { class: 'pt-6' }
      }"
    >
      <template #header>
        <div class="flex items-center gap-4">
          <div
            class="w-12 h-12 rounded-xl flex items-center justify-center"
            :class="getCategoriaConfig(servicioSeleccionado?.categoria).bgIcon"
          >
            <component
              :is="getCategoriaConfig(servicioSeleccionado?.categoria).icon"
              class="h-6 w-6"
              :class="getCategoriaConfig(servicioSeleccionado?.categoria).iconColor"
            />
          </div>
          <div>
            <h3 class="text-xl font-bold text-gray-900">
              {{ servicioSeleccionado?.nombre }}
            </h3>
            <div class="flex items-center gap-2 mt-1">
              <span
                class="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium"
                :class="getCategoriaConfig(servicioSeleccionado?.categoria).badge"
              >
                {{ getCategoriaConfig(servicioSeleccionado?.categoria).nombre }}
              </span>
              <span class="text-xs text-gray-500">
                {{ getTipoLabel(servicioSeleccionado?.tipo) }}
              </span>
            </div>
          </div>
        </div>
      </template>

      <div v-if="servicioSeleccionado" class="space-y-6">
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div class="bg-gray-50 rounded-xl p-4">
            <div class="flex items-center gap-2 mb-2">
              <Clock class="h-5 w-5 text-teal-600" />
              <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">Duracion</span>
            </div>
            <p class="text-sm font-semibold text-gray-900">
              {{ servicioSeleccionado.duracion_minutos ? formatDuracion(servicioSeleccionado.duracion_minutos) : 'Variable' }}
            </p>
          </div>
          <div class="bg-gray-50 rounded-xl p-4">
            <div class="flex items-center gap-2 mb-2">
              <Calendar class="h-5 w-5 text-teal-600" />
              <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">Frecuencia</span>
            </div>
            <p class="text-sm font-semibold text-gray-900">
              {{ servicioSeleccionado.frecuencia || 'A definir' }}
            </p>
          </div>
          <div class="bg-gray-50 rounded-xl p-4">
            <div class="flex items-center gap-2 mb-2">
              <Layers class="h-5 w-5 text-teal-600" />
              <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">Formato</span>
            </div>
            <p class="text-sm font-semibold text-gray-900">
              {{ getTipoLabel(servicioSeleccionado.tipo) }}
            </p>
          </div>
        </div>

        <div class="bg-white border border-gray-200 rounded-xl p-5">
          <h4 class="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <FileText class="h-5 w-5 text-teal-600" />
            Descripcion del servicio
          </h4>
          <p class="text-sm text-gray-700 leading-relaxed">
            {{ servicioSeleccionado.descripcion }}
          </p>
        </div>

        <div v-if="servicioSeleccionado.beneficios && servicioSeleccionado.beneficios.length > 0">
          <h4 class="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Target class="h-5 w-5 text-teal-600" />
            Beneficios para tu organizacion
          </h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="(beneficio, index) in servicioSeleccionado.beneficios"
              :key="index"
              class="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-xl p-4"
            >
              <div class="flex items-start gap-3">
                <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle class="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p class="font-semibold text-gray-900 text-sm mb-1">{{ beneficio.titulo }}</p>
                  <p class="text-xs text-gray-600 leading-relaxed">{{ beneficio.descripcion }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-100 rounded-xl p-5">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Lightbulb class="h-6 w-6 text-teal-600" />
            </div>
            <div>
              <h4 class="font-semibold text-teal-900 mb-1">Como implementar este servicio</h4>
              <p class="text-sm text-teal-700">
                Solicita la implementacion y un asesor de SMART Bienestar se pondra en contacto contigo
                para coordinar los detalles, fechas y adaptacion a las necesidades de tu equipo.
              </p>
            </div>
          </div>
        </div>

        <div class="pt-4 border-t border-gray-200">
          <button
            @click="solicitarImplementacion"
            class="w-full flex items-center justify-center gap-2 bg-teal-600 text-white px-6 py-3.5 rounded-xl hover:bg-teal-700 transition-colors text-base font-semibold shadow-lg hover:shadow-xl"
          >
            <Send class="h-5 w-5" />
            Solicitar implementacion
          </button>
          <p class="text-xs text-gray-500 text-center mt-3">
            Sin compromiso. Un asesor te contactara para resolver tus dudas.
          </p>
        </div>
      </div>
    </Dialog>

    <SolicitudServicio
      v-model:visible="modalSolicitudAbierto"
      :servicio="servicioSeleccionado"
      @solicitud-guardada="handleSolicitudGuardada"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useToast } from 'vue-toastification';
import Dialog from 'primevue/dialog';
import SolicitudServicio from '@/components/admin/SolicitudServicio.vue';
import { serviciosService } from '@/services/servicios.service';
import {
  Briefcase,
  Clock,
  Calendar,
  Eye,
  Search,
  FileText,
  Target,
  CheckCircle,
  Layers,
  Send,
  Sparkles,
  ArrowUpRight,
  Lightbulb,
  Brain,
  Users,
  Gauge,
  MessageCircle,
  GraduationCap,
  Heart,
  HandHelping
} from 'lucide-vue-next';

const route = useRoute();
const toast = useToast();

const loading = ref(true);
const categoriaSeleccionada = ref('todos');
const servicioSeleccionado = ref(null);
const modalDetalleAbierto = ref(false);
const modalSolicitudAbierto = ref(false);
const servicios = ref([]);

const categoriasConfig = {
  salud_mental: {
    id: 'salud_mental',
    nombre: 'Salud Mental',
    icon: Brain,
    bgIcon: 'bg-rose-100',
    iconColor: 'text-rose-600',
    badge: 'bg-rose-100 text-rose-700',
    gradient: 'bg-gradient-to-r from-rose-400 to-pink-500'
  },
  clima_laboral: {
    id: 'clima_laboral',
    nombre: 'Clima Laboral',
    icon: Users,
    bgIcon: 'bg-sky-100',
    iconColor: 'text-sky-600',
    badge: 'bg-sky-100 text-sky-700',
    gradient: 'bg-gradient-to-r from-sky-400 to-blue-500'
  },
  productividad: {
    id: 'productividad',
    nombre: 'Productividad',
    icon: Gauge,
    bgIcon: 'bg-amber-100',
    iconColor: 'text-amber-600',
    badge: 'bg-amber-100 text-amber-700',
    gradient: 'bg-gradient-to-r from-amber-400 to-orange-500'
  },
  comunicacion: {
    id: 'comunicacion',
    nombre: 'Comunicacion',
    icon: MessageCircle,
    bgIcon: 'bg-violet-100',
    iconColor: 'text-violet-600',
    badge: 'bg-violet-100 text-violet-700',
    gradient: 'bg-gradient-to-r from-violet-400 to-purple-500'
  },
  desarrollo_profesional: {
    id: 'desarrollo_profesional',
    nombre: 'Desarrollo Profesional',
    icon: GraduationCap,
    bgIcon: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    badge: 'bg-emerald-100 text-emerald-700',
    gradient: 'bg-gradient-to-r from-emerald-400 to-green-500'
  },
  bienestar_general: {
    id: 'bienestar_general',
    nombre: 'Bienestar General',
    icon: Heart,
    bgIcon: 'bg-pink-100',
    iconColor: 'text-pink-600',
    badge: 'bg-pink-100 text-pink-700',
    gradient: 'bg-gradient-to-r from-pink-400 to-rose-500'
  },
  consultoria: {
    id: 'consultoria',
    nombre: 'Consultoria',
    icon: HandHelping,
    bgIcon: 'bg-teal-100',
    iconColor: 'text-teal-600',
    badge: 'bg-teal-100 text-teal-700',
    gradient: 'bg-gradient-to-r from-teal-400 to-cyan-500'
  }
};

const defaultCategoriaConfig = {
  id: 'otros',
  nombre: 'Otros',
  icon: Briefcase,
  bgIcon: 'bg-gray-100',
  iconColor: 'text-gray-600',
  badge: 'bg-gray-100 text-gray-700',
  gradient: 'bg-gradient-to-r from-gray-400 to-gray-500'
};

const tiposLabel = {
  sesion_grupal: 'Sesion Grupal',
  sesion_individual: 'Sesion Individual',
  taller: 'Taller',
  webinar: 'Webinar',
  programa: 'Programa',
  consultoria: 'Consultoria'
};

const getCategoriaConfig = (categoriaId) => {
  return categoriasConfig[categoriaId] || defaultCategoriaConfig;
};

const getTipoLabel = (tipo) => {
  return tiposLabel[tipo] || tipo;
};

const formatDuracion = (minutos) => {
  if (!minutos) return 'Variable';
  if (minutos < 60) return `${minutos} min`;
  const horas = Math.floor(minutos / 60);
  const mins = minutos % 60;
  if (mins === 0) return `${horas}h`;
  return `${horas}h ${mins}min`;
};

const categoriasDisponibles = computed(() => {
  const categoriasEnUso = [...new Set(servicios.value.map(s => s.categoria))];
  const cats = [{ id: 'todos', nombre: 'Todos' }];

  Object.keys(categoriasConfig).forEach(catId => {
    if (categoriasEnUso.includes(catId)) {
      cats.push({ id: catId, nombre: categoriasConfig[catId].nombre });
    }
  });

  return cats;
});

const serviciosFiltrados = computed(() => {
  if (categoriaSeleccionada.value === 'todos') {
    return servicios.value;
  }
  return servicios.value.filter(s => s.categoria === categoriaSeleccionada.value);
});

const serviciosAgrupados = computed(() => {
  const grupos = {};
  const ordenCategorias = ['salud_mental', 'clima_laboral', 'productividad', 'comunicacion', 'desarrollo_profesional', 'bienestar_general', 'consultoria'];

  serviciosFiltrados.value.forEach(servicio => {
    const cat = servicio.categoria;
    if (!grupos[cat]) {
      grupos[cat] = [];
    }
    grupos[cat].push(servicio);
  });

  const gruposOrdenados = {};
  ordenCategorias.forEach(cat => {
    if (grupos[cat]) {
      gruposOrdenados[cat] = grupos[cat];
    }
  });

  Object.keys(grupos).forEach(cat => {
    if (!gruposOrdenados[cat]) {
      gruposOrdenados[cat] = grupos[cat];
    }
  });

  return gruposOrdenados;
});

const abrirDetalleServicio = (servicio) => {
  servicioSeleccionado.value = servicio;
  modalDetalleAbierto.value = true;
};

const solicitarImplementacion = () => {
  modalDetalleAbierto.value = false;
  modalSolicitudAbierto.value = true;
};

const handleSolicitudGuardada = () => {
  toast.success('Solicitud enviada correctamente');
  servicioSeleccionado.value = null;
};

const cargarServicios = async () => {
  try {
    loading.value = true;
    const data = await serviciosService.getAll();
    servicios.value = data || [];
  } catch (error) {
    console.error('Error cargando servicios:', error);
    toast.error('Error al cargar los servicios');
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await cargarServicios();

  const servicioId = route.query.servicio;
  if (servicioId) {
    const servicio = servicios.value.find(s => s.id === servicioId);
    if (servicio) {
      abrirDetalleServicio(servicio);
    }
  }
});
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
