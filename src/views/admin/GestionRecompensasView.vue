<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { storeToRefs } from 'pinia';
import { useRecompensasStore } from '@/stores/recompensas.store';
import Card from '@/components/ui/Card.vue';
import Button from '@/components/ui/Button.vue';
import RecompensaFormModal from '@/components/admin/RecompensaFormModal.vue';
import { Plus, CreditCard as Edit3, Trash2, History, TrendingUp, Users, Gift, AlertCircle, RefreshCw } from 'lucide-vue-next';

const router = useRouter();
const toast = useToast();
const recompensasStore = useRecompensasStore();

// Store state
const { recompensas, historialCanjes, loading, error } = storeToRefs(recompensasStore);
const { 
  cargarRecompensas, 
  cargarHistorial, 
  crearRecompensa, 
  actualizarRecompensa, 
  eliminarRecompensa 
} = recompensasStore;

// Local state
const mostrarModal = ref(false);
const recompensaSeleccionada = ref(null);
const guardando = ref(false);
const vistaActual = ref('recompensas'); // 'recompensas' o 'historial'

// Computed properties
const totalCanjes = computed(() => historialCanjes.value.length);
const canjesEsteMes = computed(() => {
  const inicioMes = new Date();
  inicioMes.setDate(1);
  inicioMes.setHours(0, 0, 0, 0);
  
  return historialCanjes.value.filter(canje => 
    new Date(canje.fechaCanje) >= inicioMes
  ).length;
});

const puntosCanjeadosTotal = computed(() => {
  return historialCanjes.value.reduce((total, canje) => total + canje.coste, 0);
});

// Methods
const cambiarVista = (vista) => {
  vistaActual.value = vista;
  if (vista === 'historial') {
    cargarHistorial();
  }
};

const abrirModalCrear = () => {
  recompensaSeleccionada.value = null;
  mostrarModal.value = true;
};

const abrirModalEditar = (recompensa) => {
  recompensaSeleccionada.value = recompensa;
  mostrarModal.value = true;
};

const cerrarModal = () => {
  mostrarModal.value = false;
  recompensaSeleccionada.value = null;
};

const handleGuardarRecompensa = async (datosRecompensa) => {
  guardando.value = true;
  
  try {
    if (recompensaSeleccionada.value) {
      // Editar recompensa existente
      await actualizarRecompensa({
        ...datosRecompensa,
        id: recompensaSeleccionada.value.id
      });
      
      toast.add({
        severity: 'success',
        summary: '¡Recompensa actualizada!',
        detail: 'Los cambios han sido guardados correctamente',
        life: 4000
      });
    } else {
      // Crear nueva recompensa
      await crearRecompensa(datosRecompensa);
      
      toast.add({
        severity: 'success',
        summary: '¡Recompensa creada!',
        detail: 'La nueva recompensa está disponible para los empleados',
        life: 4000
      });
    }
    
    cerrarModal();
  } catch (error) {
    console.error('Error al guardar recompensa:', error);
    toast.add({
      severity: 'error',
      summary: 'Error al guardar',
      detail: error.message || 'No se pudo guardar la recompensa',
      life: 5000
    });
  } finally {
    guardando.value = false;
  }
};

const handleEliminar = async (recompensa) => {
  const confirmacion = confirm(
    `¿Estás seguro de que quieres eliminar "${recompensa.titulo}"?\n\nEsta acción no se puede deshacer.`
  );
  
  if (confirmacion) {
    try {
      await eliminarRecompensa(recompensa.id);
      
      toast.add({
        severity: 'success',
        summary: 'Recompensa eliminada',
        detail: `"${recompensa.titulo}" ha sido eliminada del catálogo`,
        life: 4000
      });
    } catch (error) {
      console.error('Error al eliminar recompensa:', error);
      toast.add({
        severity: 'error',
        summary: 'Error al eliminar',
        detail: error.message || 'No se pudo eliminar la recompensa',
        life: 5000
      });
    }
  }
};

