<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    
    <!-- Main Content -->
    <div class="py-8">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="mb-8">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">Editar Encuesta</h1>
              <p class="mt-2 text-lg text-gray-600">Modifica los detalles de la encuesta existente</p>
            </div>
            <Button 
              @click="volverAtras"
              variant="outline"
            >
              <ArrowLeft class="h-5 w-5 mr-2" />
              Volver a Encuestas
            </Button>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="bg-white rounded-lg shadow-sm p-8 text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent mx-auto mb-4"></div>
          <p class="text-gray-600">Cargando encuesta...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle class="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-red-800 mb-2">Error al cargar la encuesta</h3>
          <p class="text-red-600 mb-4">{{ error }}</p>
          <Button @click="cargarEncuesta" variant="outline">
            <RefreshCw class="h-4 w-4 mr-2" />
            Reintentar
          </Button>
        </div>

        <!-- Edit Form -->
        <div v-else-if="encuesta" class="bg-white rounded-lg shadow-sm overflow-hidden">
          <form @submit.prevent="handleGuardarCambios" class="space-y-8">
            <!-- Información Básica -->
            <div class="p-6 border-b border-gray-200">
              <h2 class="text-xl font-semibold text-gray-900 mb-6">Información Básica</h2>
              
              <div class="space-y-6">
                <!-- Título de la Encuesta -->
                <div class="form-group">
                  <label for="titulo" class="form-label">
                    Título de la Encuesta *
                  </label>
                  <input
                    id="titulo"
                    v-model="encuesta.titulo"
                    type="text"
                    class="input"
                    placeholder="Ej: Encuesta de Satisfacción Laboral"
                    required
                    :disabled="guardando"
                  />
                </div>

                <!-- Descripción -->
                <div class="form-group">
                  <label for="descripcion" class="form-label">
                    Descripción (Opcional)
                  </label>
                  <textarea
                    id="descripcion"
                    v-model="encuesta.descripcion"
                    rows="3"
                    class="input"
                    placeholder="Describe brevemente el propósito de esta encuesta..."
                    :disabled="guardando"
                  ></textarea>
                </div>

                <!-- Categoría de la Encuesta -->
                <div class="form-group">
                  <label for="categoria" class="form-label">
                    Categoría de la Encuesta *
                  </label>
                  <select
                    id="categoria"
                    v-model="encuesta.categoria"
                    class="input"
                    required
                    :disabled="guardando"
                  >
                    <option value="">Selecciona una categoría</option>
                    <option value="salud-mental">🧠 Salud Mental</option>
                    <option value="carga-laboral">⚖️ Carga Laboral</option>
                    <option value="comunicacion">💬 Comunicación</option>
                    <option value="ergonomia">🪑 Ergonomía</option>
                    <option value="desarrollo">📈 Desarrollo Profesional</option>
                    <option value="general">📊 Bienestar General</option>
                  </select>
                  <p class="mt-1 text-sm text-gray-500">
                    Esta categoría ayuda a clasificar y analizar los resultados
                  </p>
                </div>

                <!-- Estado -->
                <div class="form-group">
                  <label for="estado" class="form-label">
                    Estado de la Encuesta *
                  </label>
                  <select
                    id="estado"
                    v-model="encuesta.estado"
                    class="input"
                    required
                    :disabled="guardando"
                  >
                    <option value="borrador">Borrador</option>
                    <option value="activa">Activa</option>
                    <option value="finalizada">Finalizada</option>
                    <option value="pausada">Pausada</option>
                  </select>
                  <p class="mt-1 text-sm text-gray-500">
                    Solo las encuestas activas son visibles para los empleados
                  </p>
                </div>
              </div>
            </div>

            <!-- Preguntas -->
            <div class="p-6">
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-xl font-semibold text-gray-900">
                  Preguntas ({{ encuesta.preguntas?.length || 0 }})
                </h2>
                <Button 
                  type="button"
                  @click="añadirPregunta"
                  variant="outline"
                  :disabled="guardando"
                >
                  <Plus class="h-5 w-5 mr-2" />
                  Añadir Pregunta
                </Button>
              </div>

              <!-- Lista de Preguntas -->
              <div v-if="!encuesta.preguntas || encuesta.preguntas.length === 0" class="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                <HelpCircle class="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 class="text-lg font-medium text-gray-900 mb-2">No hay preguntas</h3>
                <p class="text-gray-500 mb-4">Esta encuesta no tiene preguntas configuradas</p>
                <Button 
                  type="button"
                  @click="añadirPregunta"
                  :disabled="guardando"
                >
                  <Plus class="h-5 w-5 mr-2" />
                  Añadir Primera Pregunta
                </Button>
              </div>

              <div v-else class="space-y-6">
                <div 
                  v-for="(pregunta, index) in encuesta.preguntas" 
                  :key="pregunta.id || index"
                  class="border border-gray-200 rounded-lg p-6 bg-gray-50"
                >
                  <!-- Header de la Pregunta -->
                  <div class="flex items-start justify-between mb-4">
                    <h3 class="text-lg font-medium text-gray-900">
                      Pregunta {{ index + 1 }}
                    </h3>
                    <Button 
                      type="button"
                      @click="eliminarPregunta(index)"
                      variant="outline"
                      class="text-red-600 hover:text-red-700 hover:bg-red-50"
                      :disabled="guardando"
                    >
                      <Trash2 class="h-4 w-4" />
                    </Button>
                  </div>

                  <!-- Texto de la Pregunta -->
                  <div class="form-group mb-4">
                    <label :for="`pregunta-texto-${index}`" class="form-label">
                      Texto de la Pregunta *
                    </label>
                    <textarea
                      :id="`pregunta-texto-${index}`"
                      v-model="pregunta.texto"
                      rows="2"
                      class="input"
                      placeholder="Escribe tu pregunta aquí..."
                      required
                      :disabled="guardando"
                    ></textarea>
                  </div>

                  <!-- Tipo de Pregunta -->
                  <div class="form-group mb-4">
                    <label :for="`pregunta-tipo-${index}`" class="form-label">
                      Tipo de Pregunta *
                    </label>
                    <select
                      :id="`pregunta-tipo-${index}`"
                      v-model="pregunta.tipo"
                      class="input"
                      required
                      :disabled="guardando"
                      @change="actualizarOpcionesPregunta(index)"
                    >
                      <option value="">Selecciona un tipo</option>
                      <option value="opcion_multiple">Opción Múltiple</option>
                      <option value="si_no">Sí / No</option>
                      <option value="escala_1_5">Escala 1-5</option>
                      <option value="texto_abierto">Texto Abierto (Anónimo)</option>
                    </select>
                  </div>

                  <!-- Opciones para Opción Múltiple -->
                  <div v-if="pregunta.tipo === 'opcion_multiple'" class="form-group">
                    <label class="form-label">Opciones de Respuesta *</label>
                    <div class="space-y-3">
                      <div 
                        v-for="(opcion, opcionIndex) in pregunta.opciones" 
                        :key="opcionIndex"
                        class="flex items-center space-x-3"
                      >
                        <input
                          v-model="pregunta.opciones[opcionIndex]"
                          type="text"
                          class="input flex-1"
                          :placeholder="`Opción ${opcionIndex + 1}`"
                          required
                          :disabled="guardando"
                        />
                        <Button 
                          v-if="pregunta.opciones.length > 2"
                          type="button"
                          @click="eliminarOpcion(index, opcionIndex)"
                          variant="outline"
                          class="text-red-600 hover:text-red-700"
                          :disabled="guardando"
                        >
                          <X class="h-4 w-4" />
                        </Button>
                      </div>
                      <Button 
                        type="button"
                        @click="agregarOpcion(index)"
                        variant="outline"
                        class="w-full"
                        :disabled="guardando"
                      >
                        <Plus class="h-4 w-4 mr-2" />
                        Agregar Opción
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Botones de Acción -->
            <div class="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div class="flex justify-between items-center">
                <div class="text-sm text-gray-500">
                  <span v-if="!encuesta.preguntas || encuesta.preguntas.length === 0">
                    Agrega al menos una pregunta para activar la encuesta
                  </span>
                  <span v-else>
                    {{ encuesta.preguntas.length }} pregunta{{ encuesta.preguntas.length !== 1 ? 's' : '' }} configurada{{ encuesta.preguntas.length !== 1 ? 's' : '' }}
                  </span>
                </div>
                
                <div class="flex space-x-4">
                  <Button 
                    type="button"
                    @click="volverAtras"
                    variant="outline"
                    :disabled="guardando"
                  >
                    <X class="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                  
                  <Button 
                    type="submit"
                    :loading="guardando"
                    :disabled="!puedeGuardar"
                  >
                    <Save class="h-4 w-4 mr-2" />
                    Guardar Cambios
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
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { storeToRefs } from 'pinia';
import { useEncuestasStore } from '@/stores/encuestas.store';
import { encuestasService } from '@/services/encuestas.service';
import Button from '@/components/common/Button.vue';
import {
  ArrowLeft,
  AlertCircle,
  RefreshCw,
  Plus,
  HelpCircle,
  Trash2,
  X,
  Save
} from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const encuestasStore = useEncuestasStore();

