<template>
  <div class="min-h-screen bg-gray-50">
    <Header subtitulo="Vista Previa de Envío" />

    <div class="py-8">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="mb-8">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">Vista Previa de Envío</h1>
              <p class="mt-2 text-lg text-gray-600">Selecciona los destinatarios de tu encuesta</p>
            </div>
            <Button
              @click="volver"
              variant="outline"
            >
              <ArrowLeft class="h-5 w-5 mr-2" />
              Volver
            </Button>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Columna Principal -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Resumen de la Encuesta -->
            <div class="bg-white rounded-xl shadow-sm p-6">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">Resumen de la Encuesta</h2>

              <div class="space-y-4">
                <div>
                  <label class="text-sm font-medium text-gray-500">Título</label>
                  <p class="text-lg font-medium text-gray-900 mt-1">{{ encuesta.titulo }}</p>
                </div>

                <div v-if="encuesta.descripcion">
                  <label class="text-sm font-medium text-gray-500">Descripción</label>
                  <p class="text-gray-700 mt-1">{{ encuesta.descripcion }}</p>
                </div>

                <div class="flex items-center gap-6 pt-2 flex-wrap">
                  <div class="flex items-center text-sm text-gray-600">
                    <FileText class="h-5 w-5 mr-2 text-primary" />
                    <span><strong>{{ encuesta.preguntas?.length || 0 }}</strong> preguntas</span>
                  </div>

                  <div class="flex items-center text-sm text-gray-600">
                    <span
                      :class="[
                        'px-3 py-1 rounded-full text-xs font-medium',
                        encuesta.creada_desde === 'plantilla'
                          ? 'bg-indigo-50 text-indigo-800'
                          : 'bg-gray-50 text-gray-800'
                      ]"
                    >
                      {{ encuesta.creada_desde === 'plantilla' ? '🧩 Desde plantilla' : '🧱 Desde cero' }}
                    </span>
                  </div>
                </div>

                <!-- Configuración de Privacidad -->
                <div class="pt-4 border-t border-gray-200">
                  <label class="text-sm font-medium text-gray-500 mb-2 block">Nivel de Privacidad</label>
                  <div
                    class="flex items-start p-3 rounded-lg border-2"
                    :class="getPrivacidadClasses(encuesta.privacidadNivel || 'anonimato_completo')"
                  >
                    <component :is="getPrivacidadIcon(encuesta.privacidadNivel || 'anonimato_completo')" class="h-5 w-5 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p class="font-semibold text-sm">{{ getPrivacidadLabel(encuesta.privacidadNivel || 'anonimato_completo') }}</p>
                      <p class="text-xs mt-1 text-gray-600">{{ getPrivacidadDescripcion(encuesta.privacidadNivel || 'anonimato_completo') }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Vista Previa de Pregunta -->
              <div class="mt-6">
                <button
                  @click="mostrarVistaPrevia = true"
                  class="text-primary hover:text-primary-dark font-medium text-sm flex items-center"
                >
                  <Eye class="h-4 w-4 mr-2" />
                  Ver cómo la recibe un empleado
                </button>
              </div>
            </div>

            <!-- Selección de Departamentos -->
            <div class="bg-white rounded-xl shadow-sm p-6">
              <h2 class="text-xl font-semibold text-gray-900 mb-2">Seleccionar Destinatarios</h2>
              <p class="text-sm text-gray-600 mb-6">
                Selecciona los departamentos o grupos de empleados a los que deseas enviar esta encuesta.
              </p>

              <!-- Opción: Todos los empleados -->
              <div class="mb-4">
                <label
                  class="flex items-center p-4 bg-indigo-50 border-2 border-indigo-200 rounded-lg cursor-pointer hover:bg-indigo-100 transition-colors"
                  :class="{ 'ring-2 ring-indigo-500': todosSeleccionados }"
                >
                  <input
                    type="checkbox"
                    v-model="todosSeleccionados"
                    @change="toggleTodos"
                    class="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <div class="ml-3 flex-1">
                    <div class="flex items-center justify-between">
                      <span class="font-semibold text-gray-900">Todos los empleados</span>
                      <span class="text-sm font-medium text-indigo-700">
                        {{ totalEmpleadosEmpresa }} empleados
                      </span>
                    </div>
                  </div>
                </label>
              </div>

              <!-- Lista de Departamentos -->
              <div class="space-y-3">
                <div
                  v-for="dept in departamentos"
                  :key="dept.id"
                  class="flex items-center p-3 bg-gray-50 hover:bg-indigo-50 rounded-lg cursor-pointer transition-colors border-2"
                  :class="departamentosSeleccionados.includes(dept.id) ? 'border-indigo-300 bg-indigo-50' : 'border-transparent'"
                  @click="toggleDepartamento(dept.id)"
                >
                  <input
                    type="checkbox"
                    :checked="departamentosSeleccionados.includes(dept.id)"
                    @change="toggleDepartamento(dept.id)"
                    class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    @click.stop
                  />
                  <div class="ml-3 flex-1 flex items-center justify-between">
                    <div>
                      <span class="font-medium text-gray-900">{{ dept.nombre }}</span>
                    </div>
                    <span class="text-sm text-gray-600">
                      {{ dept.empleados }} empleados
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar Resumen -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-xl shadow-sm p-6 sticky top-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Resumen de Envío</h3>

              <div class="space-y-4 text-sm">
                <div class="flex items-start">
                  <div class="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                    <FileText class="h-4 w-4 text-indigo-600" />
                  </div>
                  <div class="flex-1">
                    <p class="font-medium text-gray-700">Encuesta</p>
                    <p class="text-gray-600 mt-1">{{ encuesta.titulo }}</p>
                  </div>
                </div>

                <div class="flex items-start">
                  <div class="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                    <Calendar class="h-4 w-4 text-indigo-600" />
                  </div>
                  <div class="flex-1">
                    <p class="font-medium text-gray-700">Fecha de creación</p>
                    <p class="text-gray-600 mt-1">{{ fechaActual }}</p>
                  </div>
                </div>

                <div class="flex items-start">
                  <div class="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                    <Users class="h-4 w-4 text-indigo-600" />
                  </div>
                  <div class="flex-1">
                    <p class="font-medium text-gray-700">Destinatarios</p>
                    <p class="text-gray-600 mt-1">
                      {{ departamentosSeleccionados.length }} departamento{{ departamentosSeleccionados.length !== 1 ? 's' : '' }}
                    </p>
                    <p class="text-indigo-600 font-semibold mt-1">
                      {{ totalEmpleadosSeleccionados }} empleado{{ totalEmpleadosSeleccionados !== 1 ? 's' : '' }}
                    </p>
                  </div>
                </div>
              </div>

              <div class="mt-6 pt-6 border-t border-gray-200">
                <Button
                  @click="enviarEncuesta"
                  :disabled="departamentosSeleccionados.length === 0"
                  :loading="enviando"
                  class="w-full bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-gray-300"
                >
                  <Send class="h-4 w-4 mr-2" />
                  Enviar Encuesta
                </Button>

                <p v-if="departamentosSeleccionados.length === 0" class="text-xs text-gray-500 mt-2 text-center">
                  Selecciona al menos un departamento
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Vista Previa de Pregunta -->
    <div v-if="mostrarVistaPrevia" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div class="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
          <div class="flex justify-between items-start">
            <div>
              <h2 class="text-2xl font-bold text-gray-900">Vista Previa</h2>
              <p class="text-gray-600 mt-1">Así verá la encuesta un empleado</p>
            </div>
            <button @click="mostrarVistaPrevia = false" class="text-gray-400 hover:text-gray-600 transition-colors">
              <X class="h-6 w-6" />
            </button>
          </div>
        </div>

        <div class="p-6">
          <div class="bg-gray-50 rounded-lg p-6 mb-4">
            <h3 class="text-xl font-bold text-gray-900 mb-2">{{ encuesta.titulo }}</h3>
            <p v-if="encuesta.descripcion" class="text-gray-600 mb-4">{{ encuesta.descripcion }}</p>
            <div class="flex items-center text-sm text-gray-500">
              <FileText class="h-4 w-4 mr-2" />
              {{ encuesta.preguntas?.length || 0 }} preguntas
            </div>
          </div>

          <!-- Ejemplo de primera pregunta -->
          <div v-if="encuesta.preguntas && encuesta.preguntas.length > 0" class="bg-white border border-gray-200 rounded-lg p-6">
            <div class="mb-4">
              <span class="text-sm text-gray-500">Pregunta 1 de {{ encuesta.preguntas.length }}</span>
            </div>

            <h4 class="text-lg font-medium text-gray-900 mb-4">{{ encuesta.preguntas[0].texto }}</h4>

            <!-- Renderizar según tipo -->
            <div v-if="encuesta.preguntas[0].tipo === 'escala_1_5'" class="space-y-3">
              <div class="flex items-center justify-between text-sm text-gray-500 mb-2">
                <span>Muy insatisfecho</span>
                <span>Muy satisfecho</span>
              </div>
              <div class="flex items-center justify-between">
                <div v-for="valor in [1, 2, 3, 4, 5]" :key="valor" class="flex flex-col items-center">
                  <input type="radio" name="preview-escala" class="mb-2 h-5 w-5" disabled />
                  <span class="text-sm font-medium text-gray-700">{{ valor }}</span>
                </div>
              </div>
            </div>

            <div v-else-if="encuesta.preguntas[0].tipo === 'si_no'" class="space-y-3">
              <label class="flex items-center p-3 bg-gray-50 rounded-lg">
                <input type="radio" name="preview-sino" class="mr-3 h-4 w-4" disabled />
                <span class="text-gray-700">Sí</span>
              </label>
              <label class="flex items-center p-3 bg-gray-50 rounded-lg">
                <input type="radio" name="preview-sino" class="mr-3 h-4 w-4" disabled />
                <span class="text-gray-700">No</span>
              </label>
            </div>

            <div v-else-if="encuesta.preguntas[0].tipo === 'opcion_multiple'" class="space-y-3">
              <label
                v-for="(opcion, index) in encuesta.preguntas[0].opciones"
                :key="index"
                class="flex items-center p-3 bg-gray-50 rounded-lg"
              >
                <input type="radio" name="preview-multiple" class="mr-3 h-4 w-4" disabled />
                <span class="text-gray-700">{{ opcion }}</span>
              </label>
            </div>

            <div v-else-if="encuesta.preguntas[0].tipo === 'texto_abierto'" class="space-y-3">
              <textarea
                class="w-full px-3 py-2 border border-gray-300 rounded-md resize-none"
                rows="4"
                placeholder="Escribe tu respuesta aquí..."
                disabled
              ></textarea>
              <p class="text-xs text-green-600 flex items-center">
                <Shield class="h-4 w-4 mr-1" />
                Tu respuesta es 100% anónima
              </p>
            </div>
          </div>

          <div class="mt-6 flex justify-end">
            <Button @click="mostrarVistaPrevia = false" variant="outline">
              Cerrar Vista Previa
            </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Confirmación de Envío -->
    <div v-if="mostrarConfirmacion" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle class="h-10 w-10 text-green-600" />
        </div>
        <h3 class="text-2xl font-bold text-gray-900 mb-2">¡Encuesta Enviada!</h3>
        <p class="text-gray-600 mb-6">
          La encuesta ha sido enviada correctamente a {{ totalEmpleadosSeleccionados }} empleados en {{ departamentosSeleccionados.length }} departamento{{ departamentosSeleccionados.length !== 1 ? 's' : '' }}.
        </p>
        <Button @click="irAListaEncuestas" class="w-full">
          Ver Lista de Encuestas
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useEncuestasStore } from '@/stores/encuestas.store';
import Button from '@/components/ui/Button.vue';
import Header from '@/components/common/Header.vue';
import {
  ArrowLeft,
  FileText,
  Users,
  Calendar,
  Send,
  Eye,
  X,
  CheckCircle,
  Shield,
  ShieldCheck,
  Lock,
  UserCheck
} from 'lucide-vue-next';
import { departamentos, getTotalEmpleados } from '@/utils/departamentosMock.js';

