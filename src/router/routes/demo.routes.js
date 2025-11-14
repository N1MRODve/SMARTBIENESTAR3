import DemoLayout from '@/layouts/DemoLayout.vue';

// Importar vistas admin (las usaremos en modo demo)
import DashboardView from '@/views/admin/DashboardView.vue';
import EmpleadosView from '@/views/admin/EmpleadosView.vue';
import CentroComunicacion from '@/views/admin/CentroComunicacion.vue';
import EncuestasView from '@/views/admin/EncuestasView.vue';
import GestionRecompensasView from '@/views/admin/GestionRecompensasView.vue';
import AnaliticaEjecutiva from '@/views/admin/AnaliticaEjecutiva.vue';
import HistorialCanjesView from '@/views/admin/HistorialCanjesView.vue';
import CrearComunicadoView from '@/views/admin/CrearComunicadoView.vue';
import CrearEncuestaView from '@/views/admin/CrearEncuestaView.vue';
import EditarEncuestaView from '@/views/admin/EditarEncuestaView.vue';
import ResultadosEncuestaView from '@/views/admin/ResultadosEncuestaView.vue';

const demoRoutes = [
  {
    path: '/demo',
    component: DemoLayout,
    meta: { requiresDemo: true },
    children: [
      {
        path: '',
        redirect: '/demo/dashboard'
      },
      {
        path: 'dashboard',
        name: 'demo-dashboard',
        component: DashboardView,
        meta: { requiresDemo: true }
      },
      {
        path: 'empleados',
        name: 'demo-empleados',
        component: EmpleadosView,
        meta: { requiresDemo: true }
      },
      {
        path: 'comunicacion',
        name: 'demo-comunicacion',
        component: CentroComunicacion,
        meta: { requiresDemo: true }
      },
      {
        path: 'comunicacion/crear',
        name: 'demo-comunicacion-crear',
        component: CrearComunicadoView,
        meta: { requiresDemo: true }
      },
      {
        path: 'encuestas',
        name: 'demo-encuestas',
        component: EncuestasView,
        meta: { requiresDemo: true }
      },
      {
        path: 'encuestas/crear',
        name: 'demo-encuestas-crear',
        component: CrearEncuestaView,
        meta: { requiresDemo: true }
      },
      {
        path: 'encuestas/:id/editar',
        name: 'demo-encuestas-editar',
        component: EditarEncuestaView,
        meta: { requiresDemo: true }
      },
      {
        path: 'encuestas/:id/resultados',
        name: 'demo-encuestas-resultados',
        component: ResultadosEncuestaView,
        meta: { requiresDemo: true }
      },
      {
        path: 'recompensas',
        name: 'demo-recompensas',
        component: GestionRecompensasView,
        meta: { requiresDemo: true }
      },
      {
        path: 'recompensas/historial',
        name: 'demo-recompensas-historial',
        component: HistorialCanjesView,
        meta: { requiresDemo: true }
      },
      {
        path: 'analitica',
        name: 'demo-analitica',
        component: AnaliticaEjecutiva,
        meta: { requiresDemo: true }
      }
    ]
  }
];

export default demoRoutes;