// Estado reactivo
const encuesta = ref(null);
const loading = ref(true);
const error = ref(null);
const guardando = ref(false);

// Computed properties
const puedeGuardar = computed(() => {
  return encuesta.value && 
         encuesta.value.titulo?.trim() && 
         encuesta.value.preguntas && 
         encuesta.value.preguntas.length > 0 &&
         encuesta.value.preguntas.every(p => 
           p.texto?.trim() && 
           p.tipo && 
           (p.tipo !== 'opcion_multiple' || (p.opciones && p.opciones.every(o => o?.trim())))
         );
});

// Métodos
const cargarEncuesta = async () => {
  loading.value = true;
  error.value = null;

  try {
    const encuestaId = route.params.encuestaId;
    const encuestaData = await encuestasService.getById(encuestaId);

    // Asegurar que la encuesta tenga la estructura correcta
    encuesta.value = {
      id: encuestaData.id,
      titulo: encuestaData.titulo || '',
      descripcion: encuestaData.descripcion || '',
      categoria: encuestaData.categoria || 'general',
      estado: encuestaData.estado || 'borrador',
      preguntas: encuestaData.preguntas_encuesta || []
    };

    // Asegurar que cada pregunta tenga la estructura correcta
    encuesta.value.preguntas = encuesta.value.preguntas.map(p => ({
      id: p.id || Date.now() + Math.random(),
      texto: p.texto || '',
      tipo: p.tipo || '',
      opciones: p.opciones || (p.tipo === 'opcion_multiple' ? ['', ''] : [])
    }));

  } catch (err) {
    error.value = err.message || 'Error al cargar la encuesta';
    console.error('Error cargando encuesta:', err);
  } finally {
    loading.value = false;
  }
};

