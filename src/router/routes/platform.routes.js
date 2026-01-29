import PlatformLayout from '@/layouts/PlatformLayout.vue';

const platformRoutes = [
  {
    path: '/platform',
    component: PlatformLayout,
    meta: { requiresAuth: true, roles: ['superadmin', 'soporte', 'comercial'] },
    children: [
      {
        path: 'dashboard',
        name: 'platform-dashboard',
        component: () => import('@/views/platform/DashboardView.vue'),
        meta: { title: 'Dashboard' }
      },
      {
        path: 'empresas',
        name: 'platform-empresas',
        component: () => import('@/views/platform/EmpresasView.vue'),
        meta: { title: 'Empresas' }
      },
      {
        path: 'empresas/:empresaId',
        name: 'platform-empresa-detalle',
        component: () => import('@/views/platform/EmpresaDetalleView.vue'),
        meta: { title: 'Detalle Empresa' }
      },
      {
        path: 'solicitudes',
        name: 'platform-solicitudes',
        component: () => import('@/views/platform/SolicitudesGlobalView.vue'),
        meta: { title: 'Solicitudes de Servicios' }
      },
      {
        path: 'usuarios',
        name: 'platform-usuarios',
        component: () => import('@/views/platform/UsuariosPlataformaView.vue'),
        meta: { title: 'Usuarios Plataforma', roles: ['superadmin'] }
      },
      {
        path: 'configuracion',
        name: 'platform-configuracion',
        component: () => import('@/views/platform/ConfiguracionView.vue'),
        meta: { title: 'Configuracion', roles: ['superadmin'] }
      },
      {
        path: '',
        redirect: '/platform/dashboard'
      }
    ]
  }
];

export default platformRoutes;
