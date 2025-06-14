<template>
  <div class="overflow-x-auto">
    <!-- Loading state -->
    <div v-if="loading" class="p-8 text-center">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      <p class="mt-2 text-gray-600">Cargando sesiones...</p>
    </div>

    <!-- Empty state -->
    <div v-else-if="sesiones.length === 0" class="p-8 text-center">
      <Calendar class="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">No hay sesiones</h3>
      <p class="text-gray-600">No se encontraron sesiones con los filtros aplicados.</p>
    </div>

    <!-- Tabla de sesiones -->
    <table v-else class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Sesión
          </th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Colaborador
          </th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Fecha y Hora
          </th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Modalidad
          </th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Ocupación
          </th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Estado
          </th>
          <th scope="col" class="relative px-6 py-3">
            <span class="sr-only">Acciones</span>
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr 
          v-for="sesion in sesiones" 
          :key="sesion.id"
          class="hover:bg-gray-50 transition-colors duration-150"
        >
          <!-- Información de la sesión -->
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex items-center">
              <div 
                :class="[
                  'flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center',
                  getColorFondoServicio(sesion.tipo_servicio)
                ]"
              >
                <component 
                  :is="getIconoServicio(sesion.tipo_servicio)" 
                  :class="['h-5 w-5', getColorIconoServicio(sesion.tipo_servicio)]"
                />
              </div>
              <div class="ml-4">
                <div class="text-sm font-medium text-gray-900">
                  {{ sesion.titulo }}
                </div>
                <div class="text-sm text-gray-500">
                  {{ sesion.servicio_nombre }}
                </div>
              </div>
            </div>
          </td>

          <!-- Colaborador -->
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex items-center">
              <div class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                <span class="text-xs font-medium text-gray-600">
                  {{ getIniciales(sesion.colaborador_nombre) }}
                </span>
              </div>
              <div class="ml-3">
                <div class="text-sm font-medium text-gray-900">
                  {{ sesion.colaborador_nombre }}
                </div>
              </div>
            </div>
          </td>

          <!-- Fecha y Hora -->
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900">
              {{ formatearFecha(sesion.fecha_inicio) }}
            </div>
            <div class="text-sm text-gray-500">
              {{ formatearHora(sesion.fecha_inicio) }} - {{ formatearHora(sesion.fecha_fin) }}
            </div>
          </td>

          <!-- Modalidad -->
          <td class="px-6 py-4 whitespace-nowrap">
            <span 
              :class="[
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                sesion.modalidad === 'online' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-green-100 text-green-800'
              ]"
            >
              <component 
                :is="sesion.modalidad === 'online' ? Globe : MapPin" 
                class="h-3 w-3 mr-1"
              />
              {{ sesion.modalidad === 'online' ? 'Online' : 'Presencial' }}
            </span>
          </td>

          <!-- Ocupación -->
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex items-center">
              <div class="flex-1">
                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-900">{{ calcularReservas(sesion) }}</span>
                  <span class="text-gray-500">{{ sesion.capacidad_maxima }}</span>
                </div>
                <div class="mt-1 bg-gray-200 rounded-full h-2">
                  <div 
                    :class="[
                      'h-2 rounded-full transition-all duration-300',
                      getPorcentajeOcupacion(sesion) >= 90 ? 'bg-red-500' :
                      getPorcentajeOcupacion(sesion) >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                    ]"
                    :style="{ width: `${getPorcentajeOcupacion(sesion)}%` }"
                  ></div>
                </div>
              </div>
              <span class="ml-3 text-sm text-gray-500">
                {{ getPorcentajeOcupacion(sesion) }}%
              </span>
            </div>
          </td>

          <!-- Estado -->
          <td class="px-6 py-4 whitespace-nowrap">
            <span 
              :class="[
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                getClaseEstado(sesion.estado_sesion)
              ]"
            >
              {{ getTextoEstado(sesion.estado_sesion) }}
            </span>
          </td>

          <!-- Acciones -->
          <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <div class="flex items-center justify-end space-x-2">
              <!-- Ver reservas -->
              <button
                @click="$emit('ver-reservas', sesion.id)"
                class="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                title="Ver reservas"
              >
                <Users class="h-4 w-4" />
              </button>

              <!-- Editar -->
              <button
                @click="$emit('editar', sesion)"
                class="p-2 text-gray-400 hover:text-green-600 transition-colors"
                title="Editar sesión"
              >
                <Edit class="h-4 w-4" />
              </button>

              <!-- Menú de acciones -->
              <div class="relative" v-click-outside="() => cerrarMenu(sesion.id)">
                <button
                  @click="toggleMenu(sesion.id)"
                  class="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <MoreVertical class="h-4 w-4" />
                </button>

                <!-- Dropdown menu -->
                <div
                  v-if="menuAbierto === sesion.id"
                  class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                >
                  <div class="py-1">
                    <button
                      @click="duplicarSesion(sesion)"
                      class="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      <Copy class="h-4 w-4 mr-3 text-gray-400 group-hover:text-gray-500" />
                      Duplicar sesión
                    </button>
                    
                    <button
                      v-if="sesion.estado_sesion === 'programada'"
                      @click="cancelarSesion(sesion)"
                      class="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      <X class="h-4 w-4 mr-3 text-gray-400 group-hover:text-gray-500" />
                      Cancelar sesión
                    </button>

                    <div class="border-t border-gray-100"></div>
                    
                    <button
                      @click="$emit('eliminar', sesion.id)"
                      class="group flex items-center px-4 py-2 text-sm text-red-700 hover:bg-red-50 w-full text-left"
                    >
                      <Trash2 class="h-4 w-4 mr-3 text-red-400 group-hover:text-red-500" />
                      Eliminar sesión
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Paginación -->
    <div v-if="sesiones.length > 0" class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center text-sm text-gray-700">
          <span>Mostrando</span>
          <span class="font-medium mx-1">{{ (paginaActual - 1) * elementosPorPagina + 1 }}</span>
          <span>a</span>
          <span class="font-medium mx-1">{{ Math.min(paginaActual * elementosPorPagina, totalElementos) }}</span>
          <span>de</span>
          <span class="font-medium mx-1">{{ totalElementos }}</span>
          <span>resultados</span>
        </div>
        
        <div class="flex items-center space-x-2">
          <button
            @click="paginaAnterior"
            :disabled="paginaActual === 1"
            class="btn btn-outline btn-sm"
            :class="{ 'opacity-50 cursor-not-allowed': paginaActual === 1 }"
          >
            <ChevronLeft class="h-4 w-4 mr-1" />
            Anterior
          </button>
          
          <span class="text-sm text-gray-700">
            Página {{ paginaActual }} de {{ totalPaginas }}
          </span>
          
          <button
            @click="siguientePagina"
            :disabled="paginaActual === totalPaginas"
            class="btn btn-outline btn-sm"
            :class="{ 'opacity-50 cursor-not-allowed': paginaActual === totalPaginas }"
          >
            Siguiente
            <ChevronRight class="h-4 w-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { 
  Calendar, Users, Edit, MoreVertical, Copy, X, Trash2, Globe, MapPin,
  ChevronLeft, ChevronRight,
  Activity, Brain, Apple, MessageCircle, Heart, Dumbbell
} from 'lucide-vue-next';

