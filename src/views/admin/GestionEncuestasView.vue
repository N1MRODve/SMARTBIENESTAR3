<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Gestión de Encuestas</h1>
        <p class="mt-2 text-lg text-gray-600">Administra las encuestas de bienestar de tu empresa</p>
      </div>
      <Button @click="crearNuevaEncuesta">
        <Plus class="h-5 w-5 mr-2" />
        Nueva Encuesta
      </Button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card class="text-center">
        <template #header>
          <h3 class="text-lg font-semibold text-gray-900">Total Encuestas</h3>
        </template>
        <p class="text-3xl font-bold text-primary">{{ stats.totalEncuestas }}</p>
        <p class="text-sm text-gray-500">Encuestas creadas</p>
      </Card>

      <Card class="text-center">
        <template #header>
          <h3 class="text-lg font-semibold text-gray-900">Encuestas Activas</h3>
        </template>
        <p class="text-3xl font-bold text-green-600">{{ stats.encuestasActivas }}</p>
        <p class="text-sm text-gray-500">En curso</p>
      </Card>

      <Card class="text-center">
        <template #header>
          <h3 class="text-lg font-semibold text-gray-900">Total Respuestas</h3>
        </template>
        <p class="text-3xl font-bold text-blue-600">{{ stats.totalRespuestas }}</p>
        <p class="text-sm text-gray-500">Respuestas recibidas</p>
      </Card>

      <Card class="text-center">
        <template #header>
          <h3 class="text-lg font-semibold text-gray-900">Tasa de Respuesta</h3>
        </template>
        <p class="text-3xl font-bold text-purple-600">{{ stats.tasaRespuesta }}%</p>
        <p class="text-sm text-gray-500">Participación promedio</p>
      </Card>
    </div>

    <!-- Encuestas Table -->
    <Card>
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold text-gray-900">Lista de Encuestas</h2>
          <div class="flex items-center space-x-4">
            <!-- Filtro por Estado -->
            <select
              v-model="filtroEstado"
              class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            >
              <option value="">Todos los estados</option>
              <option value="activa">Activas</option>
              <option value="finalizada">Finalizadas</option>
              <option value="borrador">Borradores</option>
            </select>
          </div>
        </div>
      </template>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent mx-auto mb-4"></div>
        <p class="text-gray-600">Cargando encuestas...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="encuestasFiltradas.length === 0" class="text-center py-12">
        <FileText class="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">No hay encuestas</h3>
        <p class="text-gray-500 mb-6">Comienza creando tu primera encuesta de bienestar</p>
        <Button @click="crearNuevaEncuesta">
          <Plus class="h-4 w-4 mr-2" />
          Crear Primera Encuesta
        </Button>
      </div>

      <!-- Encuestas Table -->
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Encuesta
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Respuestas
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha Creación
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr 
              v-for="encuesta in encuestasFiltradas" 
              :key="encuesta.id"
              class="hover:bg-gray-50 transition-colors duration-150"
            >
              <!-- Información de la Encuesta -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ encuesta.titulo }}</div>
                  <div v-if="encuesta.descripcion" class="text-sm text-gray-500 max-w-xs truncate">
                    {{ encuesta.descripcion }}
                  </div>
                  <div class="text-xs text-gray-400 mt-1">
                    {{ encuesta.preguntas || 0 }} preguntas
                  </div>
                </div>
              </td>

              <!-- Estado -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    encuesta.estado === 'activa' ? 'bg-green-100 text-green-800' :
                    encuesta.estado === 'finalizada' ? 'bg-blue-100 text-blue-800' :
                    encuesta.estado === 'borrador' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  ]"
                >
                  <span 
                    :class="[
                      'w-1.5 h-1.5 rounded-full mr-1.5',
                      encuesta.estado === 'activa' ? 'bg-green-400' :
                      encuesta.estado === 'finalizada' ? 'bg-blue-400' :
                      encuesta.estado === 'borrador' ? 'bg-yellow-400' :
                      'bg-gray-400'
                    ]"
                  ></span>
                  {{ encuesta.estado.charAt(0).toUpperCase() + encuesta.estado.slice(1) }}
                </span>
              </td>

              <!-- Respuestas -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ encuesta.totalRespuestas || 0 }}
                  <span v-if="encuesta.totalEmpleados" class="text-gray-500">
                    / {{ encuesta.totalEmpleados }}
                  </span>
                </div>
                <div v-if="encuesta.totalEmpleados" class="text-xs text-gray-500">
                  {{ Math.round(((encuesta.totalRespuestas || 0) / encuesta.totalEmpleados) * 100) }}% participación
                </div>
              </td>

              <!-- Fecha Creación -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatearFecha(encuesta.fechaCreacion) }}
              </td>

              <!-- Acciones -->
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex space-x-2">
                  <Button 
                    v-if="encuesta.estado === 'activa' && (encuesta.totalRespuestas || 0) > 0"
                    @click="verResultados(encuesta.id)"
                    variant="outline"
                    class="text-blue-600 hover:text-blue-700"
                  >
                    <BarChart class="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    v-if="encuesta.estado === 'borrador'"
                    @click="editarEncuesta(encuesta.id)"
                    variant="outline"
                    class="text-green-600 hover:text-green-700"
                  >
                    <Edit class="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    @click="eliminarEncuesta(encuesta.id, encuesta.titulo)"
                    variant="outline"
                    class="text-red-600 hover:text-red-700"
                  >
                    <Trash2 class="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { storeToRefs } from 'pinia';
