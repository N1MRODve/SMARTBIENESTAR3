<template>
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
  <Toast />
</template>

<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from './stores/auth.store';
import Toast from 'primevue/toast';

const authStore = useAuthStore();

onMounted(async () => {
  await authStore.initialize();
});
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>