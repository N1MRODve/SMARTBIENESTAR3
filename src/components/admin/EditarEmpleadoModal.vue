<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
      <h2 class="text-2xl font-bold mb-4 text-gray-800">Editar Empleado</h2>

      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Nombre
          </label>
          <input
            v-model="formData.nombre"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            v-model="formData.email"
            type="email"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Departamento
          </label>
          <select
            v-model="formData.departamento_id"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
          >
            <option value="">Seleccionar departamento</option>
            <option
              v-for="dept in departamentos"
              :key="dept.id"
              :value="dept.id"
            >
              {{ dept.nombre }}
            </option>
          </select>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Cargo
          </label>
          <input
            v-model="formData.cargo"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Estado
          </label>
          <select
            v-model="formData.estado"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
          >
            <option value="Activo">Activo</option>
            <option value="Invitado">Invitado</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>

        <div class="flex justify-end gap-3">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  empleado: {
    type: Object,
    required: true
  },
  departamentos: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['close', 'submit']);

const formData = ref({
  nombre: '',
  email: '',
  departamento_id: '',
  cargo: '',
  estado: 'Activo'
});

onMounted(() => {
  // Copiar todos los datos del empleado
  formData.value = {
    nombre: props.empleado.nombre,
    email: props.empleado.email,
    departamento_id: props.empleado.departamento_id,
    cargo: props.empleado.cargo || '',
    estado: props.empleado.estado || 'Activo'
  };
});

const handleSubmit = () => {
  emit('submit', formData.value);
};
</script>
