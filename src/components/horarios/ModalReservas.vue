<template>
  <!-- Overlay -->
  <div 
    v-if="visible"
    class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
    @click="cerrarSiClickFuera"
  >
    <!-- Modal -->
    <div 
      ref="modalRef"
      class="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
      @click.stop
    >
      <!-- Header -->
      <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-lg">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-semibold text-gray-900">Reservas de la Sesión</h2>
            <p v-if="sesion" class="text-sm text-gray-600 mt-1">
              {{ sesion.titulo }} - {{ formatearFechaHora(sesion.fecha_inicio) }}
            </p>
          </div>
          <button
            @click="$emit('cerrar')"
            class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X class="h-5 w-5 text-gray-500" />
          </button>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="p-8 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p class="mt-2 text-gray-600">Cargando reservas...</p>
      </div>

      <!-- Content -->
      <div v-else class="flex flex-col h-full">
        <!-- Información de la sesión -->
        <div v-if="sesion" class="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Capacidad -->
            <div class="flex items-center">
              <Users class="h-5 w-5 text-gray-400 mr-2" />
              <div>
                <p class="text-sm font-medium text-gray-900">Capacidad</p>
                <p class="text-sm text-gray-600">{{ reservas.length }} / {{ sesion.capacidad_maxima }}</p>
              </div>
            </div>

            <!-- Ocupación -->
            <div class="flex items-center">
              <BarChart3 class="h-5 w-5 text-gray-400 mr-2" />
              <div>
                <p class="text-sm font-medium text-gray-900">Ocupación</p>
                <p class="text-sm text-gray-600">{{ porcentajeOcupacion }}%</p>
              </div>
            </div>

            <!-- Modalidad -->
            <div class="flex items-center">
              <component 
                :is="sesion.modalidad === 'online' ? Globe : MapPin" 
                class="h-5 w-5 text-gray-400 mr-2"
              />
              <div>
                <p class="text-sm font-medium text-gray-900">Modalidad</p>
                <p class="text-sm text-gray-600">{{ sesion.modalidad === 'online' ? 'Online' : 'Presencial' }}</p>
              </div>
            </div>
          </div>

          <!-- Barra de progreso -->
          <div class="mt-4">
            <div class="flex items-center justify-between text-sm mb-1">
              <span class="text-gray-700">Ocupación actual</span>
              <span class="text-gray-500">{{ reservas.length }}/{{ sesion.capacidad_maxima }}</span>
            </div>
            <div class="bg-gray-200 rounded-full h-2">
              <div 
                :class="[
                  'h-2 rounded-full transition-all duration-300',
                  porcentajeOcupacion >= 90 ? 'bg-red-500' :
                  porcentajeOcupacion >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                ]"
                :style="{ width: `${porcentajeOcupacion}%` }"
              ></div>
            </div>
          </div>
        </div>

        <!-- Filtros y búsqueda -->
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div class="flex items-center space-x-4">
              <!-- Búsqueda -->
              <div class="relative">
                <Search class="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  v-model="busqueda"
                  type="text"
                  placeholder="Buscar empleado..."
                  class="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                />
              </div>

              <!-- Filtro por estado -->
              <select v-model="filtroEstado" class="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option value="">Todos los estados</option>
                <option value="confirmada">Confirmadas</option>
                <option value="pendiente">Pendientes</option>
                <option value="cancelada">Canceladas</option>
              </select>
            </div>

            <!-- Estadísticas rápidas -->
            <div class="flex items-center space-x-4 text-sm">
              <span class="flex items-center">
                <div class="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                {{ estadisticas.confirmadas }} confirmadas
              </span>
              <span class="flex items-center">
                <div class="w-2 h-2 bg-yellow-500 rounded-full mr-1"></div>
                {{ estadisticas.pendientes }} pendientes
              </span>
              <span class="flex items-center">
                <div class="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
                {{ estadisticas.canceladas }} canceladas
              </span>
            </div>
          </div>
        </div>

        <!-- Lista de reservas -->
        <div class="flex-1 overflow-y-auto">
          <!-- Empty state -->
          <div v-if="reservasFiltradas.length === 0" class="p-8 text-center">
            <BookmarkCheck class="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 class="text-lg font-medium text-gray-900 mb-2">
              {{ reservas.length === 0 ? 'No hay reservas' : 'No se encontraron resultados' }}
            </h3>
            <p class="text-gray-600">
              {{ reservas.length === 0 
                ? 'Esta sesión aún no tiene ninguna reserva.' 
                : 'Intenta ajustar los filtros de búsqueda.'
              }}
            </p>
          </div>

          <!-- Lista de reservas -->
          <div v-else class="divide-y divide-gray-200">
            <div
              v-for="reserva in reservasFiltradas"
              :key="reserva.id"
              class="p-6 hover:bg-gray-50 transition-colors"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                  <!-- Avatar del empleado -->
                  <div class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <span class="text-sm font-medium text-gray-600">
                      {{ getIniciales(reserva.usuario?.nombre, reserva.usuario?.apellido) }}
                    </span>
                  </div>

                  <!-- Información del empleado -->
                  <div>
                    <h4 class="text-sm font-semibold text-gray-900">
                      {{ reserva.usuario?.nombre }} {{ reserva.usuario?.apellido }}
                    </h4>
                    <p class="text-sm text-gray-600">{{ reserva.usuario?.email }}</p>
                    <div class="flex items-center mt-1 space-x-2">
                      <span class="text-xs text-gray-500">
                        Reservado: {{ formatearFecha(reserva.fecha_reserva) }}
                      </span>
                      <span 
                        :class="[
                          'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                          getClaseEstado(reserva.estado)
                        ]"
                      >
                        {{ getTextoEstado(reserva.estado) }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Estado y acciones -->
                <div class="flex items-center space-x-3">
                  <!-- Asistencia -->
                  <div v-if="esSesionPasada" class="text-center">
                    <p class="text-xs text-gray-500 mb-1">Asistencia</p>
                    <div v-if="reserva.asistio !== null" class="flex items-center justify-center">
                      <component 
                        :is="reserva.asistio ? CheckCircle : XCircle"
                        :class="[
                          'h-5 w-5',
                          reserva.asistio ? 'text-green-500' : 'text-red-500'
                        ]"
                      />
                    </div>
                    <div v-else class="flex space-x-1">
                      <button
                        @click="marcarAsistencia(reserva.id, true)"
                        class="p-1 text-green-500 hover:bg-green-50 rounded transition-colors"
                        title="Marcar como asistido"
                      >
                        <CheckCircle class="h-4 w-4" />
                      </button>
                      <button
                        @click="marcarAsistencia(reserva.id, false)"
                        class="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                        title="Marcar como no asistido"
                      >
                        <XCircle class="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <!-- Calificación -->
                  <div v-if="reserva.calificacion" class="text-center">
                    <p class="text-xs text-gray-500 mb-1">Calificación</p>
                    <div class="flex items-center">
                      <Star
                        v-for="i in 5"
                        :key="i"
                        :class="[
                          'h-3 w-3',
                          i <= reserva.calificacion ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        ]"
                      />
                    </div>
                  </div>

                  <!-- Menú de acciones -->
                  <div class="relative" v-click-outside="() => cerrarMenu(reserva.id)">
                    <button
                      @click="toggleMenu(reserva.id)"
                      class="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
                    >
                      <MoreVertical class="h-4 w-4" />
                    </button>

                    <!-- Dropdown menu -->
                    <div
                      v-if="menuAbierto === reserva.id"
                      class="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-20"
                    >
                      <div class="py-1">
                        <!-- Confirmar reserva -->
                        <button
                          v-if="reserva.estado === 'pendiente'"
                          @click="confirmarReserva(reserva.id)"
                          class="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          <CheckCircle class="h-4 w-4 mr-3 text-green-500" />
                          Confirmar reserva
                        </button>

                        <!-- Enviar recordatorio -->
                        <button
                          v-if="!esSesionPasada && reserva.estado === 'confirmada'"
                          @click="enviarRecordatorio(reserva.id)"
                          class="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          <Bell class="h-4 w-4 mr-3 text-blue-500" />
                          Enviar recordatorio
                        </button>

                        <!-- Ver perfil del empleado -->
                        <button
                          @click="verPerfilEmpleado(reserva.usuario)"
                          class="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          <User class="h-4 w-4 mr-3 text-gray-500" />
                          Ver perfil
                        </button>

                        <div class="border-t border-gray-100"></div>

                        <!-- Cancelar reserva -->
                        <button
                          v-if="reserva.estado === 'confirmada' && !esSesionPasada"
                          @click="cancelarReserva(reserva.id)"
                          class="group flex items-center px-4 py-2 text-sm text-red-700 hover:bg-red-50 w-full text-left"
                        >
                          <XCircle class="h-4 w-4 mr-3 text-red-500" />
                          Cancelar reserva
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Comentario si existe -->
              <div v-if="reserva.comentario" class="mt-3 pl-14">
                <div class="bg-gray-100 rounded-lg p-3">
                  <p class="text-sm text-gray-700">{{ reserva.comentario }}</p>
                </div>
              </div>

              <!-- Información adicional -->
              <div v-if="reserva.checkin_time || reserva.puntos_otorgados" class="mt-3 pl-14">
                <div class="flex items-center space-x-4 text-xs text-gray-500">
                  <span v-if="reserva.checkin_time">
                    Check-in: {{ formatearFechaHora(reserva.checkin_time) }}
                  </span>
                  <span v-if="reserva.puntos_otorgados">
                    Puntos: {{ reserva.puntos_otorgados }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer con acciones -->
        <div class="border-t border-gray-200 px-6 py-4">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-600">
              {{ reservasFiltradas.length }} de {{ reservas.length }} reservas
            </div>
            
            <div class="flex items-center space-x-3">
              <!-- Exportar lista -->
              <button
                @click="exportarReservas"
                class="btn btn-outline btn-sm"
              >
                <Download class="h-4 w-4 mr-2" />
                Exportar
              </button>

              <!-- Enviar recordatorio masivo -->
              <button
                v-if="!esSesionPasada && reservasConfirmadas.length > 0"
                @click="enviarRecordatorioMasivo"
                class="btn btn-primary btn-sm"
              >
                <Bell class="h-4 w-4 mr-2" />
                Recordatorio masivo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { supabase } from '../../../services/supabase';
import { 
  X, Users, BarChart3, Globe, MapPin, Search, BookmarkCheck, 
  CheckCircle, XCircle, Star, MoreVertical, Bell, User, Download
} from 'lucide-vue-next';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  sesionId: {
    type: String,
    default: null
  }
});

