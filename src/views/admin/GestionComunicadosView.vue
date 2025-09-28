<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Gestión de Comunicados</h1>
        <p class="mt-2 text-lg text-gray-600">Administra los comunicados para tus empleados</p>
      </div>
      <Button @click="crearNuevoComunicado">
        <Plus class="h-5 w-5 mr-2" />
        Nuevo Comunicado
      </Button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card class="text-center">
        <template #header>
          <h3 class="text-lg font-semibold text-gray-900">Total Comunicados</h3>
        </template>
        <p class="text-3xl font-bold text-primary">{{ comunicados.length }}</p>
        <p class="text-sm text-gray-500">Comunicados publicados</p>
      </Card>

      <Card class="text-center">
        <template #header>
          <h3 class="text-lg font-semibold text-gray-900">Esta Semana</h3>
        </template>
        <p class="text-3xl font-bold text-green-600">{{ comunicadosEstaSemana }}</p>
        <p class="text-sm text-gray-500">Nuevos comunicados</p>
      </Card>

      <Card class="text-center">
        <template #header>
          <h3 class="text-lg font-semibold text-gray-900">Último Comunicado</h3>
        </template>
        <p class="text-lg font-bold text-blue-600">{{ ultimoComunicado }}</p>
        <p class="text-sm text-gray-500">Días desde publicación</p>
      </Card>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="bg-white rounded-lg shadow-sm p-8 text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent mx-auto mb-4"></div>
      <p class="text-gray-600">Cargando comunicados...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <AlertCircle class="h-12 w-12 text-red-500 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-red-800 mb-2">Error al cargar los comunicados</h3>
      <p class="text-red-600 mb-4">{{ error }}</p>
      <Button @click="cargarComunicados" variant="outline">
        <RefreshCw class="h-4 w-4 mr-2" />
        Reintentar
      </Button>
    </div>

    <!-- Empty State -->
    <div v-else-if="comunicados.length === 0" class="bg-white rounded-lg shadow-sm p-12 text-center">
      <Megaphone class="h-16 w-16 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">No hay comunicados</h3>
      <p class="text-gray-500 mb-6">Comienza creando tu primer comunicado para los empleados</p>
      <Button @click="crearNuevoComunicado">
        <Plus class="h-4 w-4 mr-2" />
        Crear Primer Comunicado
      </Button>
    </div>

    <!-- Comunicados List -->
    <div v-else class="space-y-6">
      <div 
        v-for="comunicado in comunicados" 
        :key="comunicado.id"
        class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
      >
        <!-- Header del Comunicado -->
        <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">
                {{ comunicado.titulo }}
              </h3>
              <div class="flex items-center space-x-4 text-sm text-gray-500">
                <div class="flex items-center">
                  <Calendar class="h-4 w-4 mr-1" />
                  <span>{{ formatearFecha(comunicado.fechaCreacion) }}</span>
                </div>
                <div class="flex items-center">
                  <Clock class="h-4 w-4 mr-1" />
                  <span>{{ tiempoTranscurrido(comunicado.fechaCreacion) }}</span>
                </div>
              </div>
            </div>
            <div class="flex space-x-2">
              <Button 
                @click="editarComunicado(comunicado.id)"
                variant="outline"
                class="text-blue-600 hover:text-blue-700"
              >
                <Edit class="h-4 w-4" />
              </Button>
              <Button 
                @click="eliminarComunicado(comunicado.id, comunicado.titulo)"
                variant="outline"
                class="text-red-600 hover:text-red-700"
              >
                <Trash2 class="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <!-- Contenido del Comunicado -->
        <div class="p-6">
          <p class="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {{ comunicado.contenido }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { storeToRefs } from 'pinia';
import { useComunicadosStore } from '@/stores/comunicados.store';
import Card from '@/components/ui/Card.vue';
import Button from '@/components/ui/Button.vue';
import { Plus, AlertCircle, RefreshCw, Megaphone, Calendar, Clock, CreditCard as Edit, Trash2 } from 'lucide-vue-next';

const router = useRouter();
const toast = useToast();
const comunicadosStore = useComunicadosStore();

// Store state
const { comunicados, loading, error } = storeToRefs(comunicadosStore);
const { cargarComunicados } = comunicadosStore;

// Computed properties
const comunicadosEstaSemana = computed(() => {
  const unaSemanaAtras = new Date();
  unaSemanaAtras.setDate(unaSemanaAtras.getDate() - 7);
  
  return comunicados.value.filter(c => 
    new Date(c.fechaCreacion) >= unaSemanaAtras
  ).length;
});

const ultimoComunicado = computed(() => {
  if (comunicados.value.length === 0) return '-';
  
  const ultimaFecha = new Date(comunicados.value[0].fechaCreacion);
  const ahora = new Date();
  const diferencia = Math.floor((ahora - ultimaFecha) / (1000 * 60 * 60 * 24));
  
  return diferencia === 0 ? 'Hoy' : diferencia;
});

// Methods
const formatearFecha = (fecha) => {
  return new Date(fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const tiempoTranscurrido = (fecha) => {
  const ahora = new Date();
  const fechaComunicado = new Date(fecha);
  const diferencia = ahora - fechaComunicado;
  
  const minutos = Math.floor(diferencia / (1000 * 60));
  const horas = Math.floor(diferencia / (1000 * 60 * 60));
  const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
  
  if (minutos < 60) {
    return minutos <= 1 ? 'Hace un momento' : `Hace ${minutos}m`;
  } else if (horas < 24) {
    return `Hace ${horas}h`;
  } else {
    return `Hace ${dias}d`;
  }
};

const crearNuevoComunicado = () => {
  router.push('/admin/comunicados/crear');
};

const editarComunicado = (comunicadoId) => {
  toast.add({
    severity: 'info',
    summary: 'Función en desarrollo',
    detail: 'La edición de comunicados estará disponible próximamente',
    life: 4000
  });
};

const eliminarComunicado = (comunicadoId, titulo) => {
  const confirmacion = confirm(
    `¿Estás seguro de que quieres eliminar el comunicado "${titulo}"?\n\nEsta acción no se puede deshacer.`
  );
  
  if (confirmacion) {
    toast.add({
      severity: 'info',
      summary: 'Función en desarrollo',
      detail: 'La eliminación de comunicados estará disponible próximamente',
      life: 4000
    });
  }
};

// Load data on mount
onMounted(() => {
  cargarComunicados();
});
</script>

<style scoped>
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>