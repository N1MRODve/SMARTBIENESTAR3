<script setup>
import { ref, computed, onMounted } from 'vue';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/auth.store';

const props = defineProps({
  departamentos: {
    type: Array,
    default: () => []
  }
});

// Define los eventos que este componente puede emitir hacia su padre
const emit = defineEmits(['close', 'submit']);

const authStore = useAuthStore();

// Variables reactivas
const emails = ref('');
const departamentoId = ref('');
const departamentosList = ref([]);
const mostrarErrorDepartamento = ref(false);

// Validación: el formulario es válido solo si hay departamento seleccionado y emails
const formularioValido = computed(() => {
  const tieneEmails = emails.value.trim().length > 0;
  const tieneDepartamento = departamentoId.value !== '';
  return tieneEmails && tieneDepartamento;
});

// Cargar departamentos de la BD
const cargarDepartamentos = async () => {
  // Si se pasaron por props, usar esos
  if (props.departamentos && props.departamentos.length > 0) {
    departamentosList.value = props.departamentos;
    return;
  }

  // Si no, cargar de la BD
  try {
    const { data, error } = await supabase
      .from('departamentos')
      .select('id, nombre')
      .eq('empresa_id', authStore.empresaId)
      .order('nombre');

    if (error) throw error;
    departamentosList.value = data || [];
  } catch (error) {
    console.error('Error cargando departamentos:', error);
    departamentosList.value = [];
  }
};

const handleSubmit = () => {
  // Validar departamento obligatorio
  if (!departamentoId.value) {
    mostrarErrorDepartamento.value = true;
    return;
  }

  // Procesa los emails: divide por comas o saltos de línea y limpia espacios
  const emailList = emails.value
    .split(/[\n,]+/)
    .map(email => email.trim().toLowerCase())
    .filter(email => email && email.includes('@'));

  if (emailList.length === 0) {
    return;
  }

  // Obtener nombre del departamento seleccionado
  const deptSeleccionado = departamentosList.value.find(d => d.id === departamentoId.value);

  // Crear objetos de empleados con departamento obligatorio
  const empleados = emailList.map(email => {
    const nombreFromEmail = email.split('@')[0]
      .replace(/[._-]/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

    return {
      email,
      nombre: nombreFromEmail,
      departamento_id: departamentoId.value,
      departamento: deptSeleccionado?.nombre || null,
      cargo: ''
    };
  });

  emit('submit', empleados);
};

// Limpiar error cuando se selecciona departamento
const onDepartamentoChange = () => {
  if (departamentoId.value) {
    mostrarErrorDepartamento.value = false;
  }
};

onMounted(() => {
  cargarDepartamentos();
});
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 z-40" @click="$emit('close')"></div>

  <div class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
      <div class="border-b p-4 flex justify-between items-center">
        <h2 class="text-xl font-semibold">Invitar Nuevos Empleados</h2>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-800">&times;</button>
      </div>

      <div class="p-6">
        <div class="mb-4">
          <label for="departamento" class="block text-sm font-medium text-gray-700 mb-2">
            Departamento <span class="text-red-500">*</span>
          </label>
          <select
            id="departamento"
            v-model="departamentoId"
            @change="onDepartamentoChange"
            required
            class="w-full px-3 py-2 border rounded-md focus:ring-primary focus:border-primary"
            :class="mostrarErrorDepartamento ? 'border-red-500 bg-red-50' : 'border-gray-300'"
          >
            <option value="" disabled>Seleccionar departamento</option>
            <option
              v-for="dept in departamentosList"
              :key="dept.id"
              :value="dept.id"
            >
              {{ dept.nombre }}
            </option>
          </select>
          <p v-if="mostrarErrorDepartamento" class="text-xs text-red-600 mt-1">
            El departamento es obligatorio para invitar empleados
          </p>
          <p v-else-if="departamentosList.length === 0" class="text-xs text-amber-600 mt-1">
            No hay departamentos creados. Debes crear al menos uno primero.
          </p>
        </div>

        <div>
          <label for="emails" class="block text-sm font-medium text-gray-700 mb-2">
            Correos Electrónicos
          </label>
          <p class="text-sm text-gray-500 mb-4">
            Introduce uno o varios correos electrónicos, separados por comas o saltos de línea.
          </p>
          <textarea
            id="emails"
            v-model="emails"
            rows="5"
            placeholder="empleado1@empresa.com, empleado2@empresa.com"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
          ></textarea>
        </div>
      </div>

      <div class="bg-gray-50 p-4 flex justify-end space-x-4">
        <button @click="$emit('close')" class="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-md hover:bg-gray-300 transition-colors">
          Cancelar
        </button>
        <button
          @click="handleSubmit"
          :disabled="departamentosList.length === 0"
          class="bg-primary text-white font-bold py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          :class="departamentosList.length > 0 ? 'hover:bg-primary-dark' : ''"
        >
          Enviar Invitaciones
        </button>
      </div>
    </div>
  </div>
</template>
