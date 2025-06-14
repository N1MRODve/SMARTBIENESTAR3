<template>
  <slot v-if="canAccess" />
  <router-view v-else name="unauthorized" />
</template>

<script setup>
import { computed } from 'vue';
import { useAuth } from '../../composables/useAuth';

const props = defineProps({
  roles: {
    type: Array,
    default: () => []
  }
});

const { isAuthenticated, userRole } = useAuth();

const canAccess = computed(() => {
  if (!isAuthenticated.value) return false;
  if (!props.roles.length) return true;
  return props.roles.includes(userRole.value);
});
</script>