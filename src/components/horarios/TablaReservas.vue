<template>
  <div class="overflow-x-auto">
    <!-- Loading state -->
    <div v-if="loading" class="p-8 text-center">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      <p class="mt-2 text-gray-600">Cargando reservas...</p>
    </div>

    <!-- Empty state -->
    <div v-else-if="reservas.length === 0" class="p-8 text-center">
      <BookmarkCheck class="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">No hay reservas</h3>
      <p class="text-gray-600">No se encontraron reservas en el sistema.</p>
    </div>

    <!-- Tabla de reservas -->
    <table v-else class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Empleado
          </th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Sesión
          </th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Fecha Reserva
          </th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Estado
          </th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Asistencia
          </th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Calificación
          </th>
          <th scope="col" class="relative px-6 py-3">
            <span class="sr-only">Acciones</span>
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr 
          v-for="reserva in reservas" 
          :key="reserva.id"
          class="hover:bg-gray-50 transition-colors duration-150"
        >
          <!-- Empleado -->
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex items-center">
              <div class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                <span class="text-sm font-medium text-gray-600">
                  {{ getIniciales(reserva.usuarios?.nombre, reserva.usuarios?.apellido) }}
                </span>
              </div>
              <div class="ml-4">
                <div class="text-sm font-medium text-gray-900">
                  {{ reserva.usuarios?.nombre }} {{ reserva.usuarios?.apellido }}
                </div>
                <div class="text-sm text-gray-500">
                  {{ reserva.usuarios?.email }}
                </div>
              </div>
            </div>
          </td>

          <!-- Sesión -->
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex items-center">
              <div 
                :class="[
                  'flex-shrink-0 h-8 w-8 rounded-lg flex items-center justify-center',
                  getColorFondoServicio(reserva.sesiones?.servicios?.tipo)
                ]"
              >
                <component 
                  :is="getIconoServicio(reserva.sesiones?.servicios?.tipo)" 
                  :class="['h-4 w-4', getColorIconoServicio(reserva.sesiones?.servicios?.tipo)]"
                />
              </div>
              <div class="ml-3">
                <div class="text-sm font-medium text-gray-900">
                  {{ reserva.sesiones?.titulo }}
                </div>
                <div class="text-sm text-gray-500">
                  {{ formatearFechaHora(reserva.sesiones?.fecha_inicio) }}
                </div>
              </div>
            </div>
          </td>

          <!-- Fecha Reserva -->
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900">
              {{ formatearFecha(reserva.fecha_reserva) }}
            </div>
            <div class="text-sm text-gray-500">
              {{ formatearHora(reserva.fecha_reserva) }}
            </div>
          </td>

          <!-- Estado -->
          <td class="px-6 py-4 whitespace-nowrap">
            <span 
              :class="[
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                getClaseEstado(reserva.estado)
              ]"
            >
              <component 
                :is="getIconoEstado(reserva.estado)" 
                class="h-3 w-3 mr-1"
              />
              {{ getTextoEstado(reserva.estado) }}
            </span>
          </td>

          <!-- Asistencia -->
          <td class="px-6 py-4 whitespace-nowrap">
            <div v-if="reserva.asistio !== null" class="flex items-center">
              <component 
                :is="reserva.asistio ? CheckCircle : XCircle"
                :class="[
                  'h-5 w-5 mr-2',
                  reserva.asistio ? 'text-green-500' : 'text-red-500'
                ]"
              />
              <span 
                :class="[
                  'text-sm font-medium',
                  reserva.asistio ? 'text-green-700' : 'text-red-700'
                ]"
              >
                {{ reserva.asistio ? 'Asistió' : 'No asistió' }}
              </span>
            </div>
            <div v-else-if="esSesionPasada(reserva.sesiones?.fecha_inicio)" class="flex items-center">
              <Clock class="h-5 w-5 mr-2 text-yellow-500" />
              <span class="text-sm text-yellow-700">Pendiente</span>
            </div>
            <div v-else class="flex items-center">
              <Minus class="h-5 w-5 mr-2 text-gray-400" />
              <span class="text-sm text-gray-500">N/A</span>
            </div>
          </td>

          <!-- Calificación -->
          <td class="px-6 py-4 whitespace-nowrap">
            <div v-if="reserva.calificacion" class="flex items-center">
              <div class="flex items-center">
                <Star
                  v-for="i in 5"
                  :key="i"
                  :class="[
                    'h-4 w-4',
                    i <= reserva.calificacion ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  ]"
                />
              </div>
              <span class="ml-2 text-sm text-gray-600">{{ reserva.calificacion }}/5</span>
            </div>
            <div v-else-if="reserva.asistio && esSesionPasada(reserva.sesiones?.fecha_inicio)">
              <span class="text-sm text-gray-500">Sin calificar</span>
            </div>
            <div v-else>
              <span class="text-sm text-gray-400">-</span>
            </div>
          </td>

          <!-- Acciones -->
          <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <div class="flex items-center justify-end space-x-2">
              <!-- Ver detalle -->
              <button
                @click="$emit('ver-detalle', reserva)"
                class="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                title="Ver detalle"
              >
                <Eye class="h-4 w-4" />
              </button>

              <!-- Menú de acciones -->
              <div class="relative" v-click-outside="() => cerrarMenu(reserva.id)">
                <button
                  @click="toggleMenu(reserva.id)"
                  class="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <MoreVertical class="h-4 w-4" />
                </button>

                <!-- Dropdown menu -->
                <div
                  v-if="menuAbierto === reserva.id"
                  class="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                >
                  <div class="py-1">
                    <!-- Confirmar reserva -->
                    <button
                      v-if="reserva.estado === 'pendiente'"
                      @click="$emit('confirmar', reserva.id)"
                      class="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      <CheckCircle class="h-4 w-4 mr-3 text-green-500" />
                      Confirmar reserva
                    </button>

                    <!-- Marcar asistencia -->
                    <button
                      v-if="esSesionPasada(reserva.sesiones?.fecha_inicio) && reserva.asistio === null"
                      @click="marcarAsistencia(reserva.id, true)"
                      class="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      <UserCheck class="h-4 w-4 mr-3 text-green-500" />
                      Marcar como asistido
                    </button>

                    <button
                      v-if="esSesionPasada(reserva.sesiones?.fecha_inicio) && reserva.asistio === null"
                      @click="marcarAsistencia(reserva.id, false)"
                      class="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      <UserX class="h-4 w-4 mr-3 text-red-500" />
                      Marcar como no asistido
                    </button>

                    <!-- Enviar recordatorio -->
                    <button
                      v-if="!esSesionPasada(reserva.sesiones?.fecha_inicio) && reserva.estado === 'confirmada'"
                      @click="enviarRecordatorio(reserva.id)"
                      class="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      <Bell class="h-4 w-4 mr-3 text-blue-500" />
                      Enviar recordatorio
                    </button>

                    <div class="border-t border-gray-100"></div>

                    <!-- Cancelar reserva -->
                    <button
                      v-if="reserva.estado === 'confirmada' && !esSesionPasada(reserva.sesiones?.fecha_inicio)"
                      @click="$emit('cancelar', reserva.id)"
                      class="group flex items-center px-4 py-2 text-sm text-red-700 hover:bg-red-50 w-full text-left"
                    >
                      <XCircle class="h-4 w-4 mr-3 text-red-500" />
                      Cancelar reserva
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
    <div v-if="reservas.length > 0" class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center text-sm text-gray-700">
          <span>Mostrando {{ reservas.length }} reservas</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { 
  BookmarkCheck, CheckCircle, XCircle, Clock, Minus, Star, Eye, MoreVertical,
  UserCheck, UserX, Bell,
  Activity, Brain, Apple, MessageCircle, Heart, Dumbbell
} from 'lucide-vue-next';

