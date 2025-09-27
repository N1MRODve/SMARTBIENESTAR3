<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <Header subtitulo="Gestión de Recompensas" />
    
    <!-- Main Content -->
    <div class="py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="mb-8">
          <div class="flex justify-between items-center">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">Gestión de Catálogo de Recompensas</h1>
              <p class="mt-2 text-lg text-gray-600">Administra las recompensas disponibles para los empleados</p>
            </div>
            <div class="flex space-x-4">
              <Button 
                @click="volverAlDashboard"
                variant="outline"
              >
                <ArrowLeft class="h-5 w-5 mr-2" />
                Volver al Dashboard
              </Button>
              <Button 
                @click="abrirModalCrear"
              >
                <Plus class="h-5 w-5 mr-2" />
                Añadir Nueva Recompensa
              </Button>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="bg-white rounded-lg shadow-sm p-8 text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent mx-auto mb-4"></div>
          <p class="text-gray-600">Cargando catálogo de recompensas...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle class="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-red-800 mb-2">Error al cargar las recompensas</h3>
          <p class="text-red-600 mb-4">{{ error }}</p>
          <Button @click="cargarRecompensas" variant="outline">
            <RefreshCw class="h-4 w-4 mr-2" />
            Reintentar
          </Button>
        </div>

        <!-- Empty State -->
        <div v-else-if="recompensas.length === 0" class="bg-white rounded-lg shadow-sm p-12 text-center">
          <Gift class="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">No hay recompensas en el catálogo</h3>
          <p class="text-gray-500 mb-6">Comienza añadiendo la primera recompensa para tus empleados</p>
          <Button @click="abrirModalCrear">
            <Plus class="h-4 w-4 mr-2" />
            Añadir Primera Recompensa
          </Button>
        </div>

        <!-- Recompensas Table -->
        <div v-else class="bg-white rounded-lg shadow-sm overflow-hidden">
          <!-- Table Header -->
          <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div class="flex justify-between items-center">
              <h2 class="text-lg font-semibold text-gray-900">
                Catálogo de Recompensas ({{ recompensas.length }})
              </h2>
              <div class="flex items-center space-x-4">
                <!-- Filtro por Categoría -->
                <select
                  v-model="filtroCategoria"
                  class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                >
                  <option value="">Todas las categorías</option>
                  <option value="tiempo">Tiempo Libre</option>
                  <option value="bienestar">Bienestar</option>
                  <option value="gastronomia">Gastronomía</option>
                  <option value="compras">Compras</option>
                  <option value="entretenimiento">Entretenimiento</option>
                  <option value="comodidad">Comodidad</option>
                  <option value="salud">Salud</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Table Content -->
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Recompensa
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Coste
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Popularidad
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr 
                  v-for="recompensa in recompensasFiltradas" 
                  :key="recompensa.id"
                  class="hover:bg-gray-50 transition-colors duration-150"
                >
                  <!-- Recompensa Info -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                        <span class="text-lg">{{ recompensa.icono }}</span>
                      </div>
                      <div>
                        <div class="text-sm font-medium text-gray-900">{{ recompensa.titulo }}</div>
                        <div class="text-sm text-gray-500 max-w-xs truncate">{{ recompensa.descripcion }}</div>
                      </div>
                    </div>
                  </td>

                  <!-- Categoría -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                      {{ recompensa.categoria }}
                    </span>
                  </td>

                  <!-- Coste -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <svg class="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                      <span class="text-sm font-medium text-gray-900">{{ recompensa.coste }}</span>
                    </div>
                  </td>

                  <!-- Popularidad -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex">
                      <Star 
                        v-for="i in 5" 
                        :key="i"
                        :class="[
                          'h-4 w-4',
                          i <= recompensa.popularidad ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        ]"
                      />
                    </div>
                  </td>

                  <!-- Estado -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span 
                      :class="[
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                        recompensa.disponible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      ]"
                    >
                      <span 
                        :class="[
                          'w-1.5 h-1.5 rounded-full mr-1.5',
                          recompensa.disponible ? 'bg-green-400' : 'bg-red-400'
                        ]"
                      ></span>
                      {{ recompensa.disponible ? 'Disponible' : 'No Disponible' }}
                    </span>
                  </td>

                  <!-- Acciones -->
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div class="flex space-x-2">
                      <Button 
                        @click="abrirModalEditar(recompensa)"
                        variant="outline"
                        class="text-blue-600 hover:text-blue-700"
                      >
                        <Edit class="h-4 w-4" />
                      </Button>
                      <Button 
                        @click="handleEliminarRecompensa(recompensa.id, recompensa.titulo)"
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
        </div>
      </div>
    </div>

    <!-- Modal de Formulario -->
    <RecompensaFormModal
      v-model:visible="mostrarModal"
      :recompensa="recompensaEditando"
      :loading="procesandoFormulario"
      @save="handleGuardarRecompensa"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { storeToRefs } from 'pinia';
