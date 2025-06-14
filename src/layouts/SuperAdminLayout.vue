<template>
  <div class="dashboard-layout">
    <TheSidebar v-model:open="sidebarOpen" />
    
    <div class="main-content">
      <TheHeader @toggle-sidebar="sidebarOpen = !sidebarOpen" />
      
      <main class="flex-1 p-6 overflow-y-auto bg-gray-50">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import TheSidebar from '../layouts/TheSidebar.vue';
import TheHeader from '../layouts/TheHeader.vue';

const sidebarOpen = ref(false);
</script>