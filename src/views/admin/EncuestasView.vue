<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { BarChart3, CreditCard as Edit3, Plus } from 'lucide-vue-next';
import Card from '@/components/ui/Card.vue';
import Button from '@/components/ui/Button.vue';
import { getEncuestas } from '@/services/mock/encuestas.service.js';

// --- Inicialización ---
const encuestas = ref([]);
const isLoading = ref(true);
const router = useRouter();

// --- Carga de Datos ---
onMounted(async () => {
  isLoading.value = true;
  try {
    encuestas.value = await getEncuestas();
  } catch (error) {
    console.error("Error al cargar las encuestas:", error);
  } finally {
    isLoading.value = false;
  }
});

const verResultados = (encuestaId) => {
  // Usamos el nombre de la ruta que definimos para una navegación más robusta
  router.push({ name: 'admin-encuesta-resultados', params: { encuestaId: encuestaId } });
};

const editarEncuesta = (encuestaId) => {
  // Navegar a la vista de edición de encuesta
  router.push({ name: 'admin-editar-encuesta', params: { encuestaId: encuestaId } });
};
</script>

<template>
  <div class="space-y-6">
    <header class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 class="text-3xl font-bold text-on-background">Gestión de Encuestas</h1>
        <p class="text-on-surface-variant">Crea, gestiona y analiza todas las encuestas de tu organización.</p>
      </div>
      <Button @click="router.push('/admin/encuestas/crear')" variant="primary" class="shadow-lg hover:shadow-xl transition-shadow duration-200">
        <Plus class="h-5 w-5 mr-2" />
        Crear Nueva Encuesta
      </Button>
    </header>

    <div v-if="isLoading" class="text-center py-10">
      <p>Cargando encuestas...</p>
    </div>

    <div v-else class="space-y-4">
      <div 
        v-for="encuesta in encuestas" 
        :key="encuesta.id"
        class="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 overflow-hidden"
      >
        <!-- Header with title and status -->
        <div class="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <h2 class="text-xl font-semibold text-gray-900 mb-2">{{ encuesta.titulo }}</h2>
              <div class="flex items-center">
                <span 
                  :class="[
                    'px-3 py-1 rounded-full text-xs font-medium',
                    encuesta.estado === 'Activa' ? 'bg-green-100 text-green-800' :
                    encuesta.estado === 'Finalizada' ? 'bg-blue-100 text-blue-800' :
                    encuesta.estado === 'Borrador' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  ]"
                >
                  {{ encuesta.estado }}
                </span>
              </div>
            </div>
            
            <!-- Action Links -->
            <div class="flex items-center space-x-4">
              <!-- Ver Resultados Link -->
              <button 
                @click="verResultados(encuesta.id)" 
                :disabled="encuesta.estado === 'Borrador'"
                :class="[
                  'flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  encuesta.estado === 'Borrador' 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-primary hover:bg-primary/10 hover:text-primary-dark'
                ]"
              >
                <BarChart3 class="h-4 w-4 mr-2" />
                Ver Resultados
              </button>
              
              <!-- Editar Link -->
              <button 
                @click="editarEncuesta(encuesta.id)"
                class="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200"
              >
                <Edit3 class="h-4 w-4 mr-2" />
                Editar
              </button>
            </div>
          </div>
        </div>

        <!-- Content with stats -->
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Participantes -->
            <div class="text-center">
              <div class="text-2xl font-bold text-gray-900">{{ encuesta.totalParticipantes }}</div>
              <div class="text-sm text-gray-500">Participantes</div>
            </div>
            
            <!-- Tasa de Participación -->
            <div class="text-center">
              <div class="text-2xl font-bold text-primary">{{ encuesta.tasaParticipacion }}</div>
              <div class="text-sm text-gray-500">Tasa de Participación</div>
            </div>
            
            <!-- Preguntas -->
            <div class="text-center">
              <div class="text-2xl font-bold text-gray-900">{{ encuesta.preguntas?.length || 0 }}</div>
              <div class="text-sm text-gray-500">Preguntas</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>