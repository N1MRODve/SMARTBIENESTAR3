<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
        <div class="flex justify-between items-start">
          <div>
            <h2 class="text-2xl font-bold text-gray-900">Crear Nueva Encuesta</h2>
            <p class="text-gray-600 mt-1">Elige cómo quieres crear tu encuesta</p>
          </div>
          <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 transition-colors">
            <X class="h-6 w-6" />
          </button>
        </div>
      </div>

      <!-- Contenido -->
      <div class="p-6">
        <!-- Opciones Principales -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <!-- Crear desde cero -->
          <button
            @click="seleccionarOpcion('desde-cero')"
            class="group relative bg-white rounded-xl shadow-sm border-2 hover:border-primary hover:shadow-md transition-all duration-200 p-8 text-left"
            :class="opcionSeleccionada === 'desde-cero' ? 'border-primary ring-2 ring-primary ring-opacity-20' : 'border-gray-200'"
          >
            <div class="flex flex-col items-center text-center">
              <div class="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Pencil class="h-10 w-10 text-white" />
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">Crear desde cero</h3>
              <p class="text-sm text-gray-600">
                Diseña una encuesta completamente personalizada con tus propias preguntas
              </p>
            </div>
            <div
              v-if="opcionSeleccionada === 'desde-cero'"
              class="absolute top-4 right-4 w-6 h-6 bg-primary rounded-full flex items-center justify-center"
            >
              <Check class="h-4 w-4 text-white" />
            </div>
          </button>

          <!-- Usar plantilla -->
          <button
            @click="seleccionarOpcion('plantilla')"
            class="group relative bg-white rounded-xl shadow-sm border-2 hover:border-primary hover:shadow-md transition-all duration-200 p-8 text-left"
            :class="opcionSeleccionada === 'plantilla' ? 'border-primary ring-2 ring-primary ring-opacity-20' : 'border-gray-200'"
          >
            <div class="flex flex-col items-center text-center">
              <div class="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Blocks class="h-10 w-10 text-white" />
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">Usar plantilla prediseñada</h3>
              <p class="text-sm text-gray-600">
                Ahorra tiempo usando una plantilla profesional que puedes personalizar
              </p>
            </div>
            <div
              v-if="opcionSeleccionada === 'plantilla'"
              class="absolute top-4 right-4 w-6 h-6 bg-primary rounded-full flex items-center justify-center"
            >
              <Check class="h-4 w-4 text-white" />
            </div>
          </button>
        </div>

        <!-- Plantillas Disponibles (solo si selecciona "plantilla") -->
        <div v-if="opcionSeleccionada === 'plantilla'" class="animate-fadeIn">
          <div class="mb-4">
            <h3 class="text-lg font-semibold text-gray-900">Plantillas Disponibles</h3>
            <p class="text-sm text-gray-600">Selecciona una plantilla para comenzar</p>
          </div>

          <div class="grid grid-cols-1 gap-4">
            <div
              v-for="plantilla in plantillas"
              :key="plantilla.id"
              @click="seleccionarPlantilla(plantilla)"
              class="bg-white rounded-xl p-6 border-2 cursor-pointer hover:border-primary hover:shadow-md transition-all duration-200"
              :class="plantillaSeleccionada?.id === plantilla.id ? 'border-primary ring-2 ring-primary ring-opacity-20' : 'border-gray-200'"
            >
              <div class="flex items-start justify-between">
                <div class="flex items-start flex-1">
                  <div class="flex-shrink-0 text-4xl mr-4">{{ plantilla.icon }}</div>
                  <div class="flex-1">
                    <h4 class="text-lg font-semibold text-gray-900 mb-1">{{ plantilla.nombre }}</h4>
                    <p class="text-sm text-gray-600 mb-3">{{ plantilla.descripcion }}</p>
                    <div class="flex items-center gap-4 text-sm text-gray-500">
                      <span class="flex items-center">
                        <FileText class="h-4 w-4 mr-1" />
                        {{ plantilla.preguntas.length }} preguntas
                      </span>
                      <span class="px-2 py-1 bg-indigo-50 text-indigo-800 rounded-full text-xs font-medium">
                        {{ plantilla.categoria }}
                      </span>
                    </div>
                  </div>
                </div>
                <div
                  v-if="plantillaSeleccionada?.id === plantilla.id"
                  class="flex-shrink-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center ml-4"
                >
                  <Check class="h-4 w-4 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer con botones -->
      <div class="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4">
        <div class="flex justify-between items-center">
          <button
            @click="$emit('close')"
            class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium"
          >
            Cancelar
          </button>
          <button
            @click="continuar"
            :disabled="!puedeContinuar"
            :class="[
              'px-6 py-2 rounded-lg font-medium transition-colors',
              puedeContinuar
                ? 'bg-primary text-white hover:bg-primary-dark'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            ]"
          >
            Continuar
            <ArrowRight class="h-4 w-4 inline-block ml-2" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { X, Check, FileText, ArrowRight, Pencil, Blocks } from 'lucide-vue-next';
import { plantillas } from '@/utils/plantillasMock.js';

const emit = defineEmits(['close', 'seleccionar-desde-cero', 'seleccionar-plantilla']);

const opcionSeleccionada = ref(null);
const plantillaSeleccionada = ref(null);

const puedeContinuar = computed(() => {
  if (opcionSeleccionada.value === 'desde-cero') return true;
  if (opcionSeleccionada.value === 'plantilla' && plantillaSeleccionada.value) return true;
  return false;
});

const seleccionarOpcion = (opcion) => {
  opcionSeleccionada.value = opcion;
  if (opcion === 'desde-cero') {
    plantillaSeleccionada.value = null;
  }
};

const seleccionarPlantilla = (plantilla) => {
  plantillaSeleccionada.value = plantilla;
};

const continuar = () => {
  if (opcionSeleccionada.value === 'desde-cero') {
    emit('seleccionar-desde-cero');
  } else if (opcionSeleccionada.value === 'plantilla' && plantillaSeleccionada.value) {
    emit('seleccionar-plantilla', plantillaSeleccionada.value);
  }
};
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}
</style>
