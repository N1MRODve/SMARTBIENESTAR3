import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authService } from '@/services/auth.service';
import { FITCORP_MOCK_DATA } from '@/services/mockData';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const empleado = ref(null);
  const session = ref(null);
  const loading = ref(true);
  const initializationDone = ref(false);
  const authListenerSetup = ref(false);
  const isDemoMode = ref(false);

  const isAuthenticated = computed(() => !!user.value && (!!session.value || isDemoMode.value));
  const empresaId = computed(() => {
    if (isDemoMode.value) return FITCORP_MOCK_DATA.empresa.id;
    return empleado.value?.empresa_id || null;
  });
  const isAdmin = computed(() => {
    if (isDemoMode.value) return true;
    return empleado.value?.es_admin || false;
  });
  const userRole = computed(() => {
    if (!empleado.value && !isDemoMode.value) return null;
    if (isDemoMode.value) return 'admin';
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
      if (email === 'demo@fitcorp.com') {
        isDemoMode.value = true;
        user.value = {
          id: 'demo-user-001',
          email: 'demo@fitcorp.com',
          name: 'Admin Demo'
        };
        empleado.value = {
          id: 'demo-admin-001',
          nombre: 'Admin',
          apellidos: 'Demo FitCorp',
          email: 'demo@fitcorp.com',
          empresa_id: FITCORP_MOCK_DATA.empresa.id,
          es_admin: true,
          cargo: 'Administrador'
        };
        session.value = { access_token: 'demo-token' };
        loading.value = false;
        return 'admin';
      }

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
      if (isDemoMode.value) {
        isDemoMode.value = false;
        user.value = null;
        empleado.value = null;
        session.value = null;
        loading.value = false;
        return;
      }

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
    isDemoMode,
    initialize,
    login,
    logout,
    hasRole
  };
});
