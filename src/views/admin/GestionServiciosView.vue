<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <Header subtitulo="Gestión de Servicios" />
    
    <!-- Main Content -->
    <div class="py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="mb-8">
          <div class="flex justify-between items-center">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">Gestión de Servicios</h1>
              <p class="mt-2 text-lg text-gray-600">Programa sesiones para los servicios solicitados</p>
            </div>
            <Button 
              @click="volverAlDashboard"
              variant="outline"
            >
              <ArrowLeft class="h-5 w-5 mr-2" />
              Volver al Dashboard
            </Button>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="bg-white rounded-lg shadow-sm p-8 text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent mx-auto mb-4"></div>
          <p class="text-gray-600">Cargando servicios solicitados...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle class="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-red-800 mb-2">Error al cargar los servicios</h3>
          <p class="text-red-600 mb-4">{{ error }}</p>
          <Button @click="cargarServiciosSolicitados" variant="outline">
            <RefreshCw class="h-4 w-4 mr-2" />
            Reintentar
          </Button>
        </div>

        <!-- Empty State -->
        <div v-else-if="serviciosSolicitados.length === 0" class="bg-white rounded-lg shadow-sm p-12 text-center">
          <Calendar class="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">No hay servicios solicitados</h3>
          <p class="text-gray-500 mb-6">Los servicios aparecerán aquí cuando sean solicitados desde los resultados de encuestas</p>
        </div>

        <!-- Servicios Solicitados -->
        <div v-else class="space-y-6">
          <div 
            v-for="servicio in serviciosSolicitados" 
            :key="servicio.id"
            class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
          >
            <!-- Header del Servicio -->
            <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <h3 class="text-lg font-semibold text-gray-900 mb-2">
                    {{ servicio.servicioTitulo }}
                  </h3>
                  <div class="flex items-center space-x-4 text-sm text-gray-500">
                    <div class="flex items-center">
                      <Calendar class="h-4 w-4 mr-1" />
                      <span>Solicitado el {{ formatearFecha(servicio.fechaSolicitud) }}</span>
                    </div>
                    <div class="flex items-center">
                      <User class="h-4 w-4 mr-1" />
                      <span>Por {{ servicio.solicitadoPor }}</span>
                    </div>
                  </div>
                </div>
                <span 
                  :class="[
                    'px-3 py-1 rounded-full text-xs font-medium',
                    servicio.estado === 'aprobado' ? 'bg-green-100 text-green-800' :
                    servicio.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  ]"
                >
                  {{ servicio.estado === 'aprobado' ? 'Aprobado' : 
                     servicio.estado === 'pendiente' ? 'Pendiente' : servicio.estado }}
                </span>
              </div>
            </div>

            <!-- Contenido del Servicio -->
            <div class="p-6">
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <p v-if="servicio.notas" class="text-gray-600 mb-4">
                    <strong>Notas:</strong> {{ servicio.notas }}
                  </p>
                  
                  <!-- Sesiones ya programadas -->
                  <div v-if="getSesionesPorServicio(servicio.servicioId).length > 0" class="mb-4">
                    <h4 class="text-sm font-medium text-gray-900 mb-2">Sesiones Programadas:</h4>
                    <div class="space-y-2">
                      <div 
                        v-for="sesion in getSesionesPorServicio(servicio.servicioId)" 
                        :key="sesion.id"
                        class="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200"
                      >
                        <div>
                          <p class="font-medium text-blue-900">{{ sesion.titulo }}</p>
                          <p class="text-sm text-blue-700">
                            {{ formatearFecha(sesion.fecha) }} a las {{ sesion.hora }}
                          </p>
                        </div>
                        <div class="text-right">
                          <p class="text-sm font-medium text-blue-900">
                            {{ sesion.participantes.length }}/{{ sesion.plazasTotales }} plazas
                          </p>
                          <p class="text-xs text-blue-600">{{ sesion.modalidad }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="ml-6">
                  <Button 
                    @click="abrirModalProgramar(servicio)"
                    :disabled="servicio.estado !== 'aprobado'"
                  >
                    <Plus class="h-4 w-4 mr-2" />
                    Programar Sesión
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para Programar Sesión -->
    <Dialog 
      v-model:visible="mostrarModal" 
      modal 
      header="Programar Nueva Sesión"
      :style="{ width: '600px' }"
    >
      <div v-if="servicioSeleccionado" class="space-y-6">
        <!-- Información del Servicio -->
        <div class="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 class="font-medium text-blue-900 mb-1">{{ servicioSeleccionado.servicioTitulo }}</h4>
          <p class="text-sm text-blue-700">Programando nueva sesión para este servicio</p>
        </div>

        <!-- Formulario -->
        <form @submit.prevent="crearSesion" class="space-y-4">
          <!-- Título de la Sesión -->
          <div class="form-group">
            <label for="titulo" class="form-label">Título de la Sesión *</label>
            <input
              id="titulo"
              v-model="nuevaSesion.titulo"
              type="text"
              class="input"
              placeholder="Ej: Taller de Mindfulness - Sesión Matutina"
              required
            />
          </div>

          <!-- Descripción -->
          <div class="form-group">
            <label for="descripcion" class="form-label">Descripción</label>
            <textarea
              id="descripcion"
              v-model="nuevaSesion.descripcion"
              rows="3"
              class="input"
              placeholder="Descripción breve de la sesión..."
            ></textarea>
          </div>

          <!-- Fecha y Hora -->
          <div class="grid grid-cols-2 gap-4">
            <div class="form-group">
              <label for="fecha" class="form-label">Fecha *</label>
              <input
                id="fecha"
                v-model="nuevaSesion.fecha"
                type="date"
                class="input"
                :min="fechaMinima"
                required
              />
            </div>
            <div class="form-group">
              <label for="hora" class="form-label">Hora *</label>
              <input
                id="hora"
                v-model="nuevaSesion.hora"
                type="time"
                class="input"
                required
              />
            </div>
          </div>

          <!-- Duración y Plazas -->
          <div class="grid grid-cols-2 gap-4">
            <div class="form-group">
              <label for="duracion" class="form-label">Duración (minutos) *</label>
              <input
                id="duracion"
                v-model="nuevaSesion.duracion"
                type="number"
                class="input"
                min="30"
                max="480"
                step="15"
                required
              />
            </div>
            <div class="form-group">
              <label for="plazas" class="form-label">Plazas Totales *</label>
              <input
                id="plazas"
                v-model="nuevaSesion.plazasTotales"
                type="number"
                class="input"
                min="1"
                max="50"
                required
              />
            </div>
          </div>

          <!-- Modalidad -->
          <div class="form-group">
            <label for="modalidad" class="form-label">Modalidad *</label>
            <select
              id="modalidad"
              v-model="nuevaSesion.modalidad"
              class="input"
              required
            >
              <option value="">Selecciona modalidad</option>
              <option value="presencial">Presencial</option>
              <option value="virtual">Virtual</option>
              <option value="hibrida">Híbrida</option>
            </select>
          </div>

          <!-- Ubicación (solo si es presencial o híbrida) -->
          <div v-if="nuevaSesion.modalidad === 'presencial' || nuevaSesion.modalidad === 'hibrida'" class="form-group">
            <label for="ubicacion" class="form-label">Ubicación *</label>
            <input
              id="ubicacion"
              v-model="nuevaSesion.ubicacion"
              type="text"
              class="input"
              placeholder="Ej: Sala de Reuniones Principal"
              required
            />
          </div>

          <!-- Instructor -->
          <div class="form-group">
            <label for="instructor" class="form-label">Instructor</label>
            <input
              id="instructor"
              v-model="nuevaSesion.instructor"
              type="text"
              class="input"
              placeholder="Nombre del instructor o especialista"
            />
          </div>
        </form>
      </div>

      <template #footer>
        <div class="flex justify-end space-x-4">
          <Button 
            @click="cerrarModal"
            variant="outline"
            :disabled="creandoSesion"
          >
            Cancelar
          </Button>
          <Button 
            @click="crearSesion"
            :loading="creandoSesion"
            :disabled="!formularioValido"
          >
            <Calendar class="h-4 w-4 mr-2" />
            Programar Sesión
          </Button>
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { storeToRefs } from 'pinia';
import { useSesionesStore } from '@/stores/sesiones.store';
import Header from '@/components/common/Header.vue';
import Button from '@/components/common/Button.vue';
import Dialog from 'primevue/dialog';
import { 
  ArrowLeft, 
  AlertCircle, 
  RefreshCw, 
  Calendar, 
  User,
  Plus
} from 'lucide-vue-next';

const router = useRouter();
const toast = useToast();
const sesionesStore = useSesionesStore();

// Store state
const { serviciosSolicitados, sesiones, loading, error } = storeToRefs(sesionesStore);
const { cargarServiciosSolicitados, cargarSesiones, crearSesion: crearSesionStore } = sesionesStore;

// Local state
const mostrarModal = ref(false);
const servicioSeleccionado = ref(null);
const creandoSesion = ref(false);
const nuevaSesion = ref({
  titulo: '',
  descripcion: '',
  fecha: '',
  hora: '',
  duracion: 60,
  plazasTotales: 10,
  modalidad: '',
  ubicacion: '',
  instructor: ''
});

// Computed properties
const fechaMinima = computed(() => {
  return new Date().toISOString().split('T')[0];
});

const formularioValido = computed(() => {
  return nuevaSesion.value.titulo.trim() &&
         nuevaSesion.value.fecha &&
         nuevaSesion.value.hora &&
         nuevaSesion.value.duracion > 0 &&
         nuevaSesion.value.plazasTotales > 0 &&
         nuevaSesion.value.modalidad &&
         (nuevaSesion.value.modalidad === 'virtual' || nuevaSesion.value.ubicacion.trim());
});

// Methods
const volverAlDashboard = () => {
  router.push('/admin/dashboard');
};

const formatearFecha = (fecha) => {
  return new Date(fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const getSesionesPorServicio = (servicioId) => {
  return sesiones.value.filter(sesion => sesion.servicioId === servicioId);
};

const abrirModalProgramar = (servicio) => {
  servicioSeleccionado.value = servicio;
  // Pre-llenar algunos campos basados en el servicio
  nuevaSesion.value.titulo = `${servicio.servicioTitulo} - Nueva Sesión`;
  nuevaSesion.value.servicioId = servicio.servicioId;
  mostrarModal.value = true;
};

const cerrarModal = () => {
  mostrarModal.value = false;
  servicioSeleccionado.value = null;
  // Resetear formulario
  nuevaSesion.value = {
    titulo: '',
    descripcion: '',
    fecha: '',
    hora: '',
    duracion: 60,
    plazasTotales: 10,
    modalidad: '',
    ubicacion: '',
    instructor: ''
  };
};

const crearSesion = async () => {
  if (!formularioValido.value) {
    toast.add({
      severity: 'warn',
      summary: 'Formulario incompleto',
      detail: 'Por favor completa todos los campos requeridos',
      life: 4000
    });
    return;
  }

  creandoSesion.value = true;
  
  try {
    await crearSesionStore({
      ...nuevaSesion.value,
      servicioId: servicioSeleccionado.value.servicioId
    });
    
    toast.add({
      severity: 'success',
      summary: '¡Sesión programada!',
      detail: 'La sesión ha sido creada y estará disponible para reservas',
      life: 5000
    });
    
    cerrarModal();
    // Recargar sesiones para mostrar la nueva
    await cargarSesiones();
    
  } catch (error) {
    console.error('Error al crear sesión:', error);
    toast.add({
      severity: 'error',
      summary: 'Error al programar',
      detail: error.message || 'No se pudo crear la sesión',
      life: 5000
    });
  } finally {
    creandoSesion.value = false;
  }
};

// Load data on mount
onMounted(async () => {
  await cargarServiciosSolicitados();
  await cargarSesiones();
});
</script>

<style scoped>
.form-group {
  @apply mb-4;
}

.form-label {
  @apply block text-sm font-medium text-gray-700 mb-1;
}

.input {
  @apply w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary;
}
</style>