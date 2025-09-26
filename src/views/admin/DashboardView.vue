<template>
  <div class="space-y-8">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Dashboard Administrador</h1>
      <p class="mt-1 text-sm text-gray-500">
        Vista general de su empresa
      </p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  console.log('Dashboard Admin cargado');
});
</script>