const router = useRouter();
const route = useRoute();
const toast = useToast();
const encuestasStore = useEncuestasStore();

// Estado
const encuesta = ref({
  titulo: '',
  descripcion: '',
  preguntas: [],
  categoria: '',
  creada_desde: 'custom'
});

const departamentosSeleccionados = ref([]);
const todosSeleccionados = ref(false);
const enviando = ref(false);
const mostrarVistaPrevia = ref(false);
const mostrarConfirmacion = ref(false);

// Computed
const totalEmpleadosEmpresa = computed(() => getTotalEmpleados());

const totalEmpleadosSeleccionados = computed(() => {
  return departamentosSeleccionados.value.reduce((total, deptId) => {
    const dept = departamentos.find(d => d.id === deptId);
    return total + (dept?.empleados || 0);
  }, 0);
});

const fechaActual = computed(() => {
  return new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Métodos
onMounted(() => {
  cargarDatosEncuesta();
});

const cargarDatosEncuesta = () => {
  const datosEncuesta = sessionStorage.getItem('encuesta_preview');
  if (datosEncuesta) {
    try {
      encuesta.value = JSON.parse(datosEncuesta);
    } catch (error) {
      console.error('Error al cargar datos de encuesta:', error);
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudieron cargar los datos de la encuesta',
        life: 4000
      });
      router.push('/admin/encuestas');
    }
  } else {
    toast.add({
      severity: 'warn',
      summary: 'Sin datos',
      detail: 'No hay datos de encuesta para previsualizar',
      life: 4000
    });
    router.push('/admin/encuestas');
  }
};

