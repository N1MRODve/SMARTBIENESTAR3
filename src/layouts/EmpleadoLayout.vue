```vue
<template>
  <div class="min-h-screen bg-gray-50">
    <TheSidebar v-model:open="sidebarOpen" />
    
    <div class="lg:ml-64 flex flex-col min-h-screen">
      <TheHeader @toggle-sidebar="sidebarOpen = !sidebarOpen" />
      
      <main class="flex-1 p-6">
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
```