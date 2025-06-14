// src/router/routes/admin.routes.js
// NO importamos AdminLayout aquí arriba

export const adminRoutes = [
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'), // Se carga de forma asíncrona
    meta: { 
      requiresAuth: true,
      roles: ['administrador']
    },
    redirect: '/admin/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('@/views/admin/AdminDashboard.vue'),
        meta: { 
          title: 'Dashboard',
          showInSidebar: true,
          icon: 'LayoutDashboardIcon'
        }
      },
      {
        path: 'empleados',
        name: 'AdminEmpleados',
        component: () => import('@/views/admin/EmpleadosView.vue'),
        meta: { 
          title: 'Empleados',
          showInSidebar: true,
          icon: 'UsersIcon'
        }
      },
      {
        path: 'servicios',
        name: 'AdminServicios',
        component: () => import('@/views/admin/ServiciosView.vue'),
        meta: { 
          title: 'Servicios',
          showInSidebar: true,
          icon: 'SparklesIcon'
        }
      },
      {
        path: 'encuestas',
        name: 'AdminEncuestas',
        component: () => import('@/views/admin/EncuestasView.vue'),
        meta: { 
          title: 'Encuestas',
          showInSidebar: true,
          icon: 'ClipboardListIcon'
        }
      },
      {
        path: 'encuestas/nueva', // La URL será /admin/encuestas/nueva
        name: 'AdminCrearEncuesta',
        component: () => import('@/views/admin/CrearEncuestaView.vue'),
        meta: { 
          title: 'Crear Nueva Encuesta',
          parent: 'AdminEncuestas' // Útil para los breadcrumbs (migas de pan)
        }
      },
      {
        path: 'encuestas/:id/resultados',
        name: 'AdminResultadosEncuesta',
        component: () => import('@/views/admin/ResultadosEncuestaView.vue'),
        meta: { 
          title: 'Resultados de Encuesta',
          parent: 'AdminEncuestas'
        },
        props: true
      }
    ]
  }
];