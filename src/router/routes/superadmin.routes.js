import SuperAdminLayout from '../../layouts/SuperAdminLayout.vue';

export const superadminRoutes = [
  {
    path: '/superadmin',
    component: SuperAdminLayout,
    meta: { 
      requiresAuth: true,
      roles: ['superadmin']
    },
    children: [
      {
        path: 'dashboard',
        name: 'superadmin-dashboard',
        component: () => import('../../views/superadmin/DashboardView.vue')
      },
      {
        path: 'empresas',
        name: 'superadmin-empresas',
        component: () => import('../../views/superadmin/EmpresasView.vue')
      },
      {
        path: 'colaboradores',
        name: 'superadmin-colaboradores',
        component: () => import('../../views/superadmin/ColaboradoresView.vue')
      },
      {
        path: 'horarios',
        name: 'superadmin-horarios',
        component: () => import('../../views/superadmin/HorariosDashboard.vue')
      }
    ]
  }
];