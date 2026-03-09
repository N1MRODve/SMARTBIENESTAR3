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

      <!-- Destino: Toda la empresa o departamentos -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-3">
          Destino del servicio <span class="text-red-500">*</span>
        </label>

        <!-- Toggle Toda la empresa -->
        <div class="mb-4">
          <label class="flex items-center gap-3 p-3 bg-indigo-50 rounded-lg cursor-pointer hover:bg-indigo-100 transition-colors">
            <input
              type="checkbox"
              v-model="formData.todaEmpresa"
              class="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <div>
              <span class="font-medium text-gray-900">Toda la empresa</span>
              <p class="text-xs text-gray-600">El servicio aplicará a todos los departamentos</p>
            </div>
          </label>
        </div>

        <!-- Lista de departamentos (solo si no es toda la empresa) -->
        <div v-if="!formData.todaEmpresa" class="space-y-2">
          <p class="text-sm text-gray-600 mb-2">Selecciona uno o más departamentos:</p>

          <div v-if="cargandoDepartamentos" class="flex items-center justify-center py-4">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
            <span class="ml-2 text-sm text-gray-600">Cargando departamentos...</span>
          </div>

          <div v-else-if="departamentos.length === 0" class="text-center py-4 text-gray-500">
            No hay departamentos configurados en tu empresa
          </div>

          <div v-else class="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1">
            <label
              v-for="dept in departamentos"
              :key="dept.id"
              class="flex items-center gap-2 p-2.5 border rounded-lg cursor-pointer transition-colors"
              :class="formData.departamentosSeleccionados.includes(dept.id)
                ? 'bg-indigo-50 border-indigo-300'
                : 'bg-white border-gray-200 hover:border-indigo-200'"
            >
              <input
                type="checkbox"
                :value="dept.id"
                v-model="formData.departamentosSeleccionados"
                class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span class="text-sm text-gray-900">{{ dept.nombre }}</span>
            </label>
          </div>

          <p v-if="formData.departamentosSeleccionados.length > 0" class="text-xs text-indigo-600 mt-2">
            {{ formData.departamentosSeleccionados.length }} departamento(s) seleccionado(s)
          </p>
        </div>
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
          :disabled="!formularioValido || guardando"
          class="px-5 py-2.5 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <span v-if="guardando" class="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
          <Save v-else class="h-5 w-5" />
          {{ guardando ? 'Guardando...' : 'Guardar solicitud' }}
        </button>
      </div>
    </form>
  </Dialog>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import Dialog from 'primevue/dialog';
import {
  FileCheck,
  Calendar,
  Clock,
  Save
} from 'lucide-vue-next';
import { solicitudesService } from '@/services/solicitudes.service';
import { useAuthStore } from '@/stores/auth.store';

const toast = useToast();
const authStore = useAuthStore();

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

// Departamentos cargados desde BD
const departamentos = ref([]);
const cargandoDepartamentos = ref(false);
const guardando = ref(false);

const formData = ref({
  todaEmpresa: false,
  departamentosSeleccionados: [],
  fecha_implementacion: '',
  objetivos: '',
  comentarios: '',
  estado: 'pendiente'
});

// Cargar departamentos al montar o cuando cambia visible
const cargarDepartamentos = async () => {
  if (!authStore.empresaId) return;

  cargandoDepartamentos.value = true;
  try {
    departamentos.value = await solicitudesService.getDepartamentos(authStore.empresaId);
  } catch (error) {
    console.error('Error cargando departamentos:', error);
    toast.error('Error al cargar los departamentos');
  } finally {
    cargandoDepartamentos.value = false;
  }
};

onMounted(() => {
  if (props.visible) {
    cargarDepartamentos();
  }
});

const fechaMinima = computed(() => {
  const hoy = new Date();
  return hoy.toISOString().split('T')[0];
});

const formularioValido = computed(() => {
  const tieneDestino = formData.value.todaEmpresa || formData.value.departamentosSeleccionados.length > 0;
  return (
    tieneDestino &&
    formData.value.fecha_implementacion !== '' &&
    formData.value.objetivos.trim().length > 0
  );
});

const resetFormulario = () => {
  formData.value = {
    todaEmpresa: false,
    departamentosSeleccionados: [],
    fecha_implementacion: '',
    objetivos: '',
    comentarios: '',
    estado: 'pendiente'
  };
};

const guardarSolicitud = async () => {
  if (!formularioValido.value || !props.servicio) return;

  guardando.value = true;

  try {
    const solicitud = await solicitudesService.crearConDestinatarios({
      empleado_id: authStore.empleado?.id,
      empresa_id: authStore.empresaId,
      servicio_nombre: props.servicio.nombre,
      servicio_categoria: props.servicio.categoria,
      objetivos: formData.value.objetivos,
      comentarios: formData.value.comentarios,
      fecha_implementacion: formData.value.fecha_implementacion,
      todaEmpresa: formData.value.todaEmpresa,
      departamentos: formData.value.departamentosSeleccionados
    });

    toast.success('Solicitud registrada correctamente', {
      timeout: 4000
    });

    emit('solicitud-guardada', solicitud);
    emit('update:visible', false);
    resetFormulario();
  } catch (error) {
    console.error('Error guardando solicitud:', error);
    toast.error('Error al guardar la solicitud. Intenta de nuevo.');
  } finally {
    guardando.value = false;
  }
};

const cancelar = () => {
  emit('update:visible', false);
  resetFormulario();
};

watch(() => props.visible, (newVal) => {
  if (newVal) {
    cargarDepartamentos();
  } else {
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
