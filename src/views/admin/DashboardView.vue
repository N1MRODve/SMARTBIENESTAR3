<template>
  <div class="p-4 space-y-6">
    <!-- Sección 1: Resumen Ejecutivo -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard title="Total Empleados" :value="stats.totalEmpleados" icon="users" />
      <StatsCard title="Servicios Activos" :value="stats.serviciosActivos" icon="briefcase" />
      <StatsCard title="Participación Encuestas" :value="stats.participacionEncuestas + '%'" icon="poll" />
      <StatsCard title="Actividad Semanal" :value="stats.actividadSemanal" icon="calendar-week" />
    </div>

    <!-- Sección 2: Métricas Visuales -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <ChartCard title="Servicios Más Populares" :chart-data="popularServicesData" />
      <ChartCard title="Participación por Departamento" :chart-data="departmentsParticipationData" />
      <ChartCard title="Tendencia de Uso Mensual" :chart-data="monthlyUsageData" />
    </div>

    <!-- Sección 3: Centro de Encuestas -->
    <EncuestaResultados :resultados="encuestaResultados" :participacion="participacionEncuesta" />

    <!-- Sección 4: Actividad Reciente -->
    <ActividadReciente :empleados="empleadosRecientes" :sesiones="proximasSesiones" />
  </div>
</template>

<script setup>
import StatsCard from '@/components/admin/StatsCard.vue'
import ChartCard from '@/components/admin/ChartCard.vue'
import EncuestaResultados from '@/components/admin/EncuestaResultados.vue'
import ActividadReciente from '@/components/admin/ActividadReciente.vue'
import { useAdminStats } from '@/composables/useAdminStats.js'

const {
  stats,
  popularServicesData,
  departmentsParticipationData,
  monthlyUsageData,
  encuestaResultados,
  participacionEncuesta,
  empleadosRecientes,
  proximasSesiones
} = useAdminStats()
</script>