import { useEncuestasStore } from '@/stores/encuestas.store';
import Card from '@/components/ui/Card.vue';
import Button from '@/components/ui/Button.vue';
import { Plus, FileText, BarChart, CreditCard as Edit, Trash2 } from 'lucide-vue-next';

const router = useRouter();
const toast = useToast();
const encuestasStore = useEncuestasStore();

// Store state
const { encuestas, loading, error } = storeToRefs(encuestasStore);
const { cargarEncuestas } = encuestasStore;

// Local state
const filtroEstado = ref('');

// Computed properties
const encuestasFiltradas = computed(() => {
  if (!filtroEstado.value) return encuestas.value;
  return encuestas.value.filter(e => e.estado === filtroEstado.value);
});

const stats = computed(() => {
  const total = encuestas.value.length;
  const activas = encuestas.value.filter(e => e.estado === 'activa').length;
  const totalRespuestas = encuestas.value.reduce((sum, e) => sum + (e.totalRespuestas || 0), 0);
  const totalEmpleados = encuestas.value.reduce((sum, e) => sum + (e.totalEmpleados || 0), 0);
  const tasaRespuesta = totalEmpleados > 0 ? Math.round((totalRespuestas / totalEmpleados) * 100) : 0;

  return {
    totalEncuestas: total,
    encuestasActivas: activas,
    totalRespuestas,
    tasaRespuesta
  };
});

// Methods
const formatearFecha = (fecha) => {
  return new Date(fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const crearNuevaEncuesta = () => {
  router.push('/admin/crear-encuesta');
};

const verResultados = (encuestaId) => {
  router.push(`/admin/encuesta/${encuestaId}/resultados`);
};

const editarEncuesta = (encuestaId) => {
  toast.add({
    severity: 'info',
    summary: 'Función en desarrollo',
    detail: 'La edición de encuestas estará disponible próximamente',
    life: 4000
  });
};

const eliminarEncuesta = (encuestaId, titulo) => {
  const confirmacion = confirm(
    `¿Estás seguro de que quieres eliminar la encuesta "${titulo}"?\n\nEsta acción no se puede deshacer.`
  );
  
  if (confirmacion) {
    toast.add({
      severity: 'info',
      summary: 'Función en desarrollo',
      detail: 'La eliminación de encuestas estará disponible próximamente',
      life: 4000
    });
  }
};

// Load data on mount
onMounted(() => {
  cargarEncuestas();
});
</script>

<style scoped>
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>