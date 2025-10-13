<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50 p-4"
        @click.self="cerrarModal"
      >
        <Transition
          enter-active-class="transition-all duration-200"
          leave-active-class="transition-all duration-200"
          enter-from-class="opacity-0 scale-95"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="isOpen"
            class="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <!-- Header -->
            <div class="sticky top-0 bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-5 border-b border-gray-200 z-10">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                    <MessageSquare class="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 class="text-2xl font-bold text-gray-900">Comunicar Resultados</h2>
                    <p class="text-sm text-gray-600 mt-1">Crea un comunicado sobre las acciones post-encuesta</p>
                  </div>
                </div>
                <button
                  @click="cerrarModal"
                  class="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-white/50 rounded-lg"
                >
                  <X class="h-6 w-6" />
                </button>
              </div>
            </div>

            <!-- Content -->
            <div class="p-6 space-y-6">
              <!-- Selector de Plantilla -->
              <div>
                <label class="block text-sm font-semibold text-gray-900 mb-3">
                  Selecciona una plantilla
                </label>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <button
                    v-for="plantilla in plantillasComunicado"
                    :key="plantilla.id"
                    @click="seleccionarPlantilla(plantilla)"
                    class="flex items-start p-4 border-2 rounded-xl text-left transition-all hover:shadow-md"
                    :class="plantillaSeleccionada?.id === plantilla.id
                      ? `border-${plantilla.color}-500 bg-${plantilla.color}-50 ring-2 ring-${plantilla.color}-200`
                      : 'border-gray-300 bg-white hover:border-gray-400'"
                  >
                    <div class="text-3xl mr-3">{{ plantilla.icono }}</div>
                    <div class="flex-1">
                      <h3 class="font-semibold text-gray-900 text-sm">{{ plantilla.titulo }}</h3>
                      <p class="text-xs text-gray-600 mt-1 line-clamp-2">{{ plantilla.cuerpo.substring(0, 80) }}...</p>
                    </div>
                  </button>
                </div>
              </div>

              <!-- Editor de Mensaje -->
              <div v-if="plantillaSeleccionada">
                <label class="block text-sm font-semibold text-gray-900 mb-2">
                  Personaliza el mensaje
                </label>
                <textarea
                  v-model="mensajeEditado"
                  rows="8"
                  class="w-full px-4 py-3 rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  placeholder="Escribe o edita el mensaje del comunicado..."
                ></textarea>
                <div class="flex items-center justify-between mt-2">
                  <p class="text-xs text-gray-500">
                    <span class="font-medium">{{ mensajeEditado.length }}</span> caracteres
                  </p>
                  <button
                    @click="restaurarPlantilla"
                    class="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    Restaurar plantilla original
                  </button>
                </div>
              </div>

              <!-- Vista Previa -->
              <div v-if="mensajeEditado" class="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <div class="flex items-center mb-3">
                  <Eye class="h-5 w-5 text-gray-600 mr-2" />
                  <h3 class="text-sm font-semibold text-gray-900">Vista Previa</h3>
                </div>
                <div class="bg-white rounded-lg p-4 shadow-sm">
                  <div class="flex items-center mb-3 pb-3 border-b border-gray-200">
                    <div class="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                      <Building2 class="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <p class="font-semibold text-sm text-gray-900">Recursos Humanos</p>
                      <p class="text-xs text-gray-500">Hoy</p>
                    </div>
                  </div>
                  <p class="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{{ mensajeEditado }}</p>
                </div>
              </div>

              <!-- Destinatarios -->
              <div>
                <label class="block text-sm font-semibold text-gray-900 mb-3">
                  Selecciona destinatarios
                </label>
                <div class="space-y-2">
                  <label
                    v-for="opcion in opcionesDestinatarios"
                    :key="opcion.id"
                    class="flex items-start p-3 border-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50"
                    :class="destinatariosSeleccionados.includes(opcion.id) ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'"
                  >
                    <input
                      type="checkbox"
                      :value="opcion.id"
                      v-model="destinatariosSeleccionados"
                      class="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <div class="ml-3 flex-1">
                      <div class="flex items-center">
                        <span class="text-lg mr-2">{{ opcion.icono }}</span>
                        <span class="font-medium text-sm text-gray-900">{{ opcion.label }}</span>
                      </div>
                      <p class="text-xs text-gray-600 mt-1">{{ opcion.descripcion }}</p>
                    </div>
                  </label>
                </div>
              </div>

              <!-- Último Comunicado Enviado -->
              <div v-if="ultimoComunicado" class="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div class="flex items-start">
                  <Info class="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p class="text-sm font-semibold text-blue-900 mb-1">Último comunicado enviado</p>
                    <p class="text-xs text-blue-800">
                      <strong>Fecha:</strong> {{ formatearFecha(ultimoComunicado.fecha_envio) }} •
                      <strong>Tipo:</strong> {{ obtenerTituloPlantilla(ultimoComunicado.tipo) }} •
                      <strong>Destinatarios:</strong> {{ ultimoComunicado.total_destinatarios }} personas
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center">
              <button
                @click="cerrarModal"
                class="px-5 py-2 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <div class="flex gap-3">
                <button
                  @click="guardarBorrador"
                  :disabled="!mensajeEditado || destinatariosSeleccionados.length === 0"
                  class="px-5 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save class="h-4 w-4 inline mr-2" />
                  Guardar borrador
                </button>
                <button
                  @click="enviarComunicado"
                  :disabled="!mensajeEditado || destinatariosSeleccionados.length === 0 || enviando"
                  class="px-5 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <Send v-if="!enviando" class="h-4 w-4 mr-2" />
                  <Loader2 v-else class="h-4 w-4 mr-2 animate-spin" />
                  {{ enviando ? 'Enviando...' : 'Enviar comunicado' }}
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useToast } from 'primevue/usetoast';
import {
  MessageSquare,
  X,
  Eye,
  Building2,
  Info,
  Save,
  Send,
  Loader2
} from 'lucide-vue-next';
import {
  plantillasComunicado,
  opcionesDestinatarios,
  agregarComunicado
} from '@/utils/comunicadosMock.js';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  nombreEncuesta: {
    type: String,
    required: true
  },
  encuestaId: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['close', 'comunicado-enviado']);

