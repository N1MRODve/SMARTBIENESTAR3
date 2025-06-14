<template>
  <!-- ASEGÚRATE DE QUE ESTÉ ENVUELTO EN UN LAYOUT COMPLETO -->
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar -->
    <aside class="hidden lg:flex lg:flex-shrink-0">
      <div class="flex flex-col w-64">
        <div class="bg-primary flex flex-col h-0 flex-1">
          <!-- Logo -->
          <div class="flex items-center h-16 flex-shrink-0 px-4 bg-primary-dark">
            <h1 class="text-white text-xl font-bold">
              SMART<span class="text-accent">Bienestar</span>
            </h1>
          </div>
          
          <!-- Navigation -->
          <div class="flex-1 flex flex-col overflow-y-auto">
            <nav class="flex-1 px-2 py-4 space-y-1">
              <router-link
                to="/superadmin/dashboard"
                class="sidebar-item"
                active-class="bg-primary-dark"
              >
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
                </svg>
                Dashboard
              </router-link>
              
              <router-link
                to="/superadmin/empresas"
                class="sidebar-item"
                active-class="bg-primary-dark"
              >
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
                Empresas
              </router-link>
              
              <router-link
                to="/superadmin/colaboradores"
                class="sidebar-item"
                active-class="bg-primary-dark"
              >
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-2.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                </svg>
                Colaboradores
              </router-link>
            </nav>
            
            <!-- User section -->
            <div class="flex-shrink-0 flex border-t border-primary-dark p-4">
              <div class="flex items-center">
                <div class="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <span class="text-primary font-medium text-sm">D</span>
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-white">Dieter Lorenzo</p>
                  <p class="text-xs text-gray-300">Superadministrador</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main content -->
    <div class="flex flex-col w-0 flex-1 overflow-hidden">
      <!-- Top navigation -->
      <div class="relative z-10 flex-shrink-0 flex h-16 bg-white shadow lg:hidden">
        <!-- Mobile menu button -->
        <button
          @click="sidebarOpen = true"
          class="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary lg:hidden"
        >
          <span class="sr-only">Open sidebar</span>
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>

      <!-- Main content area -->
      <main class="flex-1 relative overflow-y-auto focus:outline-none">
        <div class="py-6">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <!-- AQUÍ VA TU CONTENIDO ACTUAL DEL DASHBOARD -->
            <div class="space-y-8">
              <!-- Header -->
              <div>
                <h1 class="text-2xl font-bold text-gray-900">Dashboard Superadmin</h1>
                <p class="mt-1 text-sm text-gray-500">
                  Vista general del sistema
                </p>
              </div>

              <!-- Stats Grid -->
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                  title="Total Empresas"
                  :value="stats.totalEmpresas"
                  icon="Building2"
                  trend="neutral"
                />
                <StatsCard
                  title="Total Usuarios"
                  :value="stats.totalUsuarios"
                  icon="Users"
                  trend="up"
                />
                <StatsCard
                  title="Colaboradores Pendientes"
                  :value="stats.colaboradoresPendientes"
                  icon="UserCheck"
                  trend="neutral"
                />
                <StatsCard
                  title="Sesiones Hoy"
                  :value="stats.sesionesHoy"
                  icon="Calendar"
                  trend="neutral"
                />
              </div>

              <!-- Tables Grid -->
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- Empresas Recientes -->
                <div>
                  <h2 class="text-lg font-semibold text-gray-900 mb-4">
                    Empresas Recientes
                  </h2>
                  <DataTable
                    :columns="[
                      { key: 'nombre', header: 'Nombre' },
                      { key: 'dominio_email', header: 'Dominio' },
                      {
                        key: 'activo',
                        header: 'Estado',
                        render: (row) => ({
                          text: row.activo ? 'Activa' : 'Inactiva',
                          class: row.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        })
                      }
                    ]"
                    :data="empresasRecientes"
                    searchable={false}
                    pagination={false}
                  />
                </div>

                <!-- Colaboradores Pendientes -->
                <div>
                  <h2 class="text-lg font-semibold text-gray-900 mb-4">
                    Colaboradores Pendientes
                  </h2>
                  <DataTable
                    :columns="[
                      {
                        key: 'nombre',
                        header: 'Nombre',
                        render: (row) => `${row.usuarios.nombre} ${row.usuarios.apellido}`
                      },
                      {
                        key: 'email',
                        header: 'Email',
                        render: (row) => row.usuarios.email
                      },
                      { key: 'especialidad', header: 'Especialidad' }
                    ]"
                    :data="colaboradoresPendientes"
                    searchable={false}
                    pagination={false}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Building2, Users, UserCheck, Calendar } from 'lucide-vue-next';
