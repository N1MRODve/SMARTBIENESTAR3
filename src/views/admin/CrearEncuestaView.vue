<template>
  <div class="space-y-8">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Crear Encuesta</h1>
      <p class="mt-1 text-sm text-gray-500">
        Crea una nueva encuesta de pulso para tus empleados
      </p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  console.log('Crear Encuesta cargado');
});
</script>