<template>
  <div class="bg-white shadow-sm rounded-xl p-6 space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-bold text-gray-900">
        {{ comunicadoInicial ? 'Editar comunicado' : 'Crear nuevo comunicado' }}
      </h2>
      <div v-if="comunicadoInicial" class="text-sm text-gray-600">
        Editando: <span class="font-semibold">{{ comunicadoInicial.titulo }}</span>
      </div>
    </div>

    <form @submit.prevent="enviarComunicado" class="space-y-6">
      <!-- Selector de Plantilla -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Seleccionar plantilla
        </label>
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
          <button
            v-for="plantilla in plantillas"
            :key="plantilla.id"
            type="button"
            @click="aplicarPlantilla(plantilla)"
            class="p-4 rounded-lg border-2 transition-all duration-200 hover:border-indigo-300 hover:shadow-md text-center"
            :class="plantillaSeleccionada?.id === plantilla.id
              ? 'border-indigo-600 bg-indigo-50'
              : 'border-gray-200 bg-white'"
          >
            <div class="text-3xl mb-2">{{ plantilla.icono }}</div>
            <div class="text-xs font-medium text-gray-900">{{ plantilla.nombre }}</div>
          </button>
        </div>
      </div>

      <!-- Tipo de Comunicado -->
      <div>
        <label for="tipo" class="block text-sm font-medium text-gray-700 mb-2">
          Tipo de comunicado <span class="text-red-500">*</span>
        </label>
        <select
          id="tipo"
          v-model="formData.tipo"
          required
          class="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-4 py-2.5 text-gray-900"
        >
          <option value="">Selecciona un tipo</option>
          <option value="Plan de mejora">Plan de mejora</option>
          <option value="Felicitación">Felicitación</option>
          <option value="Comunicación General">Comunicación General</option>
          <option value="Resultados">Resultados</option>
          <option value="Acción">Acción</option>
        </select>
      </div>

      <!-- Título -->
      <div>
        <label for="titulo" class="block text-sm font-medium text-gray-700 mb-2">
          Título del comunicado <span class="text-red-500">*</span>
        </label>
        <input
          id="titulo"
          v-model="formData.titulo"
          type="text"
          required
          placeholder="Ej: Plan de Acción Post Clima360"
          class="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-4 py-2.5 text-gray-900"
        />
      </div>

      <!-- Editor de Contenido -->
      <div>
        <label for="contenido" class="block text-sm font-medium text-gray-700 mb-2">
          Contenido <span class="text-red-500">*</span>
        </label>
        <textarea
          id="contenido"
          v-model="formData.contenido"
          required
          rows="8"
          placeholder="Escribe el contenido del comunicado..."
          class="w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-4 py-2.5 text-gray-900 resize-none"
        ></textarea>
        <p class="text-xs text-gray-500 mt-1">
          {{ formData.contenido.length }} caracteres
        </p>
      </div>

      <!-- Destinatarios: Departamentos -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-3">
          Destinatarios - Departamentos <span class="text-red-500">*</span>
        </label>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <label
            v-for="dept in departamentos"
            :key="dept"
            class="flex items-center gap-2 p-3 rounded-lg border-2 transition-all cursor-pointer hover:border-indigo-300"
            :class="formData.destinatarios.includes(dept)
              ? 'border-indigo-600 bg-indigo-50'
              : 'border-gray-200 bg-white'"
          >
            <input
              type="checkbox"
              :value="dept"
              v-model="formData.destinatarios"
              class="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <span class="text-sm font-medium text-gray-900">{{ dept }}</span>
          </label>
        </div>
      </div>

      <!-- Destinatarios: Roles -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-3">
          Destinatarios - Roles <span class="text-red-500">*</span>
        </label>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
          <label
            v-for="rol in roles"
            :key="rol"
            class="flex items-center gap-2 p-3 rounded-lg border-2 transition-all cursor-pointer hover:border-purple-300"
            :class="formData.roles.includes(rol)
              ? 'border-purple-600 bg-purple-50'
              : 'border-gray-200 bg-white'"
          >
            <input
              type="checkbox"
              :value="rol"
              v-model="formData.roles"
              class="rounded text-purple-600 focus:ring-purple-500"
            />
            <span class="text-sm font-medium text-gray-900">{{ rol }}</span>
          </label>
        </div>
      </div>

      <!-- Fecha de Envío -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Fecha de envío
        </label>
        <div class="flex items-center gap-4">
          <label class="flex items-center gap-2">
            <input
              type="radio"
              v-model="tipoEnvio"
              value="inmediato"
              class="text-indigo-600 focus:ring-indigo-500"
            />
            <span class="text-sm font-medium text-gray-900">Enviar inmediatamente</span>
          </label>
          <label class="flex items-center gap-2">
            <input
              type="radio"
              v-model="tipoEnvio"
              value="programado"
              class="text-indigo-600 focus:ring-indigo-500"
            />
            <span class="text-sm font-medium text-gray-900">Programar envío</span>
          </label>
          <label class="flex items-center gap-2">
            <input
              type="radio"
              v-model="tipoEnvio"
              value="borrador"
              class="text-indigo-600 focus:ring-indigo-500"
            />
            <span class="text-sm font-medium text-gray-900">Guardar como borrador</span>
          </label>
        </div>
        <div v-if="tipoEnvio === 'programado'" class="mt-3">
          <input
            type="date"
            v-model="formData.fecha_envio"
            :min="fechaMinima"
            class="rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-4 py-2.5 text-gray-900"
          />
        </div>
      </div>

      <!-- Botones -->
      <div class="flex items-center justify-between pt-4 border-t border-gray-200">
        <button
          type="button"
          @click="vistaPrevia"
          class="flex items-center gap-2 px-5 py-2.5 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors font-medium"
        >
          <Eye class="h-5 w-5" />
          Vista previa
        </button>
        <div class="flex items-center gap-3">
          <button
            v-if="comunicadoInicial"
            type="button"
            @click="$emit('cancelar')"
            class="px-5 py-2.5 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors font-medium"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="!formularioValido"
            class="flex items-center gap-2 px-5 py-2.5 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send class="h-5 w-5" />
            {{ tipoEnvio === 'borrador' ? 'Guardar borrador' : 'Enviar comunicado' }}
          </button>
        </div>
      </div>
    </form>

    <!-- Modal Vista Previa -->
    <Dialog
      v-model:visible="modalPreviaAbierto"
      modal
      :dismissableMask="true"
      :style="{ width: '50rem' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    >
      <template #header>
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
            <Eye class="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h3 class="text-xl font-bold text-gray-900">
              Vista previa del comunicado
            </h3>
            <p class="text-sm text-gray-600">
              Así verán el comunicado los destinatarios
            </p>
          </div>
        </div>
      </template>

      <div class="space-y-6">
        <!-- Encabezado simulado -->
        <div class="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-6 rounded-lg">
          <h2 class="text-2xl font-bold mb-2">{{ formData.titulo }}</h2>
          <p class="text-sm text-indigo-100">{{ formData.tipo }}</p>
        </div>

        <!-- Contenido -->
        <div class="bg-gray-50 p-6 rounded-lg">
          <p class="text-gray-900 whitespace-pre-wrap">{{ formData.contenido }}</p>
        </div>

        <!-- Footer simulado -->
        <div class="bg-gray-100 p-4 rounded-lg text-sm text-gray-600">
          <p class="font-semibold mb-2">Enviado a:</p>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="dept in formData.destinatarios"
              :key="dept"
              class="px-2 py-1 bg-white rounded text-xs"
            >
              {{ dept }}
            </span>
          </div>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useToast } from 'vue-toastification';
