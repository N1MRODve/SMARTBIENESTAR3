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
        component: () => import('@/views/admin/EncuestasView.vue'),
      },
      {
        path: 'encuestas/crear',
        name: 'admin-crear-encuesta',
        component: () => import('@/views/admin/CrearEncuestaView.vue'),
      },
      {
        path: 'encuestas/crear',
        name: 'admin-crear-encuesta',
        component: () => import('@/views/admin/CrearEncuestaView.vue'),
      },
      {
        path: 'encuestas/:encuestaId/editar',
        name: 'admin-editar-encuesta',
        component: () => import('@/views/admin/EditarEncuestaView.vue'),
      },
      // --- RUTA AÑADIDA Y CORREGIDA ---
      {
        path: 'encuestas/:encuestaId/resultados',
        name: 'admin-encuesta-resultados',
        component: () => import('@/views/admin/ResultadosEncuestaView.vue'),
      },
      {
        path: 'encuestas/crear',
        name: 'admin-crear-encuesta',
        component: () => import('@/views/admin/CrearEncuestaView.vue'),
      },
      {
        path: 'recompensas',
        name: 'admin-recompensas',
        component: () => import('@/views/admin/GestionRecompensasView.vue')
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
        path: 'encuestas/programadas',
        name: 'admin-encuestas-programadas',
        component: () => import('@/views/admin/ScheduledSurveysView.vue'),
      },
      {
        path: 'encuestas/preview-envio',
        name: 'admin-preview-envio',
        component: () => import('@/views/admin/VistaPreviaEnvio.vue'),
      },
      {
        path: 'participacion',
        name: 'admin-participacion',
        component: () => import('@/views/admin/PanelParticipacion.vue'),
      },
      {
        path: 'configuracion',
        name: 'admin-configuracion',
        component: () => import('@/views/admin/ConfiguracionGlobal.vue'),
      },
      {
        path: 'analitica',
        name: 'admin-analitica',
        component: () => import('@/views/admin/AnaliticaEjecutiva.vue'),
      },
      {
        path: 'presentacion',
        name: 'admin-presentacion',
        component: () => import('@/views/admin/ModoPresentacion.vue'),
      },
      {
        path: 'servicios',
        name: 'admin-servicios',
        component: () => import('@/views/admin/CatalogoServicios.vue'),
      },
      {
        path: 'solicitudes',
        name: 'admin-solicitudes',
        component: () => import('@/views/admin/SolicitudesServicios.vue'),
      },
      {
        path: 'comunicacion',
        name: 'admin-comunicacion',
        component: () => import('@/views/admin/CentroComunicacion.vue'),
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