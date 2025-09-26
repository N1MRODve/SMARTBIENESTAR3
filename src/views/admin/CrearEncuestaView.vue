<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <Header subtitulo="Crear Nueva Encuesta" />
    
    <!-- Main Content -->
    <div class="py-8">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="mb-8">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">Crear Nueva Encuesta</h1>
              <p class="mt-2 text-lg text-gray-600">Diseña una encuesta de bienestar para tus empleados</p>
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

        <!-- Formulario Principal -->
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <form @submit.prevent="handleLanzarEncuesta" class="space-y-8">
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
                    v-model="nuevaEncuesta.titulo"
                    type="text"
                    class="input"
                    placeholder="Ej: Encuesta de Satisfacción Laboral"
                    required
                  />
                  <p class="mt-1 text-sm text-gray-500">
                    Este será el título principal que verán los empleados
                  </p>
                </div>

                <!-- Descripción -->
                <div class="form-group">
                  <label for="descripcion" class="form-label">
                    Descripción (Opcional)
                  </label>
                  <textarea
                    id="descripcion"
                    v-model="nuevaEncuesta.descripcion"
                    rows="3"
                    class="input"
                    placeholder="Describe brevemente el propósito de esta encuesta..."
                  ></textarea>
                </div>
              </div>
            </div>

            <!-- Preguntas -->
            <div class="p-6">
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-xl font-semibold text-gray-900">
                  Preguntas ({{ nuevaEncuesta.preguntas.length }})
                </h2>
                <Button 
                  type="button"
                  @click="añadirPregunta"
                  variant="outline"
                >
                  <Plus class="h-5 w-5 mr-2" />
                  Añadir Pregunta
                </Button>
              </div>

              <!-- Lista de Preguntas -->
              <div v-if="nuevaEncuesta.preguntas.length === 0" class="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                <HelpCircle class="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 class="text-lg font-medium text-gray-900 mb-2">No hay preguntas aún</h3>
                <p class="text-gray-500 mb-4">Comienza agregando tu primera pregunta</p>
                <Button 
                  type="button"
                  @click="añadirPregunta"
                >
                  <Plus class="h-5 w-5 mr-2" />
                  Añadir Primera Pregunta
                </Button>
              </div>

              <div v-else class="space-y-6">
                <div 
                  v-for="(pregunta, index) in nuevaEncuesta.preguntas" 
                  :key="pregunta.id"
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
                        />
                        <Button 
                          v-if="pregunta.opciones.length > 2"
                          type="button"
                          @click="eliminarOpcion(index, opcionIndex)"
                          variant="outline"
                          class="text-red-600 hover:text-red-700"
                        >
                          <X class="h-4 w-4" />
                        </Button>
                      </div>
                      <Button 
                        type="button"
                        @click="agregarOpcion(index)"
                        variant="outline"
                        class="w-full"
                      >
                        <Plus class="h-4 w-4 mr-2" />
                        Agregar Opción
                      </Button>
                    </div>
                  </div>

                  <!-- Información para Texto Abierto -->
                  <div v-if="pregunta.tipo === 'texto_abierto'" class="form-group">
                    <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div class="flex items-start">
                        <svg class="h-5 w-5 text-blue-500 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <div>
                          <h4 class="text-sm font-medium text-blue-800 mb-1">Pregunta de Texto Abierto</h4>
                          <p class="text-sm text-blue-700">
                            Los empleados podrán escribir respuestas libres y anónimas. 
                            Ideal para recopilar feedback cualitativo y sugerencias.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- Preview de la Pregunta -->
                  <div class="mt-6 p-4 bg-white border border-gray-200 rounded-lg">
                    <h4 class="text-sm font-medium text-gray-700 mb-3">Vista Previa:</h4>
                    <div class="space-y-3">
                      <p class="font-medium text-gray-900">{{ pregunta.texto || 'Texto de la pregunta...' }}</p>
                      
                      <!-- Preview Opción Múltiple -->
                      <div v-if="pregunta.tipo === 'opcion_multiple'" class="space-y-2">
                        <div 
                          v-for="(opcion, opcionIndex) in pregunta.opciones" 
                          :key="opcionIndex"
                          class="flex items-center"
                        >
                          <input type="radio" :name="`preview-${index}`" class="mr-2" disabled />
                          <span class="text-gray-700">{{ opcion || `Opción ${opcionIndex + 1}` }}</span>
                        </div>
                      </div>

                      <!-- Preview Sí/No -->
                      <div v-else-if="pregunta.tipo === 'si_no'" class="space-y-2">
                        <div class="flex items-center">
                          <input type="radio" name="preview-sino" class="mr-2" disabled />
                          <span class="text-gray-700">Sí</span>
                        </div>
                        <div class="flex items-center">
                          <input type="radio" name="preview-sino" class="mr-2" disabled />
                          <span class="text-gray-700">No</span>
                        </div>
                      </div>

                      <!-- Preview Escala 1-5 -->
                      <div v-else-if="pregunta.tipo === 'escala_1_5'" class="space-y-3">
                        <div class="flex items-center justify-between text-sm text-gray-500">
                          <span>Muy insatisfecho</span>
                          <span>Muy satisfecho</span>
                        </div>
                        <div class="flex items-center justify-between">
                          <div v-for="valor in [1, 2, 3, 4, 5]" :key="valor" class="flex flex-col items-center">
                            <input type="radio" name="preview-escala" class="mb-2" disabled />
                            <span class="text-sm font-medium text-gray-700">{{ valor }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                     <!-- Preview Texto Abierto -->
                     <div v-else-if="pregunta.tipo === 'texto_abierto'" class="space-y-3">
                       <textarea 
                         class="w-full px-3 py-2 border border-gray-300 rounded-md resize-none"
                         rows="4"
                         placeholder="Los empleados podrán escribir su respuesta aquí..."
                         disabled
                       ></textarea>
                       <p class="text-xs text-green-600 flex items-center">
                         <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                         </svg>
                         Tu respuesta a esta pregunta es 100% anónima
                       </p>
                     </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Botones de Acción -->
            <div class="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div class="flex justify-between items-center">
                <div class="text-sm text-gray-500">
                  <span v-if="nuevaEncuesta.preguntas.length === 0">
                    Agrega al menos una pregunta para lanzar la encuesta
                  </span>
                  <span v-else>
                    {{ nuevaEncuesta.preguntas.length }} pregunta{{ nuevaEncuesta.preguntas.length !== 1 ? 's' : '' }} lista{{ nuevaEncuesta.preguntas.length !== 1 ? 's' : '' }}
                  </span>
                </div>
                
                <div class="flex space-x-4">
                  <Button 
                    type="button"
                    @click="guardarBorrador"
                    variant="outline"
                    :disabled="loading || !nuevaEncuesta.titulo.trim()"
                  >
                    <Save class="h-4 w-4 mr-2" />
                    Guardar Borrador
                  </Button>
                  
                  <Button 
                    type="submit"
                    :loading="loading"
                    :disabled="!puedeSerLanzada"
                  >
                    <Rocket class="h-4 w-4 mr-2" />
                    Lanzar Encuesta
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
import { useEncuestasStore } from '@/stores/encuestas.store';
import Button from '@/components/ui/Button.vue';
import Header from '@/components/common/Header.vue';
import { 
  ArrowLeft, 
  Plus, 
  HelpCircle, 
  Trash2, 
  X, 
  Save, 
  Rocket 
} from 'lucide-vue-next';

const router = useRouter();
const toast = useToast();
const encuestasStore = useEncuestasStore();

// Estados reactivos
const loading = ref(false);
const nuevaEncuesta = ref({
  titulo: '',
  descripcion: '',
  preguntas: []
});

// Computed properties
const puedeSerLanzada = computed(() => {
  return nuevaEncuesta.value.titulo.trim() && 
         nuevaEncuesta.value.preguntas.length > 0 &&
         nuevaEncuesta.value.preguntas.every(p => 
           p.texto.trim() && 
           p.tipo && 
           (p.tipo !== 'opcion_multiple' || (p.opciones && p.opciones.every(o => o.trim())))
         );
});

// Métodos para gestionar preguntas
const añadirPregunta = () => {
  const nuevaPregunta = {
    id: Date.now() + Math.random(),
    texto: '',
    tipo: '',
    opciones: ['', '']
  };
  nuevaEncuesta.value.preguntas.push(nuevaPregunta);
};

const eliminarPregunta = (index) => {
  nuevaEncuesta.value.preguntas.splice(index, 1);
  toast.add({
    severity: 'info',
    summary: 'Pregunta eliminada',
    detail: 'La pregunta ha sido removida de la encuesta',
    life: 3000
  });
};

const actualizarOpcionesPregunta = (index) => {
  const pregunta = nuevaEncuesta.value.preguntas[index];
  if (pregunta.tipo === 'opcion_multiple') {
    pregunta.opciones = ['', ''];
  } else {
    pregunta.opciones = [];
  }
};

const agregarOpcion = (preguntaIndex) => {
  nuevaEncuesta.value.preguntas[preguntaIndex].opciones.push('');
};

const eliminarOpcion = (preguntaIndex, opcionIndex) => {
  nuevaEncuesta.value.preguntas[preguntaIndex].opciones.splice(opcionIndex, 1);
};

// Métodos principales
const volverAlDashboard = () => {
  router.push('/admin/dashboard');
};

const guardarBorrador = async () => {
  if (!nuevaEncuesta.value.titulo.trim()) {
    toast.add({
      severity: 'warn',
      summary: 'Título requerido',
      detail: 'Debes escribir un título para guardar el borrador',
      life: 4000
    });
    return;
  }

  loading.value = true;
  
  try {
    await encuestasStore.createNewSurvey({
      ...nuevaEncuesta.value,
      estado: 'borrador'
    });
    
    toast.add({
      severity: 'success',
      summary: 'Borrador guardado',
      detail: 'La encuesta ha sido guardada como borrador',
      life: 4000
    });
    
    router.push('/admin/dashboard');
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error al guardar',
      detail: error.message || 'No se pudo guardar el borrador',
      life: 5000
    });
  } finally {
    loading.value = false;
  }
};