const props = defineProps({
  sesiones: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
});

defineEmits(['editar', 'eliminar', 'ver-reservas']);

// Estado reactivo
const menuAbierto = ref(null);
const paginaActual = ref(1);
const elementosPorPagina = ref(10);

// Computed
const totalElementos = computed(() => props.sesiones.length);
const totalPaginas = computed(() => Math.ceil(totalElementos.value / elementosPorPagina.value));

// Métodos
const toggleMenu = (sesionId) => {
  menuAbierto.value = menuAbierto.value === sesionId ? null : sesionId;
};

const cerrarMenu = (sesionId) => {
  if (menuAbierto.value === sesionId) {
    menuAbierto.value = null;
  }
};

const getIconoServicio = (tipo) => {
  const iconos = {
    yoga: Activity,
    meditacion: Brain,
    nutricion: Apple,
    coaching: MessageCircle,
    psicoterapia: Heart,
    entrenamiento: Dumbbell
  };
  return iconos[tipo] || Activity;
};

const getColorFondoServicio = (tipo) => {
  const colores = {
    yoga: 'bg-green-100',
    meditacion: 'bg-purple-100',
    nutricion: 'bg-yellow-100',
    coaching: 'bg-blue-100',
    psicoterapia: 'bg-pink-100',
    entrenamiento: 'bg-red-100'
  };
  return colores[tipo] || 'bg-gray-100';
};

