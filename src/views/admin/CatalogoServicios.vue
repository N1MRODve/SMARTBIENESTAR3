<template>
  <div class="min-h-screen bg-gray-50">
    <Header subtitulo="Catálogo de Servicios" />

    <div class="py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="mb-8">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">
                Catálogo de Servicios SMART Bienestar
              </h1>
              <p class="text-gray-600 mt-2">
                Explora los programas y recursos que puedes implementar para mejorar el bienestar organizacional.
              </p>
            </div>
            <div class="flex items-center gap-2 px-4 py-2 bg-indigo-100 rounded-full">
              <Briefcase class="h-5 w-5 text-indigo-600" />
              <span class="text-sm font-semibold text-indigo-700">
                {{ serviciosFiltrados.length }} servicio{{ serviciosFiltrados.length !== 1 ? 's' : '' }}
              </span>
            </div>
          </div>

          <!-- Filtros por categoría -->
          <div class="flex flex-wrap gap-2">
            <button
              v-for="cat in categorias"
              :key="cat"
              @click="categoriaSeleccionada = cat"
              class="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              :class="categoriaSeleccionada === cat
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'"
            >
              {{ cat }}
            </button>
          </div>
        </div>

        <!-- Grid de Servicios -->
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <div
            v-for="(servicio, index) in serviciosFiltrados"
            :key="servicio.id"
            class="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer group"
            @click="abrirDetalleServicio(servicio)"
            :style="{ animationDelay: `${index * 0.1}s` }"
            style="animation: fadeInUp 0.5s ease-out forwards; opacity: 0;"
          >
            <!-- Imagen -->
            <div class="relative h-40 overflow-hidden">
              <img
                :src="servicio.imagen"
                :alt="servicio.nombre"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div class="absolute top-3 left-3">
                <span
                  class="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium shadow-sm"
                  :class="obtenerColorCategoria(servicio.categoria).bg + ' ' + obtenerColorCategoria(servicio.categoria).text"
                >
                  {{ servicio.categoria }}
                </span>
              </div>
              <div class="absolute bottom-3 left-3 text-4xl">
                {{ servicio.icono }}
              </div>
            </div>

            <!-- Contenido -->
            <div class="p-5">
              <h3 class="text-lg font-semibold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors">
                {{ servicio.nombre }}
              </h3>
              <p class="text-sm text-gray-600 mb-4 line-clamp-2">
                {{ servicio.descripcion }}
              </p>

              <!-- Info -->
              <div class="flex items-center gap-4 mb-4 text-xs text-gray-500">
                <div class="flex items-center gap-1">
                  <Clock class="h-4 w-4" />
                  <span>{{ servicio.duracion }}</span>
                </div>
                <div class="flex items-center gap-1">
                  <Monitor class="h-4 w-4" />
                  <span>{{ servicio.formato }}</span>
                </div>
              </div>

              <!-- Impacto -->
              <div class="bg-green-50 border-l-4 border-green-500 p-3 mb-4">
                <p class="text-xs font-medium text-green-800">
                  <span class="font-semibold">Impacto:</span> {{ servicio.impacto }}
                </p>
              </div>

              <!-- Botón -->
              <button
                @click.stop="abrirDetalleServicio(servicio)"
                class="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium"
              >
                <Eye class="h-4 w-4" />
                Ver más detalles
              </button>
            </div>
          </div>
        </div>

        <!-- Estado vacío -->
        <div v-if="serviciosFiltrados.length === 0" class="text-center py-12">
          <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search class="h-8 w-8 text-gray-400" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">
            No se encontraron servicios
          </h3>
          <p class="text-gray-600">
            Intenta con otra categoría o explora todos los servicios disponibles.
          </p>
        </div>
      </div>
    </div>

    <!-- Modal de Detalle -->
    <Dialog
      v-model:visible="modalDetalleAbierto"
      modal
      :dismissableMask="true"
      :style="{ width: '50rem' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    >
      <template #header>
        <div class="flex items-center gap-3">
          <div class="text-4xl">{{ servicioSeleccionado?.icono }}</div>
          <div>
            <h3 class="text-xl font-bold text-gray-900">
              {{ servicioSeleccionado?.nombre }}
            </h3>
            <span
              class="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium mt-1"
              :class="obtenerColorCategoria(servicioSeleccionado?.categoria).bg + ' ' + obtenerColorCategoria(servicioSeleccionado?.categoria).text"
            >
              {{ servicioSeleccionado?.categoria }}
            </span>
          </div>
        </div>
      </template>

      <div v-if="servicioSeleccionado" class="space-y-6">
        <!-- Imagen -->
        <div class="relative h-48 rounded-xl overflow-hidden">
          <img
            :src="servicioSeleccionado.imagen"
            :alt="servicioSeleccionado.nombre"
            class="w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>

        <!-- Información General -->
        <div class="grid grid-cols-3 gap-4">
          <div class="bg-gray-50 rounded-lg p-4 text-center">
            <Clock class="h-6 w-6 text-indigo-600 mx-auto mb-2" />
            <p class="text-sm font-semibold text-gray-900">{{ servicioSeleccionado.duracion }}</p>
            <p class="text-xs text-gray-600">Duración</p>
          </div>
          <div class="bg-gray-50 rounded-lg p-4 text-center">
            <Monitor class="h-6 w-6 text-indigo-600 mx-auto mb-2" />
            <p class="text-sm font-semibold text-gray-900">{{ servicioSeleccionado.formato }}</p>
            <p class="text-xs text-gray-600">Formato</p>
          </div>
          <div class="bg-gray-50 rounded-lg p-4 text-center">
            <Users class="h-6 w-6 text-indigo-600 mx-auto mb-2" />
            <p class="text-sm font-semibold text-gray-900">{{ servicioSeleccionado.participantes }}</p>
            <p class="text-xs text-gray-600">Participantes</p>
          </div>
        </div>

        <!-- Descripción -->
        <div>
          <h4 class="text-base font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <FileText class="h-5 w-5 text-indigo-600" />
            Descripción
          </h4>
          <p class="text-sm text-gray-700 leading-relaxed">
            {{ servicioSeleccionado.descripcion }}
          </p>
        </div>

        <!-- Objetivos -->
        <div>
          <h4 class="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Target class="h-5 w-5 text-indigo-600" />
            Objetivos
          </h4>
          <ul class="space-y-2">
            <li
              v-for="(objetivo, index) in servicioSeleccionado.objetivos"
              :key="index"
              class="flex items-start gap-2 text-sm text-gray-700"
            >
              <CheckCircle class="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span>{{ objetivo }}</span>
            </li>
          </ul>
        </div>

        <!-- Impacto Detallado -->
        <div>
          <h4 class="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <TrendingUp class="h-5 w-5 text-indigo-600" />
            Impacto Esperado
          </h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div
              v-for="(impacto, index) in servicioSeleccionado.impactoDetallado"
              :key="index"
              class="bg-green-50 border-l-4 border-green-500 p-3 rounded"
            >
              <p class="text-sm text-green-800 font-medium">{{ impacto }}</p>
            </div>
          </div>
        </div>

        <!-- Modalidad -->
        <div>
          <h4 class="text-base font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <Layers class="h-5 w-5 text-indigo-600" />
            Modalidad
          </h4>
          <p class="text-sm text-gray-700 bg-indigo-50 p-3 rounded-lg">
            {{ servicioSeleccionado.modalidad }}
          </p>
        </div>

        <!-- Botón de Solicitud -->
        <div class="pt-4 border-t border-gray-200">
          <button
            @click="solicitarImplementacion"
            class="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors text-base font-semibold shadow-lg hover:shadow-xl"
          >
            <Send class="h-5 w-5" />
            Solicitar implementación
          </button>
          <p class="text-xs text-gray-500 text-center mt-2">
            Un asesor se pondrá en contacto contigo para coordinar la implementación
          </p>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useToast } from 'vue-toastification';