const volverAtras = () => {
  router.push('/admin/encuestas');
};

const handleGuardarCambios = async () => {
  if (!puedeGuardar.value) {
    toast.add({
      severity: 'warn',
      summary: 'Formulario incompleto',
      detail: 'Por favor completa todos los campos requeridos',
      life: 4000
    });
    return;
  }

  guardando.value = true;
  
  try {
    // Simular guardado de cambios
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.add({
      severity: 'success',
      summary: '¡Cambios guardados!',
      detail: 'La encuesta ha sido actualizada correctamente',
      life: 4000
    });
    
    // Volver a la lista de encuestas
    router.push('/admin/encuestas');
    
  } catch (error) {
    console.error('Error al guardar cambios:', error);
    toast.add({
      severity: 'error',
      summary: 'Error al guardar',
      detail: error.message || 'No se pudieron guardar los cambios',
      life: 5000
    });
  } finally {
    guardando.value = false;
  }
};

// Métodos para gestionar preguntas
const añadirPregunta = () => {
  if (!encuesta.value.preguntas) {
    encuesta.value.preguntas = [];
  }
  
  const nuevaPregunta = {
    id: Date.now() + Math.random(),
    texto: '',
    tipo: '',
    opciones: []
  };
  encuesta.value.preguntas.push(nuevaPregunta);
};

const eliminarPregunta = (index) => {
  encuesta.value.preguntas.splice(index, 1);
  toast.add({
    severity: 'info',
    summary: 'Pregunta eliminada',
    detail: 'La pregunta ha sido removida de la encuesta',
    life: 3000
  });
};

const actualizarOpcionesPregunta = (index) => {
  const pregunta = encuesta.value.preguntas[index];
  if (pregunta.tipo === 'opcion_multiple') {
    if (!pregunta.opciones || pregunta.opciones.length === 0) {
      pregunta.opciones = ['', ''];
    }
  } else {
    pregunta.opciones = [];
  }
};

const agregarOpcion = (preguntaIndex) => {
  if (!encuesta.value.preguntas[preguntaIndex].opciones) {
    encuesta.value.preguntas[preguntaIndex].opciones = [];
  }
  encuesta.value.preguntas[preguntaIndex].opciones.push('');
};

const eliminarOpcion = (preguntaIndex, opcionIndex) => {
  encuesta.value.preguntas[preguntaIndex].opciones.splice(opcionIndex, 1);
};

// Cargar encuesta al montar el componente
onMounted(() => {
  cargarEncuesta();
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