import Dialog from 'primevue/dialog';
import { Eye, Send } from 'lucide-vue-next';
import {
  plantillasComunicado,
  departamentosDisponibles,
  rolesDisponibles,
  agregarComunicado,
  actualizarComunicado
} from '@/utils/comunicadosAvanzadosMock.js';

const props = defineProps({
  comunicadoInicial: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['comunicado-creado', 'cancelar']);

const toast = useToast();

const plantillas = ref(plantillasComunicado);
const departamentos = ref(departamentosDisponibles);
const roles = ref(rolesDisponibles);

const plantillaSeleccionada = ref(null);
const tipoEnvio = ref('inmediato');
const modalPreviaAbierto = ref(false);

const formData = ref({
  titulo: '',
  tipo: '',
  contenido: '',
  destinatarios: [],
  roles: [],
  fecha_envio: null,
  estado: 'Enviado'
});

const fechaMinima = computed(() => {
  const hoy = new Date();
  return hoy.toISOString().split('T')[0];
});

const formularioValido = computed(() => {
  return (
    formData.value.titulo.trim() !== '' &&
    formData.value.tipo !== '' &&
    formData.value.contenido.trim() !== '' &&
    formData.value.destinatarios.length > 0 &&
    formData.value.roles.length > 0
  );
});

const aplicarPlantilla = (plantilla) => {
  plantillaSeleccionada.value = plantilla;
  formData.value.contenido = plantilla.cuerpo;
  if (!formData.value.tipo) {
    formData.value.tipo = plantilla.nombre;
  }
};

const vistaPrevia = () => {
  if (!formularioValido.value) {
    toast.warning('Completa todos los campos requeridos para ver la vista previa', {
      timeout: 3000
    });
    return;
  }
  modalPreviaAbierto.value = true;
};

const enviarComunicado = () => {
  if (!formularioValido.value) return;

  let estado = 'Enviado';
  let fechaEnvio = new Date().toISOString().split('T')[0];

  if (tipoEnvio.value === 'borrador') {
    estado = 'Borrador';
    fechaEnvio = null;
  } else if (tipoEnvio.value === 'programado') {
    estado = 'Programado';
    fechaEnvio = formData.value.fecha_envio;
  }

  const comunicado = {
    ...formData.value,
    estado,
    fecha_envio: fechaEnvio
  };

  if (props.comunicadoInicial) {
    actualizarComunicado(props.comunicadoInicial.id, comunicado);
  } else {
    agregarComunicado(comunicado);
  }

  const numDestinatarios = formData.value.destinatarios.length;

  if (estado === 'Enviado') {
    toast.success(`Comunicado enviado correctamente a ${numDestinatarios} departamento${numDestinatarios !== 1 ? 's' : ''}`, {
      timeout: 4000
    });
  } else if (estado === 'Programado') {
    toast.info(`Comunicado programado para ${fechaEnvio}`, {
      timeout: 4000
    });
  } else {
    toast.success('Comunicado guardado como borrador', {
      timeout: 3000
    });
  }

  resetFormulario();
  emit('comunicado-creado');
};

const resetFormulario = () => {
  formData.value = {
    titulo: '',
    tipo: '',
    contenido: '',
    destinatarios: [],
    roles: [],
    fecha_envio: null,
    estado: 'Enviado'
  };
  plantillaSeleccionada.value = null;
  tipoEnvio.value = 'inmediato';
};

watch(() => props.comunicadoInicial, (nuevo) => {
  if (nuevo) {
    formData.value = {
      titulo: nuevo.titulo,
      tipo: nuevo.tipo,
      contenido: nuevo.contenido,
      destinatarios: [...nuevo.destinatarios],
      roles: [...nuevo.roles],
      fecha_envio: nuevo.fecha_envio,
      estado: nuevo.estado
    };

    if (nuevo.estado === 'Borrador') {
      tipoEnvio.value = 'borrador';
    } else if (nuevo.estado === 'Programado') {
      tipoEnvio.value = 'programado';
    } else {
      tipoEnvio.value = 'inmediato';
    }
  } else {
    resetFormulario();
  }
}, { immediate: true });
</script>
