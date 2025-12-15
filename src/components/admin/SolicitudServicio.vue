<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    modal
    :dismissableMask="true"
    :style="{ width: '50rem' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
  >
    <template #header>
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
          <FileCheck class="h-6 w-6 text-indigo-600" />
        </div>
        <div>
          <h3 class="text-xl font-bold text-gray-900">
            Solicitar Implementación de Servicio
          </h3>
          <p class="text-sm text-gray-600 mt-1">
            Completa los detalles de la implementación y guarda la solicitud
          </p>
        </div>
      </div>
    </template>

    <form @submit.prevent="guardarSolicitud" class="space-y-6">
      <!-- Servicio Seleccionado -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Servicio seleccionado
        </label>
        <div class="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-lg">
          <div class="flex items-center gap-3">
            <span class="text-3xl">{{ servicio?.icono }}</span>
            <div class="flex-1">
              <p class="font-semibold text-gray-900">{{ servicio?.nombre }}</p>
              <p class="text-sm text-gray-600">{{ servicio?.categoria }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Departamento -->
      <div>
        <label for="departamento" class="block text-sm font-medium text-gray-700 mb-2">
          Departamento destino <span class="text-red-500">*</span>
        </label>
        <select
          id="departamento"
          v-model="formData.departamento"
          required
          class="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-4 py-2.5 text-gray-900"
        >
          <option value="" disabled>Selecciona un departamento</option>
          <option v-for="dept in departamentos" :key="dept" :value="dept">
            {{ dept }}
          </option>
        </select>
      </div>

      <!-- Fecha de Implementación -->
      <div>
        <label for="fecha" class="block text-sm font-medium text-gray-700 mb-2">
          Fecha de implementación <span class="text-red-500">*</span>
        </label>
        <div class="relative">
          <input
            id="fecha"
            type="date"
            v-model="formData.fecha_implementacion"
            :min="fechaMinima"
            required
            class="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-4 py-2.5 text-gray-900"
          />
          <Calendar class="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
        </div>
        <p class="text-xs text-gray-500 mt-1">
          Selecciona la fecha estimada para iniciar el programa
        </p>
      </div>

      <!-- Objetivos Específicos -->
      <div>
        <label for="objetivos" class="block text-sm font-medium text-gray-700 mb-2">
          Objetivos específicos <span class="text-red-500">*</span>
        </label>
        <textarea
          id="objetivos"
          v-model="formData.objetivos"
          required
          rows="4"
          placeholder="Describe los objetivos que esperas alcanzar con este servicio..."
          class="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-4 py-2.5 text-gray-900 resize-none"
        ></textarea>
        <p class="text-xs text-gray-500 mt-1">
          {{ formData.objetivos.length }} / 500 caracteres
        </p>
      </div>

      <!-- Comentarios Adicionales -->
      <div>
        <label for="comentarios" class="block text-sm font-medium text-gray-700 mb-2">
          Comentarios o notas adicionales
        </label>
        <textarea
          id="comentarios"
          v-model="formData.comentarios"
          rows="3"
          placeholder="Agrega cualquier información adicional que consideres relevante..."
          class="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-4 py-2.5 text-gray-900 resize-none"
        ></textarea>
      </div>

      <!-- Estado (readonly) -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Estado inicial
        </label>
        <div class="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
          <Clock class="h-4 w-4 mr-2" />
          Pendiente
        </div>
        <p class="text-xs text-gray-500 mt-1">
          La solicitud se creará en estado "Pendiente" y podrás gestionarla posteriormente
        </p>
      </div>

      <!-- Botones -->
      <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          @click="cancelar"
          class="px-5 py-2.5 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors font-medium"
        >
          Cancelar
        </button>
        <button
          type="submit"
          :disabled="!formularioValido"
          class="px-5 py-2.5 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Save class="h-5 w-5" />
          Guardar solicitud
        </button>
      </div>
    </form>
  </Dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useToast } from 'vue-toastification';
import Dialog from 'primevue/dialog';
import {
  FileCheck,
  Calendar,
  Clock,
  Save
} from 'lucide-vue-next';

// TODO: conectar con tablas "solicitudes_servicios" y "departamentos" en futuras iteraciones.

const toast = useToast();

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  servicio: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['update:visible', 'solicitud-guardada']);

const departamentos = ref([
  'Recursos Humanos',
  'Tecnología',
  'Ventas',
  'Marketing',
  'Operaciones',
  'Finanzas'
]);

const formData = ref({
  departamento: '',
  fecha_implementacion: '',
  objetivos: '',
  comentarios: '',
  estado: 'Pendiente'
});

const fechaMinima = computed(() => {
  const hoy = new Date();
  return hoy.toISOString().split('T')[0];
});

const formularioValido = computed(() => {
  return (
    formData.value.departamento !== '' &&
    formData.value.fecha_implementacion !== '' &&
    formData.value.objetivos.trim().length > 0
  );
});

const resetFormulario = () => {
  formData.value = {
    departamento: '',
    fecha_implementacion: '',
    objetivos: '',
    comentarios: '',
    estado: 'Pendiente'
  };
};

const guardarSolicitud = () => {
  if (!formularioValido.value || !props.servicio) return;

  const nuevaSolicitud = {
    servicio: {
      id: props.servicio.id,
      nombre: props.servicio.nombre,
      icono: props.servicio.icono
    },
    departamento: formData.value.departamento,
    fecha_implementacion: formData.value.fecha_implementacion,
    objetivos: formData.value.objetivos,
    comentarios: formData.value.comentarios,
    estado: formData.value.estado
  };

  // TODO: Save to Supabase solicitudes_servicios table
  console.log('Guardando solicitud:', nuevaSolicitud);

  toast.success('Solicitud registrada correctamente', {
    timeout: 4000
  });

  emit('solicitud-guardada', nuevaSolicitud);
  emit('update:visible', false);
  resetFormulario();
};

const cancelar = () => {
  emit('update:visible', false);
  resetFormulario();
};

watch(() => props.visible, (newVal) => {
  if (!newVal) {
    resetFormulario();
  }
});
</script>

<style scoped>
input[type="date"]::-webkit-calendar-picker-indicator {
  opacity: 0;
  position: absolute;
  width: 100%;
  height: 100%;
  cursor: pointer;
}
</style>