const props = defineProps({
  reservas: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
});

defineEmits(['cancelar', 'confirmar', 'ver-detalle']);

// Estado reactivo
const menuAbierto = ref(null);

// Métodos
const toggleMenu = (reservaId) => {
  menuAbierto.value = menuAbierto.value === reservaId ? null : reservaId;
};

const cerrarMenu = (reservaId) => {
  if (menuAbierto.value === reservaId) {
    menuAbierto.value = null;
  }
};

const getIniciales = (nombre, apellido) => {
  const n = nombre?.charAt(0) || '';
  const a = apellido?.charAt(0) || '';
  return (n + a).toUpperCase();
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

const getClaseEstado = (estado) => {
  const clases = {
    confirmada: 'bg-green-100 text-green-800',
    pendiente: 'bg-yellow-100 text-yellow-800',
    cancelada: 'bg-red-100 text-red-800',
    completada: 'bg-blue-100 text-blue-800'
  };
  return clases[estado] || 'bg-gray-100 text-gray-800';
};

const getIconoEstado = (estado) => {
  const iconos = {
    confirmada: CheckCircle,
    pendiente: Clock,
    cancelada: XCircle,
    completada: CheckCircle
  };
  return iconos[estado] || Clock;
};

const getTextoEstado = (estado) => {
  const textos = {
    confirmada: 'Confirmada',
    pendiente: 'Pendiente',
    cancelada: 'Cancelada',
    completada: 'Completada'
  };
  return textos[estado] || estado;
};

const formatearFecha = (fecha) => {
  return new Date(fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const formatearHora = (fecha) => {
  return new Date(fecha).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatearFechaHora = (fecha) => {
  return new Date(fecha).toLocaleDateString('es-ES', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const esSesionPasada = (fechaSesion) => {
  return new Date(fechaSesion) < new Date();
};

const marcarAsistencia = (reservaId, asistio) => {
  // Implementar lógica para marcar asistencia
  console.log('Marcar asistencia:', reservaId, asistio);
  menuAbierto.value = null;
};

const enviarRecordatorio = (reservaId) => {
  // Implementar lógica para enviar recordatorio
  console.log('Enviar recordatorio:', reservaId);
  menuAbierto.value = null;
};

// Directiva para cerrar menús al hacer clic fuera
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
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>