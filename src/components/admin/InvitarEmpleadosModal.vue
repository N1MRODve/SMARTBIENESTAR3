<script setup>
import { ref } from 'vue';

// Define los eventos que este componente puede emitir hacia su padre
const emit = defineEmits(['close', 'submit']);

// Variable reactiva para almacenar los correos del textarea
const emails = ref('');

const handleSubmit = () => {
  // Procesa los emails: divide por comas o saltos de línea y limpia espacios
  const emailList = emails.value
    .split(/[\n,]+/)
    .map(email => email.trim())
    .filter(email => email); // Filtra cadenas vacías

  if (emailList.length > 0) {
    emit('submit', emailList); // Emite el evento con la lista de correos
  }
};
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

      <div class="bg-gray-50 p-4 flex justify-end space-x-4">
        <button @click="$emit('close')" class="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-md hover:bg-gray-300 transition-colors">
          Cancelar
        </button>
        <button @click="handleSubmit" class="bg-primary text-white font-bold py-2 px-4 rounded-md hover:bg-primary-dark transition-colors">
          Enviar Invitaciones
        </button>
      </div>
    </div>
  </div>
</template>