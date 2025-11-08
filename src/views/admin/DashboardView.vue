<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import { supabase } from '@/lib/supabase';
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Gift,
  FileText,
  TrendingUp,
  Plus
} from 'lucide-vue-next';
import StatsCard from '@/components/ui/StatsCard.vue';
import EmptyState from '@/components/common/EmptyState.vue';
import Button from '@/components/ui/Button.vue';

const router = useRouter();
const authStore = useAuthStore();

const loading = ref(true);
const empresa = ref(null);
const stats = ref({
  totalEmpleados: 0,
  comunicadosActivos: 0,
  encuestasActivas: 0,
  recompensasDisponibles: 0
});

const hasData = computed(() => {
  return stats.value.totalEmpleados > 0 ||
         stats.value.comunicadosActivos > 0 ||
         stats.value.encuestasActivas > 0;
});

onMounted(async () => {
  await loadDashboardData();
});

const loadDashboardData = async () => {
  loading.value = true;

  try {
    // Cargar datos de la empresa
    const { data: empresaData } = await supabase
      .from('empresas')
      .select('*')
      .eq('id', authStore.empresaId)
      .maybeSingle();

    empresa.value = empresaData;

    // Cargar estadísticas
    await Promise.all([
      loadEmpleadosCount(),
      loadComunicadosCount(),
      loadEncuestasCount(),
      loadRecompensasCount()
    ]);

  } catch (error) {
    console.error('Error cargando dashboard:', error);
  } finally {
    loading.value = false;
  }
};

const loadEmpleadosCount = async () => {
  const { count } = await supabase
    .from('empleados')
    .select('*', { count: 'exact', head: true })
    .eq('empresa_id', authStore.empresaId)
    .eq('estado', 'Activo');

  stats.value.totalEmpleados = count || 0;
};

const loadComunicadosCount = async () => {
  const { count } = await supabase
    .from('comunicados')
    .select('*', { count: 'exact', head: true })
    .eq('empresa_id', authStore.empresaId);

  stats.value.comunicadosActivos = count || 0;
};

const loadEncuestasCount = async () => {
  const { count } = await supabase
    .from('encuestas')
    .select('*', { count: 'exact', head: true })
    .eq('empresa_id', authStore.empresaId)
    .eq('estado', 'Activa');

  stats.value.encuestasActivas = count || 0;
};

const loadRecompensasCount = async () => {
  const { count } = await supabase
    .from('recompensas')
    .select('*', { count: 'exact', head: true })
    .eq('empresa_id', authStore.empresaId)
    .eq('activa', true);

  stats.value.recompensasDisponibles = count || 0;
};
</script>

