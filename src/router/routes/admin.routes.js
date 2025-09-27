import AdminLayout from '@/layouts/AdminLayout.vue';

const adminRoutes = [
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, role: 'administrador' },
    children: [
      {
        path: 'dashboard',
        name: 'admin-dashboard',
        component: () => import('@/views/admin/DashboardView.vue'),
      },
      {
        path: 'empleados',
        name: 'admin-empleados',
        component: () => import('@/views/admin/EmpleadosView.vue'),
      },
      {
        path: 'encuestas',
        name: 'admin-encuestas',
        component: () => import('@/views/admin/GestionEncuestasView.vue'), 
      },
      // --- RUTA AÑADIDA Y CORREGIDA ---
      {
        path: 'encuestas/:encuestaId/resultados',
        name: 'admin-encuesta-resultados',
        component: () => import('@/views/admin/ResultadosEncuestaView.vue'),
      },
      {
        path: 'recompensas',
        name: 'admin-recompensas',
        component: () => import('@/views/admin/GestionRecompensasView.vue'),
      },
      {
        path: 'recompensas/historial',
        name: 'admin-historial-canjes',
        component: () => import('@/views/admin/HistorialCanjesView.vue'),
      },
      {
        path: 'comunicados',
        name: 'admin-comunicados',
        component: () => import('@/views/admin/GestionComunicadosView.vue'),
      },
      {
        path: 'encuestas/crear',
        name: 'admin-crear-encuesta',
        component: () => import('@/views/admin/CrearEncuestaView.vue'),
      },
      {
        path: 'comunicados/crear',
        name: 'admin-crear-comunicado',
        component: () => import('@/views/admin/CrearComunicadoView.vue'),
      },
      {
        path: 'servicios',
        name: 'admin-servicios',
        component: () => import('@/views/admin/GestionServiciosView.vue'),
      },
      {
        path: 'servicios/:id',
        name: 'admin-servicio-detalle',
        component: () => import('@/views/admin/ServicioDetalleView.vue'),
      },
      {
        path: 'encuestas/crear',
        name: 'admin-crear-encuesta',
        component: () => import('@/views/admin/CrearEncuestaView.vue'),
      },
      {
        path: 'comunicados/crear',
        name: 'admin-crear-comunicado',
        component: () => import('@/views/admin/CrearComunicadoView.vue'),
      },
      // Redirección por defecto al dashboard si solo se entra a /admin
      {
        path: '',
        redirect: '/admin/dashboard'
      }
    ]
  }
];

export default adminRoutes;