const getColorIconoServicio = (tipo) => {
  const colores = {
    yoga: 'text-green-600',
    meditacion: 'text-purple-600',
    nutricion: 'text-yellow-600',
    coaching: 'text-blue-600',
    psicoterapia: 'text-pink-600',
    entrenamiento: 'text-red-600'
  };
  return colores[tipo] || 'text-gray-600';
};

const getIniciales = (nombre) => {
  return nombre.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
};

const formatearHora = (fecha) => {
  return new Date(fecha).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const calcularReservas = (sesion) => {
  // Por ahora devolvemos un número simulado
  // En producción esto debería venir de las reservas reales
  return Math.floor(Math.random() * sesion.capacidad_maxima);
};

const getPorcentajeOcupacion = (sesion) => {
  const reservas = calcularReservas(sesion);
  return Math.round((reservas / sesion.capacidad_maxima) * 100);
};

const getClaseEstado = (estado) => {
  const clases = {
    programada: 'bg-green-100 text-green-800',
    cancelada: 'bg-red-100 text-red-800',
    completada: 'bg-blue-100 text-blue-800',
    en_curso: 'bg-yellow-100 text-yellow-800'
  };
  return clases[estado] || 'bg-gray-100 text-gray-800';
};

const getTextoEstado = (estado) => {
  const textos = {
    programada: 'Programada',
    cancelada: 'Cancelada',
    completada: 'Completada',
    en_curso: 'En Curso'
  };
  return textos[estado] || 'Desconocido';
};

const duplicarSesion = (sesion) => {
  // Crear una copia de la sesión con nueva fecha
  const nuevaSesion = {
    ...sesion,
    id: undefined,
    titulo: `${sesion.titulo} (Copia)`,
    fecha_inicio: new Date(new Date(sesion.fecha_inicio).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    fecha_fin: new Date(new Date(sesion.fecha_fin).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()
  };
  
  // Emitir evento para crear nueva sesión
  console.log('Duplicar sesión:', nuevaSesion);
  menuAbierto.value = null;
};

const cancelarSesion = async (sesion) => {
  if (!confirm('¿Estás seguro de que quieres cancelar esta sesión?')) return;
  
  try {
    // Aquí iría la lógica para cancelar la sesión
    console.log('Cancelar sesión:', sesion.id);
    menuAbierto.value = null;
  } catch (error) {
    console.error('Error cancelando sesión:', error);
  }
};

const paginaAnterior = () => {
  if (paginaActual.value > 1) {
    paginaActual.value--;
  }
};

const siguientePagina = () => {
  if (paginaActual.value < totalPaginas.value) {
    paginaActual.value++;
  }
};

// Directiva personalizada para cerrar menús al hacer clic fuera
const vClickOutside = {
  beforeMount(el, binding) {
    el.clickOutsideEvent = function(event) {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value();
      }
    };
    document.addEventListener('click', el.clickOutsideEvent);
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent);
  }
};
</script>

<style scoped>
.table-container {
  @apply overflow-hidden rounded-lg border border-gray-200;
}

.table-row {
  @apply hover:bg-gray-50 transition-colors duration-150;
}

.ocupacion-bar {
  transition: width 0.3s ease-in-out;
}

.menu-dropdown {
  @apply absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10;
}

.menu-item {
  @apply group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left transition-colors;
}

.menu-item:hover {
  @apply bg-gray-100;
}

.menu-item.danger {
  @apply text-red-700 hover:bg-red-50;
}

.loading-spinner {
  @apply animate-spin rounded-full border-b-2 border-primary;
}
</style>