<template>
  <div class="space-y-8">

    <!-- Hero Section -->
    <div class="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-2xl shadow-2xl">
      <div class="absolute inset-0 bg-black/10"></div>
      <div class="relative px-8 py-12">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-6">
            <div class="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <LayoutDashboard class="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 class="text-4xl font-bold text-white mb-2">Dashboard</h1>
              <p class="text-xl text-white/90">{{ empresa?.nombre || 'Tu empresa' }}</p>
            </div>
          </div>
          <div class="text-right">
            <div class="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
              <div class="w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              <span class="text-white font-medium">Sistema Activo</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <!-- Stats Grid -->
    <div v-else-if="hasData" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Empleados"
        :value="stats.totalEmpleados"
        icon="users"
        color="blue"
        :trend="null"
        description="Empleados activos"
        @click="router.push('/admin/empleados')"
      />

      <StatsCard
        title="Comunicados"
        :value="stats.comunicadosActivos"
        icon="message-square"
        color="green"
        :trend="null"
        description="Mensajes enviados"
        @click="router.push('/admin/comunicacion')"
      />

      <StatsCard
        title="Encuestas"
        :value="stats.encuestasActivas"
        icon="file-text"
        color="purple"
        :trend="null"
        description="Encuestas activas"
        @click="router.push('/admin/encuestas')"
      />

      <StatsCard
        title="Recompensas"
        :value="stats.recompensasDisponibles"
        icon="gift"
        color="orange"
        :trend="null"
        description="Premios disponibles"
        @click="router.push('/admin/recompensas')"
      />
    </div>

    <!-- Quick Actions -->
    <div v-if="hasData" class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div class="bg-gradient-to-r from-gray-50 to-blue-50 px-8 py-6 border-b border-gray-200">
        <h2 class="text-2xl font-bold text-gray-900">Acciones Rápidas</h2>
        <p class="text-gray-600 mt-1">Gestiona las áreas principales de tu empresa</p>
      </div>

      <div class="p-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          <!-- Invitar Empleados -->
          <button
            @click="router.push('/admin/empleados')"
            class="group p-6 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-xl transition-all hover:shadow-md"
          >
            <div class="flex items-start space-x-4">
              <div class="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users class="h-6 w-6 text-white" />
              </div>
              <div class="flex-1 text-left">
                <h3 class="font-semibold text-gray-900 mb-1">Gestionar Empleados</h3>
                <p class="text-sm text-gray-600">Invita y administra tu equipo</p>
              </div>
            </div>
          </button>

          <!-- Crear Comunicado -->
          <button
            @click="router.push('/admin/comunicacion')"
            class="group p-6 bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 rounded-xl transition-all hover:shadow-md"
          >
            <div class="flex items-start space-x-4">
              <div class="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageSquare class="h-6 w-6 text-white" />
              </div>
              <div class="flex-1 text-left">
                <h3 class="font-semibold text-gray-900 mb-1">Comunicación</h3>
                <p class="text-sm text-gray-600">Envía mensajes a tu equipo</p>
              </div>
            </div>
          </button>

          <!-- Crear Encuesta -->
          <button
            @click="router.push('/admin/encuestas')"
            class="group p-6 bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-xl transition-all hover:shadow-md"
          >
            <div class="flex items-start space-x-4">
              <div class="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileText class="h-6 w-6 text-white" />
              </div>
              <div class="flex-1 text-left">
                <h3 class="font-semibold text-gray-900 mb-1">Encuestas</h3>
                <p class="text-sm text-gray-600">Mide el clima laboral</p>
              </div>
            </div>
          </button>

          <!-- Gestionar Recompensas -->
          <button
            @click="router.push('/admin/recompensas')"
            class="group p-6 bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 rounded-xl transition-all hover:shadow-md"
          >
            <div class="flex items-start space-x-4">
              <div class="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Gift class="h-6 w-6 text-white" />
              </div>
              <div class="flex-1 text-left">
                <h3 class="font-semibold text-gray-900 mb-1">Recompensas</h3>
                <p class="text-sm text-gray-600">Configura premios y motivación</p>
              </div>
            </div>
          </button>

          <!-- Analítica -->
          <button
            @click="router.push('/admin/analitica')"
            class="group p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 hover:from-indigo-100 hover:to-indigo-200 rounded-xl transition-all hover:shadow-md"
          >
            <div class="flex items-start space-x-4">
              <div class="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingUp class="h-6 w-6 text-white" />
              </div>
              <div class="flex-1 text-left">
                <h3 class="font-semibold text-gray-900 mb-1">Analítica</h3>
                <p class="text-sm text-gray-600">Reportes y métricas</p>
              </div>
            </div>
          </button>

        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && !hasData" class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <EmptyState
        :icon="LayoutDashboard"
        title="¡Bienvenido a Smart Bienestar!"
        description="Tu plataforma está lista. Comienza invitando a tu equipo, creando comunicados o configurando encuestas para medir el clima laboral."
        action-text="Ver guía de inicio"
        :action-icon="Plus"
        @action="router.push('/admin/onboarding')"
      />
    </div>

  </div>
</template>