const toggleDepartamento = (deptId) => {
  const index = departamentosSeleccionados.value.indexOf(deptId);
  if (index > -1) {
    departamentosSeleccionados.value.splice(index, 1);
  } else {
    departamentosSeleccionados.value.push(deptId);
  }

  todosSeleccionados.value = departamentosSeleccionados.value.length === departamentos.length;
};

const toggleTodos = () => {
  if (todosSeleccionados.value) {
    departamentosSeleccionados.value = departamentos.map(d => d.id);
  } else {
    departamentosSeleccionados.value = [];
  }
};

const enviarEncuesta = async () => {
  if (departamentosSeleccionados.value.length === 0) {
    toast.add({
      severity: 'warn',
      summary: 'Sin destinatarios',
      detail: 'Debes seleccionar al menos un departamento',
      life: 4000
    });
    return;
  }

  enviando.value = true;

  try {
    // Simular envío con mock data
    // TODO: conectar con tablas "departamentos" y "empleados_encuestas" cuando BD esté activa.
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Crear la encuesta con estado "Enviada"
    await encuestasStore.createNewSurvey({
      ...encuesta.value,
      estado: 'activa',
      fecha_envio: new Date(),
      departamentos_destinatarios: departamentosSeleccionados.value,
      total_destinatarios: totalEmpleadosSeleccionados.value
    });

    // Limpiar datos de sesión
    sessionStorage.removeItem('encuesta_preview');

    // Mostrar confirmación
    mostrarConfirmacion.value = true;
  } catch (error) {
    console.error('Error al enviar encuesta:', error);
    toast.add({
      severity: 'error',
      summary: 'Error al enviar',
      detail: error.message || 'No se pudo enviar la encuesta',
      life: 5000
    });
  } finally {
    enviando.value = false;
  }
};

