// src/stores/auth.store.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { login as mockLogin } from '@/services/mock/auth.service';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const loading = ref(true);
  const initializationDone = ref(false);

  const isAuthenticated = computed(() => !!user.value);
  const userRole = computed(() => user.value?.role);

  const initialize = async () => {
    if (initializationDone.value) return;
    
    try {
      // Verificar si hay una sesión guardada en localStorage
      const savedUser = localStorage.getItem('mockUser');
      if (savedUser) {
        user.value = JSON.parse(savedUser);
      }
    } catch (e) {
      console.error('Error initializing auth:', e);
      user.value = null;
    } finally {
      loading.value = false;
      initializationDone.value = true;
    }
  };

  const login = async (email, password) => {
    loading.value = true;
    
    try {
      // Usar el servicio mock para autenticación
      const response = await mockLogin(email, password);
      
      // Extraer el usuario de la respuesta
      user.value = response.user;
      
      // Guardar la sesión en localStorage
      localStorage.setItem('mockUser', JSON.stringify(response.user));
      
      loading.value = false;
      return response.user.role;
    } catch (error) {
      loading.value = false;
      throw error;
    }
  };

  const logout = async () => {
    // Limpiar localStorage
    localStorage.removeItem('mockUser');
    // Resetear estado de autenticación
    user.value = null;
    loading.value = false;
    console.log('Usuario deslogueado correctamente');
  };

  const hasRole = (roles) => {
    if (!userRole.value) return false;
    return Array.isArray(roles) ? roles.includes(userRole.value) : userRole.value === roles;
  };

  return {
    user,
    loading,
    initializationDone,
    isAuthenticated,
    userRole,
    initialize,
    login,
    logout,
    hasRole
  };
});