import { useRecompensasStore } from '@/stores/recompensas.store';
import Header from '@/components/common/Header.vue';
import Button from '@/components/common/Button.vue';
import RecompensaFormModal from '@/components/admin/RecompensaFormModal.vue';
import { ArrowLeft, Plus, AlertCircle, RefreshCw, Gift, Edit, Trash2, Star } from 'lucide-vue-next';

const router = useRouter();
const toast = useToast();
const recompensasStore = useRecompensasStore();

// Store state
const { recompensas, loading, error } = storeToRefs(recompensasStore);
const { cargarRecompensas, crearRecompensa, actualizarRecompensa, eliminarRecompensa: eliminarRecompensaStore } = recompensasStore;

// Local state
const mostrarModal = ref(false);
const recompensaEditando = ref(null);
const procesandoFormulario = ref(false);
const filtroCategoria = ref('');

// Computed properties
const recompensasFiltradas = computed(() => {
  if (!filtroCategoria.value) return recompensas.value;
  return recompensas.value.filter(r => r.categoria === filtroCategoria.value);
});

// Methods
const volverAlDashboard = () => {
  router.push('/admin/dashboard');
};

const abrirModalCrear = () => {
  recompensaEditando.value = null;
  mostrarModal.value = true;
};

const abrirModalEditar = (recompensa) => {
  recompensaEditando.value = { ...recompensa };
  mostrarModal.value = true;
};

const handleGuardarRecompensa = async (datosRecompensa) => {
  procesandoFormulario.value = true;
  
  try {
    if (recompensaEditando.value) {
      // Modo edición
      await actualizarRecompensa({
        ...datosRecompensa,
        id: recompensaEditando.value.id
      });
      
      toast.add({
        severity: 'success',
        summary: '¡Recompensa actualizada!',
        detail: `"${datosRecompensa.titulo}" ha sido actualizada correctamente`,
        life: 4000
      });
    } else {
      // Modo creación
      await crearRecompensa(datosRecompensa);
      
      toast.add({
        severity: 'success',
        summary: '¡Recompensa creada!',
        detail: `"${datosRecompensa.titulo}" ha sido añadida al catálogo`,
        life: 4000
      });
    }
    
    mostrarModal.value = false;
    recompensaEditando.value = null;
    
  } catch (error) {
    console.error('Error al guardar recompensa:', error);
    toast.add({
      severity: 'error',
      summary: 'Error al guardar',
      detail: error.message || 'No se pudo guardar la recompensa',
      life: 5000
    });
  } finally {
    procesandoFormulario.value = false;
  }
};

const handleEliminarRecompensa = async (recompensaId, titulo) => {
  const confirmacion = confirm(
    `¿Estás seguro de que quieres eliminar "${titulo}" del catálogo?\n\nEsta acción no se puede deshacer.`
  );
  
  if (!confirmacion) return;
  
  try {
    await eliminarRecompensaStore(recompensaId);
    
    toast.add({
      severity: 'info',
      summary: 'Recompensa eliminada',
      detail: `"${titulo}" ha sido eliminada del catálogo`,
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
};

// Load data on mount
onMounted(() => {
  cargarRecompensas();
});
</script>

<style scoped>
.fill-current {
  fill: currentColor;
}

.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>