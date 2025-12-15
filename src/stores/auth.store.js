import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authService } from '@/services/auth.service';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const empleado = ref(null);
  const session = ref(null);
  const loading = ref(true);
  const initializationDone = ref(false);
  const authListenerSetup = ref(false);

  const isAuthenticated = computed(() => !!user.value && !!session.value);
  const empresaId = computed(() => empleado.value?.empresa_id || null);
  const isAdmin = computed(() => empleado.value?.es_admin || false);
  const userRole = computed(() => {
    if (!empleado.value) return null;
    return empleado.value.es_admin ? 'admin' : 'empleado';
  });

  const setupAuthListener = () => {
    if (authListenerSetup.value) return;

    authService.onAuthStateChange(async (event, newSession) => {
      console.log('Auth state changed:', event);

      if (event === 'SIGNED_IN' && newSession) {
        try {
          const currentUser = await authService.getCurrentUser();
          if (currentUser) {
            user.value = currentUser.user;
            empleado.value = currentUser.empleado;
            session.value = newSession;
          }
        } catch (error) {
          console.error('Error updating user on auth change:', error);
        }
      } else if (event === 'SIGNED_OUT') {
        user.value = null;
        empleado.value = null;
        session.value = null;
      }
    });

    authListenerSetup.value = true;
  };

  const initialize = async () => {
    if (initializationDone.value) return;

    loading.value = true;
    try {
      const currentSession = await authService.getSession();

      if (currentSession) {
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          user.value = currentUser.user;
          empleado.value = currentUser.empleado;
          session.value = currentSession;
        }
      }

      setupAuthListener();
    } catch (e) {
      console.error('Error initializing auth:', e);
      user.value = null;
      empleado.value = null;
      session.value = null;
    } finally {
      loading.value = false;
      initializationDone.value = true;
    }
  };

  const login = async (email, password) => {
    loading.value = true;

    try {
      const response = await authService.signIn(email, password);

      user.value = response.user;
      empleado.value = response.empleado;
      session.value = response.session;

      loading.value = false;
      return userRole.value;
    } catch (error) {
      loading.value = false;
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.signOut();
      user.value = null;
      empleado.value = null;
      session.value = null;
      loading.value = false;
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  };

  const hasRole = (roles) => {
    if (!userRole.value) return false;
    return Array.isArray(roles) ? roles.includes(userRole.value) : userRole.value === roles;
  };

  return {
    user,
    empleado,
    session,
    loading,
    initializationDone,
    isAuthenticated,
    empresaId,
    isAdmin,
    userRole,
    initialize,
    login,
    logout,
    hasRole
  };
});
