// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth.store.js';
import empleadoRoutes from './routes/empleado.routes.js';
import adminRoutes from './routes/admin.routes.js';
import platformRoutes from './routes/platform.routes.js';

// Importar vistas públicas
import LandingPage from '../views/LandingPage.vue';
import SolicitarDemoView from '../views/SolicitarDemoView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import NotFoundView from '../views/NotFoundView.vue';
import AccessDeniedView from '../views/AccessDeniedView.vue';
import PoliticaCookiesView from '../views/PoliticaCookiesView.vue';
import AvisoLegalView from '../views/AvisoLegalView.vue';
import PoliticaPrivacidadView from '../views/PoliticaPrivacidadView.vue';
import ContratoLicenciaView from '../views/ContratoLicenciaView.vue';

// Vistas de autenticación
import VerificacionPendiente from '../views/auth/VerificacionPendiente.vue';
import AuthCallback from '../views/auth/AuthCallback.vue';
import RegistroEmpleadoView from '../views/auth/RegistroEmpleadoView.vue';

// Vistas Admin
import AdminDashboardView from '../views/admin/DashboardView.vue';
import CrearEncuestaView from '../views/admin/CrearEncuestaView.vue';

// Vistas Empleado
import ResponderEncuestaView from '../views/empleado/ResponderEncuestaView.vue';

const routes = [
  // === RUTAS PÚBLICAS (LANDING) ===
  {
    path: '/',
    name: 'landing',
    component: LandingPage,
    meta: { requiresAuth: false, isPublic: true }
  },

  // Solicitar demo - accesible sin autenticación
  {
    path: '/solicitar-demo',
    name: 'solicitar-demo',
    component: SolicitarDemoView,
    meta: { requiresAuth: false, isPublic: true }
  },

  // Login - accesible sin autenticación
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { requiresAuth: false }
  },

  // Register - accesible sin autenticación
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
    meta: { requiresAuth: false }
  },

  // Verificación de email pendiente
  {
    path: '/verificacion-pendiente',
    name: 'verificacion-pendiente',
    component: VerificacionPendiente,
    meta: { requiresAuth: false }
  },

  // Callback de autenticación (verificación de email)
  {
    path: '/auth/callback',
    name: 'auth-callback',
    component: AuthCallback,
    meta: { requiresAuth: false }
  },

  // Registro de empleados (invitación o auto-registro)
  {
    path: '/unirse',
    name: 'unirse',
    component: RegistroEmpleadoView,
    meta: { requiresAuth: false }
  },

  // === RUTAS ADMIN ===
  {
    path: '/admin/dashboard',
    name: 'admin-dashboard',
    component: AdminDashboardView,
    meta: {
      requiresAuth: true,
      roles: ['admin']
    }
  },

  // === RUTAS ADMIN (ANIDADAS) ===
  ...adminRoutes,
  // === RUTAS EMPLEADO (ANIDADAS) ===
  ...empleadoRoutes,
  // === RUTAS PLATFORM (SUPER ADMIN) ===
  ...platformRoutes,

  // === RUTA EMPLEADO LEGACY (MANTENER TEMPORALMENTE) ===
  {
    path: '/empleado/encuesta',
    name: 'empleado-encuesta',
    component: ResponderEncuestaView,
    meta: {
      requiresAuth: true,
      roles: ['empleado']
    }
  },

  // === RUTAS LEGALES (PÚBLICAS) ===
  {
    path: '/politica-cookies',
    name: 'politica-cookies',
    component: PoliticaCookiesView,
    meta: { requiresAuth: false, isPublic: true }
  },
  {
    path: '/aviso-legal',
    name: 'aviso-legal',
    component: AvisoLegalView,
    meta: { requiresAuth: false, isPublic: true }
  },
  {
    path: '/politica-privacidad',
    name: 'politica-privacidad',
    component: PoliticaPrivacidadView,
    meta: { requiresAuth: false, isPublic: true }
  },
  {
    path: '/contrato-licencia',
    name: 'contrato-licencia',
    component: ContratoLicenciaView,
    meta: { requiresAuth: false, isPublic: true }
  },

  // === RUTAS DE ERROR ===
  { 
    path: '/acceso-denegado', 
    name: 'access-denied', 
    component: AccessDeniedView 
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

// Guard de navegación global
router.beforeEach(async (to, from) => {
  const authStore = useAuthStore();

  // Esperamos a que la tienda se inicialice si no lo ha hecho
  if (!authStore.initializationDone) {
    await authStore.initialize();
  }

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiredRoles = to.meta.roles;

  const getRedirectPath = () => {
    const role = authStore.userRole;
    if (['superadmin', 'soporte', 'comercial'].includes(role)) {
      return '/platform/dashboard';
    }
    if (role === 'admin') {
      return '/admin/dashboard';
    }
    return '/empleado/dashboard';
  };

  // Permitir acceso a rutas de callback, verificación y registro de empleados
  if (to.name === 'auth-callback' || to.name === 'verificacion-pendiente' || to.name === 'unirse') {
    return true;
  }

  // Verificar si el email está confirmado para usuarios autenticados
  if (authStore.isAuthenticated && requiresAuth) {
    const emailVerificado = authStore.user?.email_confirmed_at;
    if (!emailVerificado) {
      return { name: 'verificacion-pendiente' };
    }
  }

  if ((to.name === 'login' || to.name === 'register') && authStore.isAuthenticated) {
    // Si está autenticado pero no verificado, ir a verificación
    if (!authStore.user?.email_confirmed_at) {
      return { name: 'verificacion-pendiente' };
    }
    return getRedirectPath();
  }

  if (to.name === 'landing' && authStore.isAuthenticated) {
    // Si está autenticado pero no verificado, ir a verificación
    if (!authStore.user?.email_confirmed_at) {
      return { name: 'verificacion-pendiente' };
    }
    return getRedirectPath();
  }

  // Si la ruta requiere autenticación y el usuario no está autenticado
  if (requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login' };
  }

  // Si la ruta requiere roles específicos y el usuario no tiene el rol adecuado
  if (requiredRoles && authStore.isAuthenticated && !authStore.hasRole(requiredRoles)) {
    return { name: 'access-denied' };
  }

  return true;
});

export default router;