const toast = useToast();

// Estado
const plantillaSeleccionada = ref(null);
const mensajeEditado = ref('');
const destinatariosSeleccionados = ref(['todos']);
const enviando = ref(false);
const ultimoComunicado = ref(null);

// Computed
const totalDestinatarios = computed(() => {
  // Mock: calcular según destinatarios seleccionados
  let total = 0;
  if (destinatariosSeleccionados.value.includes('todos')) total += 70;
  if (destinatariosSeleccionados.value.includes('lideres')) total += 12;
  if (destinatariosSeleccionados.value.includes('riesgo_alto')) total += 15;
  if (destinatariosSeleccionados.value.includes('riesgo_moderado')) total += 25;
  return Math.min(total, 70);
});

// Métodos
const seleccionarPlantilla = (plantilla) => {
  plantillaSeleccionada.value = plantilla;
  mensajeEditado.value = plantilla.cuerpo.replace('{nombre_encuesta}', props.nombreEncuesta);
};

const restaurarPlantilla = () => {
  if (plantillaSeleccionada.value) {
    mensajeEditado.value = plantillaSeleccionada.value.cuerpo.replace('{nombre_encuesta}', props.nombreEncuesta);
  }
};

const guardarBorrador = () => {
  toast.add({
    severity: 'info',
    summary: 'Borrador guardado',
    detail: 'El comunicado ha sido guardado como borrador',
    life: 3000
  });
};

const enviarComunicado = async () => {
  if (!mensajeEditado.value || destinatariosSeleccionados.value.length === 0) {
    toast.add({
      severity: 'warn',
      summary: 'Campos incompletos',
      detail: 'Completa el mensaje y selecciona al menos un destinatario',
      life: 4000
    });
    return;
  }

  enviando.value = true;

  try {
    await new Promise(resolve => setTimeout(resolve, 1500));

    const comunicado = agregarComunicado({
      encuesta_id: props.encuestaId,
      nombre_encuesta: props.nombreEncuesta,
      tipo: plantillaSeleccionada.value?.id || 'general',
      cuerpo: mensajeEditado.value,
      destinatarios: destinatariosSeleccionados.value,
      total_destinatarios: totalDestinatarios.value
    });

    ultimoComunicado.value = comunicado;

    toast.add({
      severity: 'success',
      summary: 'Comunicado enviado correctamente',
      detail: `Se ha enviado a ${totalDestinatarios.value} destinatarios`,
      life: 5000
    });

    emit('comunicado-enviado', comunicado);

    setTimeout(() => {
      cerrarModal();
    }, 1000);
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error al enviar',
      detail: 'No se pudo enviar el comunicado. Intenta de nuevo.',
      life: 4000
    });
  } finally {
    enviando.value = false;
  }
};

const cerrarModal = () => {
  emit('close');
  setTimeout(() => {
    plantillaSeleccionada.value = null;
    mensajeEditado.value = '';
    destinatariosSeleccionados.value = ['todos'];
  }, 200);
};

const formatearFecha = (fecha) => {
  return new Date(fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const obtenerTituloPlantilla = (tipo) => {
  const plantilla = plantillasComunicado.find(p => p.id === tipo);
  return plantilla?.titulo || 'Comunicación General';
};

// Watch para resetear si se cierra el modal
watch(() => props.isOpen, (newVal) => {
  if (!newVal) {
    plantillaSeleccionada.value = null;
    mensajeEditado.value = '';
  }
});
</script>