defineEmits(['cerrar']);

// Referencias
const modalRef = ref(null);

// Estado reactivo
const loading = ref(false);
const sesion = ref(null);
const reservas = ref([]);
const busqueda = ref('');
const filtroEstado = ref('');
const menuAbierto = ref(null);

// Computed
const porcentajeOcupacion = computed(() => {
  if (!sesion.value) return 0;
  return Math.round((reservas.value.length / sesion.value.capacidad_maxima) * 100);
});

const esSesionPasada = computed(() => {
  if (!sesion.value) return false;
  return new Date(sesion.value.fecha_inicio) < new Date();
});

const reservasFiltradas = computed(() => {
  return reservas.value.filter(reserva => {
    const matchBusqueda = !busqueda.value || 
      `${reserva.usuario?.nombre} ${reserva.usuario?.apellido} ${reserva.usuario?.email}`
        .toLowerCase().includes(busqueda.value.toLowerCase());
    
    const matchEstado = !filtroEstado.value || reserva.estado === filtroEstado.value;
    
    return matchBusqueda && matchEstado;
  });
});

const reservasConfirmadas = computed(() => {
  return reservas.value.filter(r => r.estado === 'confirmada');
});

const estadisticas = computed(() => {
  const stats = { confirmadas: 0, pendientes: 0, canceladas: 0 };
  reservas.value.forEach(reserva => {
    stats[reserva.estado] = (stats[reserva.estado] || 0) + 1;
  });
  return stats;
});