const formatearFecha = (fecha) => {
  return new Date(fecha).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

const formatearFechaCompleta = (fecha) => {
  return new Date(fecha).toLocaleDateString('es-ES', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Load data on mount
onMounted(async () => {
  await cargarRecompensas();
  await cargarHistorial();
});
</script>

<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Gestión de Recompensas</h1>
        <p class="mt-2 text-lg text-gray-600">Administra el catálogo y controla los canjes realizados</p>
      </div>
      <Button @click="abrirModalCrear">
        <Plus class="h-5 w-5 mr-2" />
        Nueva Recompensa
      </Button>
    </div>

    <!-- Navigation Tabs -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div class="border-b border-gray-200">
        <nav class="flex space-x-8 px-6" aria-label="Tabs">
          <button
            @click="cambiarVista('recompensas')"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200',
              vistaActual === 'recompensas'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            <div class="flex items-center">
              <Gift class="h-5 w-5 mr-2" />
              Catálogo de Recompensas
            </div>
          </button>
          <button
            @click="cambiarVista('historial')"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200',
              vistaActual === 'historial'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            <div class="flex items-center">
              <History class="h-5 w-5 mr-2" />
              Historial de Canjes
              <span v-if="totalCanjes > 0" class="ml-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                {{ totalCanjes }}
              </span>
            </div>
          </button>
        </nav>
      </div>
    </div>

    <!-- Stats Cards (solo para historial) -->
    <div v-if="vistaActual === 'historial'" class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white rounded-lg shadow-sm p-6 text-center border border-gray-200">
        <div class="text-2xl font-bold text-primary">{{ totalCanjes }}</div>
        <div class="text-sm text-gray-500">Total Canjes</div>
      </div>
      <div class="bg-white rounded-lg shadow-sm p-6 text-center border border-gray-200">
        <div class="text-2xl font-bold text-green-600">{{ canjesEsteMes }}</div>
        <div class="text-sm text-gray-500">Este Mes</div>
      </div>
      <div class="bg-white rounded-lg shadow-sm p-6 text-center border border-gray-200">
        <div class="text-2xl font-bold text-orange-600">{{ puntosCanjeadosTotal }}</div>
        <div class="text-sm text-gray-500">Puntos Canjeados</div>
      </div>
      <div class="bg-white rounded-lg shadow-sm p-6 text-center border border-gray-200">
        <div class="text-2xl font-bold text-blue-600">{{ Math.round(puntosCanjeadosTotal / Math.max(totalCanjes, 1)) }}</div>
        <div class="text-sm text-gray-500">Promedio por Canje</div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="bg-white rounded-lg shadow-sm p-8 text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent mx-auto mb-4"></div>
      <p class="text-gray-600">
        {{ vistaActual === 'recompensas' ? 'Cargando catálogo...' : 'Cargando historial de canjes...' }}
      </p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <AlertCircle class="h-12 w-12 text-red-500 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-red-800 mb-2">Error al cargar datos</h3>
      <p class="text-red-600 mb-4">{{ error }}</p>
      <Button @click="vistaActual === 'recompensas' ? cargarRecompensas() : cargarHistorial()" variant="outline">
        <RefreshCw class="h-4 w-4 mr-2" />
        Reintentar
      </Button>
    </div>

    <!-- Catálogo de Recompensas -->
    <div v-else-if="vistaActual === 'recompensas'">
      <!-- Empty State -->
      <div v-if="recompensas.length === 0" class="bg-white rounded-lg shadow-sm p-12 text-center">
        <Gift class="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">No hay recompensas</h3>
        <p class="text-gray-500 mb-6">Comienza creando tu primera recompensa para los empleados</p>
        <Button @click="abrirModalCrear">
          <Plus class="h-4 w-4 mr-2" />
          Crear Primera Recompensa
        </Button>
      </div>

      <!-- Recompensas Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="recompensa in recompensas" 
          :key="recompensa.id"
          class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 overflow-hidden"
        >
          <!-- Header -->
          <div class="bg-gradient-to-r from-gray-50 to-gray-100 p-4 text-center">
            <div class="text-3xl mb-2">{{ recompensa.icono }}</div>
            <h3 class="text-lg font-semibold text-gray-900">{{ recompensa.titulo }}</h3>
          </div>

          <!-- Content -->
          <div class="p-4">
            <p class="text-sm text-gray-600 mb-4">{{ recompensa.descripcion }}</p>
            
            <!-- Stats -->
            <div class="space-y-3 mb-4">
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500">Coste</span>
                <span class="font-bold text-primary">{{ recompensa.coste }} puntos</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500">Categoría</span>
                <span class="font-medium text-gray-900 capitalize">{{ recompensa.categoria }}</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500">Estado</span>
                <span 
                  :class="[
                    'px-2 py-1 rounded-full text-xs font-medium',
                    recompensa.disponible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  ]"
                >
                  {{ recompensa.disponible ? 'Disponible' : 'No disponible' }}
                </span>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center justify-between pt-4 border-t border-gray-200">
              <button
                @click="abrirModalEditar(recompensa)"
                class="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
              >
                <Edit3 class="h-4 w-4 mr-1" />
                <span class="text-sm font-medium">Editar</span>
              </button>
              
              <button
                @click="handleEliminar(recompensa)"
                class="flex items-center text-red-600 hover:text-red-800 transition-colors duration-200"
              >
                <Trash2 class="h-4 w-4 mr-1" />
                <span class="text-sm font-medium">Eliminar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Historial de Canjes -->
    <div v-else-if="vistaActual === 'historial'">
      <!-- Empty State -->
      <div v-if="historialCanjes.length === 0" class="bg-white rounded-lg shadow-sm p-12 text-center">
        <History class="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">No hay canjes registrados</h3>
        <p class="text-gray-500">Los canjes de recompensas aparecerán aquí cuando los empleados empiecen a canjear</p>
      </div>

      <!-- Historial Table -->
      <div v-else class="bg-white rounded-lg shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Empleado
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recompensa
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Coste
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="canje in historialCanjes" :key="canje.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ formatearFecha(canje.fechaCanje) }}</div>
                  <div class="text-sm text-gray-500">{{ formatearFechaCompleta(canje.fechaCanje) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-3">
                      <span class="text-white font-medium text-sm">
                        {{ canje.nombreEmpleado?.charAt(0) || 'E' }}
                      </span>
                    </div>
                    <div>
                      <div class="text-sm font-medium text-gray-900">{{ canje.nombreEmpleado || 'Empleado' }}</div>
                      <div class="text-sm text-gray-500">{{ canje.emailEmpleado || 'empleado@empresa.com' }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <span class="text-2xl mr-3">{{ canje.recompensaIcono || '🎁' }}</span>
                    <div>
                      <div class="text-sm font-medium text-gray-900">{{ canje.recompensaTitulo }}</div>
                      <div class="text-sm text-gray-500 capitalize">{{ canje.categoria || 'general' }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <svg class="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    <span class="text-sm font-bold text-gray-900">{{ canje.coste }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    Completado
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal para Crear/Editar Recompensa -->
    <RecompensaFormModal
      v-model:visible="mostrarModal"
      :recompensa="recompensaSeleccionada"
      :loading="guardando"
      @save="handleGuardarRecompensa"
    </div>
  </div>
</template>