import Dialog from 'primevue/dialog';
import Header from '@/components/common/Header.vue';
import {
  Briefcase,
  Clock,
  Monitor,
  Eye,
  Search,
  FileText,
  Target,
  CheckCircle,
  TrendingUp,
  Layers,
  Send,
  Users
} from 'lucide-vue-next';
import { serviciosMock, obtenerCategorias, obtenerColorCategoria, obtenerServicioPorId } from '@/utils/serviciosMock.js';

// TODO: conectar con tabla "servicios" y endpoint de recomendación dinámica en futuras iteraciones.

const route = useRoute();
const toast = useToast();

const categoriaSeleccionada = ref('Todos');
const servicioSeleccionado = ref(null);
const modalDetalleAbierto = ref(false);

const categorias = computed(() => obtenerCategorias());

const serviciosFiltrados = computed(() => {
  if (categoriaSeleccionada.value === 'Todos') {
    return serviciosMock;
  }
  return serviciosMock.filter(s => s.categoria === categoriaSeleccionada.value);
});

const abrirDetalleServicio = (servicio) => {
  servicioSeleccionado.value = servicio;
  modalDetalleAbierto.value = true;
};

const solicitarImplementacion = () => {
  toast.success(
    `Solicitud de "${servicioSeleccionado.value.nombre}" registrada correctamente (mock)`,
    {
      timeout: 4000
    }
  );
  modalDetalleAbierto.value = false;
};

onMounted(() => {
  const servicioId = route.query.servicio;
  if (servicioId) {
    const servicio = obtenerServicioPorId(servicioId);
    if (servicio) {
      abrirDetalleServicio(servicio);
    }
  }
});
</script>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