// Métodos
const cargarSesion = async () => {
  if (!props.sesionId) return;
  
  try {
    loading.value = true;
    
    const { data: sesionData, error: sesionError } = await supabase
      .from('sesiones')
      .select(`
        *,
        servicios(nombre, tipo),
        usuarios!colaborador_id(nombre, apellido)
      `)
      .eq('id', props.sesionId)
      .single();
    
    if (sesionError) throw sesionError;
    
    sesion.value = sesionData;
    
  } catch (error) {
    console.error('Error cargando sesión:', error);
  } finally {
    loading.value = false;
  }
};

const cargarReservas = async () => {
  if (!props.sesionId) return;
  
  try {
    const { data, error } = await supabase
      .from('reservas')
      .select(`
        *,
        usuarios!usuario_id(id, nombre, apellido, email)
      `)
      .eq('sesion_id', props.sesionId)
      .order('fecha_reserva', { ascending: false });
    
    if (error) throw error;
    
    reservas.value = data.map(reserva => ({
      ...reserva,
      usuario: reserva.usuarios
    }));
    
  } catch (error) {
    console.error('Error cargando reservas:', error);
  }
};

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

const getClaseEstado = (estado) => {
  const clases = {
    confirmada: 'bg-green-100 text-green-800',
    pendiente: 'bg-yellow-100 text-yellow-800',
    cancelada: 'bg-red-100 text-red-800',
    completada: 'bg-blue-100 text-blue-800'
  };
  return clases[estado] || 'bg-gray-100 text-gray-800';
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

const formatearFechaHora = (fecha) => {
  return new Date(fecha).toLocaleDateString('es-ES', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const marcarAsistencia = async (reservaId, asistio) => {
  try {
    const { error } = await supabase
      .from('reservas')
      .update({ asistio })
      .eq('id', reservaId);
    
    if (error) throw error;
    
    // Actualizar localmente
    const reserva = reservas.value.find(r => r.id === reservaId);
    if (reserva) {
      reserva.asistio = asistio;
    }
    
    menuAbierto.value = null;
    
  } catch (error) {
    console.error('Error marcando asistencia:', error);
    alert('Error al marcar la asistencia');
  }
};

const confirmarReserva = async (reservaId) => {
  try {
    const { error } = await supabase
      .from('reservas')
      .update({ estado: 'confirmada' })
      .eq('id', reservaId);
    
    if (error) throw error;
    
    // Actualizar localmente
    const reserva = reservas.value.find(r => r.id === reservaId);
    if (reserva) {
      reserva.estado = 'confirmada';
    }
    
    menuAbierto.value = null;
    
  } catch (error) {
    console.error('Error confirmando reserva:', error);
    alert('Error al confirmar la reserva');
  }
};

const cancelarReserva = async (reservaId) => {
  if (!confirm('¿Estás seguro de que quieres cancelar esta reserva?')) return;
  
  try {
    const { error } = await supabase
      .from('reservas')
      .update({ 
        estado: 'cancelada', 
        fecha_cancelacion: new Date().toISOString() 
      })
      .eq('id', reservaId);
    
    if (error) throw error;
    
    // Actualizar localmente
    const reserva = reservas.value.find(r => r.id === reservaId);
    if (reserva) {
      reserva.estado = 'cancelada';
    }
    
    menuAbierto.value = null;
    
  } catch (error) {
    console.error('Error cancelando reserva:', error);
    alert('Error al cancelar la reserva');
  }
};

const enviarRecordatorio = (reservaId) => {
  // Implementar lógica para enviar recordatorio
  console.log('Enviar recordatorio:', reservaId);
  menuAbierto.value = null;
};

const enviarRecordatorioMasivo = () => {
  if (!confirm(`¿Enviar recordatorio a ${reservasConfirmadas.value.length} participantes?`)) return;
  
  // Implementar lógica para recordatorio masivo
  console.log('Enviar recordatorio masivo');
};

const verPerfilEmpleado = (usuario) => {
  // Implementar navegación al perfil del empleado
  console.log('Ver perfil:', usuario);
  menuAbierto.value = null;
};

const exportarReservas = () => {
  // Implementar exportación a CSV/Excel
  console.log('Exportar reservas');
};

const cerrarSiClickFuera = (event) => {
  if (event.target === event.currentTarget) {
    $emit('cerrar');
  }
};

// Watchers
watch(() => props.visible, (nuevoValor) => {
  if (nuevoValor && props.sesionId) {
    cargarSesion();
    cargarReservas();
  }
});

watch(() => props.sesionId, (nuevoId) => {
  if (nuevoId && props.visible) {
    cargarSesion();
    cargarReservas();
  }
});

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
.btn-sm {
  @apply px-3 py-1.5 text-xs;
}

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