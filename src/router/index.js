// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store.js';
import LoginView from '../views/LoginView.vue';
import NotFoundView from '../views/NotFoundView.vue';

const routes = [
  { 
    path: '/', 
    redirect: '/login' 
  },
  { 
    path: '/login', 
    name: 'login', 
    component: LoginView, 
    meta: { requiresAuth: false } 
  },
  { 
    path: '/:pathMatch(.*)*', 
    name: 'not-found', 
    component: NotFoundView 
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(async (to, from) => {
  const authStore = useAuthStore();

  // Esperamos a que la tienda se inicialice si no lo ha hecho
  if (!authStore.initializationDone) {
    await authStore.initialize();
  }

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  
  if (to.name === 'login' && authStore.isAuthenticated) {
    // Por ahora redirigimos al login hasta que creemos las vistas del MVP
    return { name: 'login' };
  }
  
  if (requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login' };
  }
  
  return true;
});

export default router;