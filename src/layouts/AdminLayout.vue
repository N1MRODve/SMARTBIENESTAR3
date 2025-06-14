<script setup>
import { ref } from 'vue';
import { RouterView } from 'vue-router';
import TheSidebar from '@/layouts/TheSidebar.vue';
import TheHeader from '@/layouts/TheHeader.vue';

const isSidebarOpen = ref(false);
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <TheSidebar :open="isSidebarOpen" @update:open="isSidebarOpen = $event" />

    <div class="lg:ml-64 flex flex-col min-h-screen">
      <TheHeader @toggle-sidebar="isSidebarOpen = !isSidebarOpen" />
      
      <main class="flex-1 overflow-y-auto">
        <RouterView />
      </main>
    </div>
  </div>
</template>