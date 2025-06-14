import { ref, computed } from 'vue';
import { useAuthStore } from '../stores/auth.store';

export function useAuth() {
  const authStore = useAuthStore();
  
  const user = computed(() => authStore.user);
  const isAuthenticated = computed(() => authStore.isAuthenticated);
  const userRole = computed(() => authStore.userRole);
  
  return {
    user,
    isAuthenticated,
    userRole
  };
}