import { supabase } from '../../services/supabase';
import StatsCard from '../../components/common/StatsCard.vue';
import DataTable from '../../components/common/DataTable.vue';

const sidebarOpen = ref(false);

const stats = ref({
  totalEmpresas: 0,
  totalUsuarios: 0,
  colaboradoresPendientes: 0,
  sesionesHoy: 0
});

const empresasRecientes = ref([]);
const colaboradoresPendientes = ref([]);

const loadDashboardData = async () => {
  try {
    // Cargar estadísticas
    const [
      { count: empresasCount },
      { count: usuariosCount },
      { count: colaboradoresCount },
      { count: sesionesCount }
    ] = await Promise.all([
      supabase.from('empresas').select('*', { count: 'exact', head: true }),
      supabase.from('usuarios').select('*', { count: 'exact', head: true }),
      supabase
        .from('perfil_colaboradores')
        .select('*', { count: 'exact', head: true })
        .eq('estado', 'pendiente'),
      supabase
        .from('sesiones')
        .select('*', { count: 'exact', head: true })
        .gte('fecha_inicio', new Date().toISOString().split('T')[0])
        .lte('fecha_inicio', new Date().toISOString().split('T')[0] + 'T23:59:59')
    ]);

    stats.value = {
      totalEmpresas: empresasCount || 0,
      totalUsuarios: usuariosCount || 0,
      colaboradoresPendientes: colaboradoresCount || 0,
      sesionesHoy: sesionesCount || 0
    };

    // Cargar empresas recientes
    const { data: empresas } = await supabase
      .from('empresas')
      .select('*')
      .order('fecha_registro', { ascending: false })
      .limit(5);

    empresasRecientes.value = empresas || [];

    // Cargar colaboradores pendientes (método corregido)
    const { data: colaboradoresList, error: colaboradoresError } = await supabase
      .from('perfil_colaboradores')
      .select('*')
      .eq('estado', 'pendiente')
      .limit(5);

    let colaboradores = [];

    if (!colaboradoresError && colaboradoresList && colaboradoresList.length > 0) {
      const usuarioIds = colaboradoresList.map(c => c.usuario_id);
      const { data: usuariosData } = await supabase
        .from('usuarios')
        .select('id, nombre, apellido, email')
        .in('id', usuarioIds);

      colaboradores = colaboradoresList.map(colab => ({
        ...colab,
        usuarios: usuariosData?.find(u => u.id === colab.usuario_id) || {
          nombre: 'Sin datos',
          apellido: '',
          email: 'No disponible'
        }
      }));
    }

    colaboradoresPendientes.value = colaboradores;
  } catch (error) {
    console.error('Error loading dashboard data:', error);
  }
};

onMounted(() => {
  loadDashboardData();
});
</script>

<style scoped>
.sidebar-item {
  @apply flex items-center px-2 py-2 text-sm font-medium text-white rounded-md hover:bg-primary-dark hover:text-white transition-colors duration-150;
}

.text-primary {
  color: #2A4B8C;
}

.text-accent {
  color: #F2E5A2;
}

.bg-primary {
  background-color: #2A4B8C;
}

.bg-primary-dark {
  background-color: #243E73;
}
</style>