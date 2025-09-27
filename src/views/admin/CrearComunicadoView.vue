<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <Header subtitulo="Crear Comunicado" />
    
    <!-- Main Content -->
    <div class="py-8">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="mb-8">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">Crear Nuevo Comunicado</h1>
              <p class="mt-2 text-lg text-gray-600">Informa a tus empleados sobre las acciones tomadas</p>
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

        <!-- Formulario -->
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <form @submit.prevent="handlePublicar" class="space-y-8">
            <!-- Información del Comunicado -->
            <div class="p-6 border-b border-gray-200">
              <h2 class="text-xl font-semibold text-gray-900 mb-6">Información del Comunicado</h2>
              
              <div class="space-y-6">
                <!-- Título -->
                <div class="form-group">
                  <label for="titulo" class="form-label">
                    Título del Comunicado *
                  </label>
                  <input
                    id="titulo"
                    v-model="nuevoComunicado.titulo"
                    type="text"
                    class="input"
                    placeholder="Ej: Nuevas Medidas de Bienestar Implementadas"
                    required
                    :disabled="loading"
                  />
                  <p class="mt-1 text-sm text-gray-500">
                    Este será el título principal que verán los empleados
                  </p>
                </div>

                <!-- Contenido -->
                <div class="form-group">
                  <label for="contenido" class="form-label">
                    Contenido del Comunicado *
                  </label>
                  <textarea
                    id="contenido"
                    v-model="nuevoComunicado.contenido"
                    rows="8"
                    class="input resize-none"
                    placeholder="Escribe aquí el mensaje que quieres compartir con tus empleados. Puedes mencionar las acciones específicas que se han tomado basadas en su feedback..."
                    required
                    :disabled="loading"
                  ></textarea>
                  <p class="mt-1 text-sm text-gray-500">
                    Describe las acciones tomadas y cómo beneficiarán al equipo
                  </p>
                </div>
              </div>
            </div>

            <!-- Vista Previa -->
            <div v-if="nuevoComunicado.titulo || nuevoComunicado.contenido" class="p-6 border-b border-gray-200">
              <h2 class="text-xl font-semibold text-gray-900 mb-6">Vista Previa</h2>
              <div class="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div class="flex items-start">
                  <div class="flex-shrink-0 mr-4">
                    <div class="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <Megaphone class="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">
                      {{ nuevoComunicado.titulo || 'Título del comunicado...' }}
                    </h3>
                    <div class="flex items-center text-sm text-gray-500 mb-3">
                      <Calendar class="h-4 w-4 mr-1" />
                      <span>{{ fechaActual }}</span>
                    </div>
                    <p class="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {{ nuevoComunicado.contenido || 'Contenido del comunicado...' }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Botones de Acción -->
            <div class="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div class="flex justify-between items-center">
                <div class="text-sm text-gray-500">
                  <span v-if="!nuevoComunicado.titulo.trim() || !nuevoComunicado.contenido.trim()">
                    Completa el título y contenido para publicar
                  </span>
                  <span v-else>
                    El comunicado estará visible inmediatamente para todos los empleados
                  </span>
                </div>
                
                <div class="flex space-x-4">
                  <Button 
                    type="button"
                    @click="limpiarFormulario"
                    variant="outline"
                    :disabled="loading"
                  >
                    <RotateCcw class="h-4 w-4 mr-2" />
                    Limpiar
                  </Button>
                  
                  <Button 
                    type="submit"
                    :loading="loading"
                    :disabled="!puedePublicar"
                  >
                    <Send class="h-4 w-4 mr-2" />
                    Publicar Comunicado
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useComunicadosStore } from '@/stores/comunicados.store';
import Button from '@/components/ui/Button.vue';
import Header from '@/components/common/Header.vue';
import { 
  ArrowLeft, 
  Megaphone,
  Calendar,
  RotateCcw,
  Send
} from 'lucide-vue-next';

const router = useRouter();
const toast = useToast();
const comunicadosStore = useComunicadosStore();

// Estados reactivos
const loading = ref(false);
const nuevoComunicado = ref({
  titulo: '',
  contenido: ''
});

// Computed properties
const puedePublicar = computed(() => {
  return nuevoComunicado.value.titulo.trim() && 
         nuevoComunicado.value.contenido.trim();
});

const fechaActual = computed(() => {
  return new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
});

// Métodos
const volverAlDashboard = () => {
  router.push('/admin/dashboard');
};

const limpiarFormulario = () => {
  nuevoComunicado.value = {
    titulo: '',
    contenido: ''
  };
  toast.add({
    severity: 'info',
    summary: 'Formulario limpiado',
    detail: 'Puedes empezar a escribir un nuevo comunicado',
    life: 3000
  });
};

const handlePublicar = async () => {
  if (!puedePublicar.value) {
    toast.add({
      severity: 'warn',
      summary: 'Campos requeridos',
      detail: 'Debes completar el título y contenido del comunicado',
      life: 4000
    });
    return;
  }

  loading.value = true;
  
  try {
    await comunicadosStore.crearComunicado({
      titulo: nuevoComunicado.value.titulo.trim(),
      contenido: nuevoComunicado.value.contenido.trim()
    });
    
    toast.add({
      severity: 'success',
      summary: '¡Comunicado publicado!',
      detail: 'El comunicado está ahora visible para todos los empleados',
      life: 5000
    });
    
    // Limpiar formulario
    limpiarFormulario();
    
    // Redirigir al dashboard después de un momento
    setTimeout(() => {
      router.push('/admin/dashboard');
    }, 2000);
    
  } catch (error) {
    console.error('Error al publicar comunicado:', error);
    toast.add({
      severity: 'error',
      summary: 'Error al publicar',
      detail: error.message || 'No se pudo publicar el comunicado',
      life: 5000
    });
  } finally {
    loading.value = false;
  }
};
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