const handleLanzarEncuesta = async () => {
  // Validación básica
  if (!nuevaEncuesta.value.titulo.trim()) {
    toast.add({
      severity: 'warn',
      summary: 'Título requerido',
      detail: 'Debes escribir un título para la encuesta',
      life: 4000
    });
    return;
  }

  if (nuevaEncuesta.value.preguntas.length === 0) {
    toast.add({
      severity: 'warn',
      summary: 'Preguntas requeridas',
      detail: 'Debes agregar al menos una pregunta',
      life: 4000
    });
    return;
  }

  // Validar que todas las preguntas estén completas
  for (let i = 0; i < nuevaEncuesta.value.preguntas.length; i++) {
    const pregunta = nuevaEncuesta.value.preguntas[i];
    
    if (!pregunta.texto.trim()) {
      toast.add({
        severity: 'warn',
        summary: 'Pregunta incompleta',
        detail: `La pregunta ${i + 1} necesita un texto`,
        life: 4000
      });
      return;
    }

    if (!pregunta.tipo) {
      toast.add({
        severity: 'warn',
        summary: 'Tipo de pregunta requerido',
        detail: `Selecciona un tipo para la pregunta ${i + 1}`,
        life: 4000
      });
      return;
    }

    if (pregunta.tipo === 'opcion_multiple') {
      if (!pregunta.opciones || pregunta.opciones.length < 2) {
        toast.add({
          severity: 'warn',
          summary: 'Opciones insuficientes',
          detail: `La pregunta ${i + 1} necesita al menos 2 opciones`,
          life: 4000
        });
        return;
      }

      for (let j = 0; j < pregunta.opciones.length; j++) {
        if (!pregunta.opciones[j].trim()) {
          toast.add({
            severity: 'warn',
            summary: 'Opción vacía',
            detail: `Completa todas las opciones de la pregunta ${i + 1}`,
            life: 4000
          });
          return;
        }
      }
    }
  }

  loading.value = true;
  
  try {
    // Llamar a la acción del store
    await encuestasStore.createNewSurvey({
      ...nuevaEncuesta.value,
      estado: 'activa'
    });
    
    toast.add({
      severity: 'success',
      summary: '¡Encuesta lanzada!',
      detail: 'La encuesta está ahora disponible para los empleados',
      life: 5000
    });
    
    // Redirigir al dashboard
    router.push('/admin/dashboard');
  } catch (error) {
    console.error('Error al lanzar encuesta:', error);
    toast.add({
      severity: 'error',
      summary: 'Error al lanzar',
      detail: error.message || 'No se pudo lanzar la encuesta',
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