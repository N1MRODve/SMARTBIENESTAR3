<script setup>
import { onMounted, computed } from 'vue';
import { useAdminStore } from '@/stores/admin';
import { useAuthStore } from '@/stores/auth.store';
import StatsCard from '@/components/ui/StatsCard.vue'; // <-- Usamos el nuevo componente
import PageLoader from '@/components/ui/PageLoader.vue';

// Íconos que usaremos en las tarjetas
import { Users, UserCheck, TrendingUp, BarChart3 } from 'lucide-vue-next';

const authStore = useAuthStore();
const adminStore = useAdminStore();

onMounted(() => {
  if (authStore.user && authStore.user.empresa_id) {
    adminStore.loadDashboardStats(authStore.user.empresa_id);
  }
});

// --- Explicación de 'computed' ---
// Una propiedad "computed" en Vue es un dato que se calcula a partir de otros.
// Es "inteligente": solo se recalcula si uno de los datos de los que depende (como adminStore.dashboardStats) cambia.
// Aquí la usamos para crear una lista de tarjetas de forma limpia.
const dashboardCards = computed(() => {
  const stats = adminStore.dashboardStats;
  if (!stats) return [];
  
  return [
    {
      title: 'Total de Empleados',
      value: stats.total_empleados,
      icon: Users,
      colorClass: 'text-blue-600',
      bgColorClass: 'bg-blue-100',
      actionText: 'Gestionar empleados',
      actionTo: '/admin/empleados' // Ruta ya existente
    },
    {
      title: 'Empleados Activos',
      value: stats.empleados_activos,
      icon: UserCheck,
      colorClass: 'text-green-600',
      bgColorClass: 'bg-green-100',
      actionText: 'Ver activos', // Podría llevar a la misma página, quizás con un filtro
      actionTo: '/admin/empleados'
    },
    {
      title: 'Participación Promedio',
      value: `${stats.participacion_promedio.toFixed(1)}%`,
      icon: TrendingUp,
      colorClass: 'text-indigo-600',
      bgColorClass: 'bg-indigo-100',
      actionText: 'Ver servicios',
      actionTo: '/admin/servicios' // Ruta ya existente
    },
    {
      title: 'Encuestas Activas',
      value: stats.encuestas_activas,
      icon: BarChart3,
      colorClass: 'text-purple-600',
      bgColorClass: 'bg-purple-100',
      actionText: 'Gestionar encuestas',
      actionTo: '/admin/encuestas' // ¡Ojo! Esta ruta aún no la hemos creado.
    }
  ];
});
</script>

<template>
  <div class="p-6 space-y-8">
    <div>
      <h1 class="text-3xl font-bold text-gray-900">
        Dashboard Administrador
      </h1>
      <p class="mt-1 text-lg text-gray-600">
        Bienvenido, aquí tienes un resumen de la actividad de tu empresa.
      </p>
    </div>

    <div v-if="adminStore.loading">
      <PageLoader text="Cargando estadísticas..." />
    </div>
    
    <div v-else-if="adminStore.dashboardStats && !adminStore.error">
      <h2 class="text-xl font-semibold text-gray-800">Estadísticas Generales</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          v-for="card in dashboardCards"
          :key="card.title"
          :title="card.title"
          :value="card.value"
          :icon="card.icon"
          :colorClass="card.colorClass"
          :bgColorClass="card.bgColorClass"
          :actionText="card.actionText"
          :actionTo="card.actionTo"
        />
      </div>
    </div>

    <div v-else-if="adminStore.error" class="text-red-600 bg-red-100 p-4 rounded-lg">
      <p><strong>Error:</strong> No se pudieron cargar las estadísticas del dashboard.</p>
      <p>{{ adminStore.error }}</p>
    </div>
  </div>
</template>