const volver = () => {
  router.back();
};

const irAListaEncuestas = () => {
  router.push('/admin/encuestas');
};

const getPrivacidadIcon = (nivel) => {
  const iconos = {
    'anonimato_completo': ShieldCheck,
    'anonimato_parcial': Lock,
    'identificado': UserCheck
  };
  return iconos[nivel] || ShieldCheck;
};

const getPrivacidadLabel = (nivel) => {
  const labels = {
    'anonimato_completo': 'Anónimo completo',
    'anonimato_parcial': 'Anónimo parcial',
    'identificado': 'Identificado (con propósito)'
  };
  return labels[nivel] || 'Anónimo completo';
};

const getPrivacidadDescripcion = (nivel) => {
  const descripciones = {
    'anonimato_completo': 'Respuestas 100% anónimas sin identificadores',
    'anonimato_parcial': 'Agrupadas por departamento sin datos individuales',
    'identificado': 'Asociadas al usuario con fines de seguimiento'
  };
  return descripciones[nivel] || 'Respuestas 100% anónimas';
};

const getPrivacidadClasses = (nivel) => {
  const clases = {
    'anonimato_completo': 'bg-green-50 border-green-300 text-green-800',
    'anonimato_parcial': 'bg-orange-50 border-orange-300 text-orange-800',
    'identificado': 'bg-blue-50 border-blue-300 text-blue-800'
  };
  return clases[nivel] || 'bg-green-50 border-green-300 text-green-800';
};
</script>
