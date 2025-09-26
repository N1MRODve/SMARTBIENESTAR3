<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header del Empleado -->
    <Header subtitulo="Portal del Empleado" />
    
    <!-- Contenido Principal -->
    <main class="flex-1 overflow-y-auto">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import Header from '@/components/common/Header.vue';
</script>

<style scoped>
/* Estilos específicos del layout del empleado si fueran necesarios */
</style>