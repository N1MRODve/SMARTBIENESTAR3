<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  Heart,
  Brain,
  TrendingUp,
  Users,
  Shield,
  Gift,
  FileText,
  MessageSquare,
  BarChart3,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Target,
  Clock,
  Award,
  ChevronDown,
  Menu,
  X,
  Play,
  Zap,
  Lock,
  Globe,
  Smartphone
} from 'lucide-vue-next';

const router = useRouter();
const mobileMenuOpen = ref(false);
const activeScreenshot = ref(0);

// Screenshots de la plataforma
const screenshots = [
  {
    id: 'dashboard-admin',
    title: 'Dashboard de Administración',
    description: 'Panel central con métricas de bienestar, insights automáticos y acciones recomendadas.',
    role: 'admin'
  },
  {
    id: 'encuestas',
    title: 'Sistema de Encuestas Inteligente',
    description: 'Crea encuestas con preguntas validadas científicamente y obtén resultados accionables.',
    role: 'admin'
  },
  {
    id: 'analitica',
    title: 'Analítica Ejecutiva',
    description: 'Visualiza tendencias, compara departamentos y genera reportes profesionales.',
    role: 'admin'
  },
  {
    id: 'empleado-dashboard',
    title: 'Portal del Empleado',
    description: 'Interfaz intuitiva para empleados con encuestas, comunicados y recompensas.',
    role: 'empleado'
  }
];

// Beneficios para empresas/admins
const beneficiosAdmin = [
  {
    icon: BarChart3,
    title: 'Métricas en Tiempo Real',
    description: 'Visualiza el estado de bienestar de tu equipo con dashboards actualizados automáticamente.'
  },
  {
    icon: Brain,
    title: 'Insights Automáticos',
    description: 'Recibe recomendaciones basadas en datos para mejorar el clima laboral.'
  },
  {
    icon: FileText,
    title: 'Encuestas Inteligentes',
    description: 'Crea encuestas con preguntas científicamente validadas en minutos.'
  },
  {
    icon: Target,
    title: 'Acciones Priorizadas',
    description: 'El sistema te indica qué áreas requieren atención inmediata.'
  },
  {
    icon: Shield,
    title: 'Datos Confidenciales',
    description: 'Resultados agregados que protegen la privacidad individual de cada empleado.'
  },
  {
    icon: TrendingUp,
    title: 'Reportes Ejecutivos',
    description: 'Genera presentaciones profesionales para la dirección en un clic.'
  }
];

// Beneficios para empleados
const beneficiosEmpleado = [
  {
    icon: Lock,
    title: 'Privacidad Garantizada',
    description: 'Tus respuestas son 100% confidenciales y anónimas. Tu manager no verá tus respuestas individuales.'
  },
  {
    icon: Gift,
    title: 'Sistema de Recompensas',
    description: 'Gana puntos por participar y canjéalos por beneficios exclusivos.'
  },
  {
    icon: MessageSquare,
    title: 'Comunicación Directa',
    description: 'Recibe comunicados importantes y mantente informado de las novedades.'
  },
  {
    icon: Smartphone,
    title: 'Acceso Fácil',
    description: 'Responde encuestas desde cualquier dispositivo, cuando te convenga.'
  },
  {
    icon: Heart,
    title: 'Tu Voz Importa',
    description: 'Tus opiniones influyen directamente en las decisiones de mejora.'
  },
  {
    icon: Sparkles,
    title: 'Apoyo Personalizado',
    description: 'Accede a recursos de bienestar adaptados a tus necesidades.'
  }
];

// Características principales
const caracteristicas = [
  {
    icon: Users,
    title: 'Multiempresa',
    description: 'Gestiona múltiples empresas con datos completamente aislados.'
  },
  {
    icon: Globe,
    title: 'Acceso Web',
    description: 'Sin instalaciones. Funciona en cualquier navegador moderno.'
  },
  {
    icon: Zap,
    title: 'Tiempo Real',
    description: 'Datos actualizados instantáneamente conforme llegan respuestas.'
  },
  {
    icon: Lock,
    title: 'Seguridad',
    description: 'Encriptación de datos y cumplimiento con normativas de privacidad.'
  }
];

const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
  mobileMenuOpen.value = false;
};

const goToLogin = () => {
  router.push('/login');
};

const goToDemo = () => {
  router.push('/solicitar-demo');
};
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- Navigation -->
    <nav class="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex items-center gap-2">
            <div class="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Heart class="h-5 w-5 text-white" />
            </div>
            <span class="text-xl font-bold text-gray-900">SMART Bienestar</span>
          </div>

          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center gap-8">
            <button @click="scrollToSection('beneficios')" class="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
              Beneficios
            </button>
            <button @click="scrollToSection('plataforma')" class="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
              Plataforma
            </button>
            <button @click="scrollToSection('para-empleados')" class="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
              Para Empleados
            </button>
          </div>

          <!-- CTA Buttons -->
          <div class="hidden md:flex items-center gap-3">
            <button
              @click="goToLogin"
              class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              Iniciar Sesión
            </button>
            <button
              @click="goToDemo"
              class="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/25"
            >
              Solicitar Demo
            </button>
          </div>

          <!-- Mobile menu button -->
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="md:hidden p-2 text-gray-600 hover:text-gray-900"
          >
            <Menu v-if="!mobileMenuOpen" class="h-6 w-6" />
            <X v-else class="h-6 w-6" />
          </button>
        </div>

        <!-- Mobile menu -->
        <div v-if="mobileMenuOpen" class="md:hidden py-4 border-t border-gray-100">
          <div class="flex flex-col gap-4">
            <button @click="scrollToSection('beneficios')" class="text-gray-600 hover:text-gray-900 text-sm font-medium text-left">
              Beneficios
            </button>
            <button @click="scrollToSection('plataforma')" class="text-gray-600 hover:text-gray-900 text-sm font-medium text-left">
              Plataforma
            </button>
            <button @click="scrollToSection('para-empleados')" class="text-gray-600 hover:text-gray-900 text-sm font-medium text-left">
              Para Empleados
            </button>
            <div class="flex flex-col gap-2 pt-4 border-t border-gray-100">
              <button @click="goToLogin" class="w-full py-2.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                Iniciar Sesión
              </button>
              <button @click="goToDemo" class="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-lg">
                Solicitar Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-indigo-50/50 to-white">
      <div class="max-w-7xl mx-auto">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <!-- Left: Text Content -->
          <div class="text-center lg:text-left">
            <div class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-6">
              <Sparkles class="h-4 w-4" />
              Plataforma de Bienestar Laboral
            </div>

            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Mide y mejora el
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                bienestar
              </span>
              de tu equipo
            </h1>

            <p class="mt-6 text-xl text-gray-600 leading-relaxed">
              SMART Bienestar te ayuda a entender cómo se siente tu equipo, identificar áreas de mejora y tomar acciones que impacten positivamente en la productividad y satisfacción laboral.
            </p>

            <div class="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                @click="goToDemo"
                class="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-2"
              >
                Solicitar Demo Gratuita
                <ArrowRight class="h-5 w-5" />
              </button>
              <button
                @click="scrollToSection('plataforma')"
                class="px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
              >
                <Play class="h-5 w-5" />
                Ver cómo funciona
              </button>
            </div>

            <!-- Trust indicators -->
            <div class="mt-12 pt-8 border-t border-gray-200">
              <div class="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-gray-500">
                <div class="flex items-center gap-2">
                  <CheckCircle class="h-5 w-5 text-green-500" />
                  <span>Sin tarjeta de crédito</span>
                </div>
                <div class="flex items-center gap-2">
                  <CheckCircle class="h-5 w-5 text-green-500" />
                  <span>Configuración en minutos</span>
                </div>
                <div class="flex items-center gap-2">
                  <CheckCircle class="h-5 w-5 text-green-500" />
                  <span>Soporte incluido</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Right: Hero Image/Illustration -->
          <div class="relative">
            <div class="relative z-10 bg-white rounded-2xl shadow-2xl shadow-indigo-500/10 border border-gray-200 overflow-hidden">
              <!-- Mock Dashboard Preview -->
              <div class="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <Heart class="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div class="text-white font-semibold">Dashboard de Bienestar</div>
                    <div class="text-white/70 text-sm">Vista del administrador</div>
                  </div>
                </div>
              </div>
              <div class="p-6 space-y-4">
                <!-- Mock Stats -->
                <div class="grid grid-cols-3 gap-4">
                  <div class="bg-green-50 rounded-xl p-4 text-center">
                    <div class="text-2xl font-bold text-green-600">8.2</div>
                    <div class="text-xs text-green-700">Bienestar</div>
                  </div>
                  <div class="bg-blue-50 rounded-xl p-4 text-center">
                    <div class="text-2xl font-bold text-blue-600">76%</div>
                    <div class="text-xs text-blue-700">Participación</div>
                  </div>
                  <div class="bg-purple-50 rounded-xl p-4 text-center">
                    <div class="text-2xl font-bold text-purple-600">+12%</div>
                    <div class="text-xs text-purple-700">vs. mes anterior</div>
                  </div>
                </div>
                <!-- Mock Chart -->
                <div class="bg-gray-50 rounded-xl p-4">
                  <div class="flex items-center justify-between mb-3">
                    <span class="text-sm font-medium text-gray-700">Tendencia de Bienestar</span>
                    <span class="text-xs text-gray-500">Últimos 6 meses</span>
                  </div>
                  <div class="flex items-end gap-2 h-20">
                    <div class="flex-1 bg-indigo-200 rounded-t" style="height: 50%"></div>
                    <div class="flex-1 bg-indigo-300 rounded-t" style="height: 60%"></div>
                    <div class="flex-1 bg-indigo-400 rounded-t" style="height: 55%"></div>
                    <div class="flex-1 bg-indigo-500 rounded-t" style="height: 70%"></div>
                    <div class="flex-1 bg-indigo-600 rounded-t" style="height: 85%"></div>
                    <div class="flex-1 bg-gradient-to-t from-indigo-600 to-purple-500 rounded-t" style="height: 100%"></div>
                  </div>
                </div>
                <!-- Mock Insights -->
                <div class="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <div class="flex items-start gap-3">
                    <div class="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Sparkles class="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <div class="text-sm font-medium text-amber-800">Insight de la semana</div>
                      <div class="text-xs text-amber-700 mt-1">El departamento de Marketing muestra mejora del 15% en satisfacción laboral.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- Decorative elements -->
            <div class="absolute -z-10 top-10 -right-10 w-72 h-72 bg-purple-200 rounded-full blur-3xl opacity-30"></div>
            <div class="absolute -z-10 -bottom-10 -left-10 w-72 h-72 bg-indigo-200 rounded-full blur-3xl opacity-30"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Benefits for Companies Section -->
    <section id="beneficios" class="py-20 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <div class="text-center max-w-3xl mx-auto mb-16">
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-4">
            <BarChart3 class="h-4 w-4" />
            Para Empresas
          </div>
          <h2 class="text-3xl sm:text-4xl font-bold text-gray-900">
            Todo lo que necesitas para gestionar el bienestar
          </h2>
          <p class="mt-4 text-xl text-gray-600">
            Herramientas poderosas para entender a tu equipo y tomar decisiones basadas en datos.
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="beneficio in beneficiosAdmin"
            :key="beneficio.title"
            class="group bg-white rounded-2xl p-8 border border-gray-200 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300"
          >
            <div class="w-14 h-14 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center mb-6 group-hover:from-indigo-200 group-hover:to-purple-200 transition-colors">
              <component :is="beneficio.icon" class="h-7 w-7 text-indigo-600" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">{{ beneficio.title }}</h3>
            <p class="text-gray-600 leading-relaxed">{{ beneficio.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Platform Screenshots Section -->
    <section id="plataforma" class="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
      <div class="max-w-7xl mx-auto">
        <div class="text-center max-w-3xl mx-auto mb-16">
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-4">
            <Smartphone class="h-4 w-4" />
            La Plataforma
          </div>
          <h2 class="text-3xl sm:text-4xl font-bold text-gray-900">
            Diseñada para ser fácil de usar
          </h2>
          <p class="mt-4 text-xl text-gray-600">
            Interfaz intuitiva tanto para administradores como para empleados.
          </p>
        </div>

        <!-- Screenshot Tabs -->
        <div class="flex flex-wrap justify-center gap-3 mb-10">
          <button
            v-for="(screenshot, index) in screenshots"
            :key="screenshot.id"
            @click="activeScreenshot = index"
            :class="[
              'px-5 py-2.5 rounded-full text-sm font-medium transition-all',
              activeScreenshot === index
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-300'
            ]"
          >
            {{ screenshot.title }}
          </button>
        </div>

        <!-- Screenshot Display -->
        <div class="relative">
          <div class="bg-white rounded-3xl shadow-2xl shadow-gray-500/10 border border-gray-200 overflow-hidden">
            <!-- Browser Chrome -->
            <div class="bg-gray-100 px-4 py-3 flex items-center gap-2 border-b border-gray-200">
              <div class="flex gap-1.5">
                <div class="w-3 h-3 rounded-full bg-red-400"></div>
                <div class="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div class="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div class="flex-1 flex justify-center">
                <div class="px-4 py-1 bg-white rounded-lg text-xs text-gray-500 flex items-center gap-2">
                  <Lock class="h-3 w-3" />
                  app.smartbienestar.com
                </div>
              </div>
            </div>

            <!-- Screenshot Content -->
            <div class="aspect-video bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-8">
              <!-- Admin Dashboard Mock -->
              <div v-if="screenshots[activeScreenshot].id === 'dashboard-admin'" class="w-full max-w-4xl">
                <div class="bg-white rounded-xl shadow-lg p-6 space-y-4">
                  <div class="flex items-center justify-between">
                    <div>
                      <div class="text-lg font-bold text-gray-900">Buenos días, Admin</div>
                      <div class="text-sm text-gray-500">Mi Empresa S.A.</div>
                    </div>
                    <div class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Todo en orden</div>
                  </div>
                  <div class="grid grid-cols-4 gap-4">
                    <div class="bg-indigo-50 rounded-lg p-4">
                      <div class="text-2xl font-bold text-indigo-600">48</div>
                      <div class="text-xs text-gray-600">Empleados</div>
                    </div>
                    <div class="bg-orange-50 rounded-lg p-4">
                      <div class="text-2xl font-bold text-orange-600">3</div>
                      <div class="text-xs text-gray-600">Encuestas</div>
                    </div>
                    <div class="bg-purple-50 rounded-lg p-4">
                      <div class="text-2xl font-bold text-purple-600">12</div>
                      <div class="text-xs text-gray-600">Recompensas</div>
                    </div>
                    <div class="bg-green-50 rounded-lg p-4">
                      <div class="text-2xl font-bold text-green-600">8.4</div>
                      <div class="text-xs text-gray-600">Bienestar</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Encuestas Mock -->
              <div v-else-if="screenshots[activeScreenshot].id === 'encuestas'" class="w-full max-w-4xl">
                <div class="bg-white rounded-xl shadow-lg p-6">
                  <div class="text-lg font-bold text-gray-900 mb-4">Crear Nueva Encuesta</div>
                  <div class="space-y-3">
                    <div class="flex items-center gap-3 p-4 bg-indigo-50 rounded-lg border-2 border-indigo-300">
                      <CheckCircle class="h-5 w-5 text-indigo-600" />
                      <div>
                        <div class="font-medium text-gray-900">Clima Laboral</div>
                        <div class="text-xs text-gray-500">8 preguntas - Altamente recomendada</div>
                      </div>
                    </div>
                    <div class="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div class="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                      <div>
                        <div class="font-medium text-gray-900">Salud Mental</div>
                        <div class="text-xs text-gray-500">6 preguntas</div>
                      </div>
                    </div>
                    <div class="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div class="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                      <div>
                        <div class="font-medium text-gray-900">Balance Vida-Trabajo</div>
                        <div class="text-xs text-gray-500">5 preguntas</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Analítica Mock -->
              <div v-else-if="screenshots[activeScreenshot].id === 'analitica'" class="w-full max-w-4xl">
                <div class="bg-white rounded-xl shadow-lg p-6">
                  <div class="text-lg font-bold text-gray-900 mb-4">Analítica Ejecutiva</div>
                  <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-2">
                      <div class="text-sm text-gray-500">Bienestar por Departamento</div>
                      <div class="space-y-2">
                        <div class="flex items-center gap-2">
                          <span class="text-xs w-20">Marketing</span>
                          <div class="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                            <div class="h-full bg-green-500 rounded-full" style="width: 85%"></div>
                          </div>
                          <span class="text-xs font-medium">8.5</span>
                        </div>
                        <div class="flex items-center gap-2">
                          <span class="text-xs w-20">Ventas</span>
                          <div class="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                            <div class="h-full bg-green-500 rounded-full" style="width: 78%"></div>
                          </div>
                          <span class="text-xs font-medium">7.8</span>
                        </div>
                        <div class="flex items-center gap-2">
                          <span class="text-xs w-20">Desarrollo</span>
                          <div class="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                            <div class="h-full bg-amber-500 rounded-full" style="width: 65%"></div>
                          </div>
                          <span class="text-xs font-medium">6.5</span>
                        </div>
                      </div>
                    </div>
                    <div class="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-4">
                      <div class="text-sm font-medium text-indigo-900 mb-2">Recomendación</div>
                      <div class="text-xs text-indigo-700">El departamento de Desarrollo necesita atención. Considera implementar pausas activas.</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Empleado Dashboard Mock -->
              <div v-else-if="screenshots[activeScreenshot].id === 'empleado-dashboard'" class="w-full max-w-4xl">
                <div class="bg-white rounded-xl shadow-lg p-6 space-y-4">
                  <div class="flex items-center gap-4">
                    <div class="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      JD
                    </div>
                    <div>
                      <div class="font-bold text-gray-900">Hola, Juan</div>
                      <div class="text-sm text-gray-500">Tienes 2 encuestas pendientes</div>
                    </div>
                  </div>
                  <div class="grid grid-cols-2 gap-4">
                    <div class="bg-indigo-50 rounded-lg p-4">
                      <div class="flex items-center gap-2 mb-2">
                        <FileText class="h-5 w-5 text-indigo-600" />
                        <span class="text-sm font-medium">Encuestas</span>
                      </div>
                      <div class="text-2xl font-bold text-indigo-600">2</div>
                      <div class="text-xs text-gray-500">pendientes</div>
                    </div>
                    <div class="bg-amber-50 rounded-lg p-4">
                      <div class="flex items-center gap-2 mb-2">
                        <Award class="h-5 w-5 text-amber-600" />
                        <span class="text-sm font-medium">Puntos</span>
                      </div>
                      <div class="text-2xl font-bold text-amber-600">350</div>
                      <div class="text-xs text-gray-500">disponibles</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Screenshot Description -->
          <div class="mt-6 text-center">
            <h3 class="text-xl font-bold text-gray-900">{{ screenshots[activeScreenshot].title }}</h3>
            <p class="mt-2 text-gray-600">{{ screenshots[activeScreenshot].description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Benefits for Employees Section -->
    <section id="para-empleados" class="py-20 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <div class="text-center max-w-3xl mx-auto mb-16">
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-4">
            <Heart class="h-4 w-4" />
            Para Empleados
          </div>
          <h2 class="text-3xl sm:text-4xl font-bold text-gray-900">
            Tu voz importa y está protegida
          </h2>
          <p class="mt-4 text-xl text-gray-600">
            Participa de forma segura y obtén beneficios reales por compartir tu opinión.
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="beneficio in beneficiosEmpleado"
            :key="beneficio.title"
            class="group bg-white rounded-2xl p-8 border border-gray-200 hover:border-green-300 hover:shadow-xl hover:shadow-green-500/10 transition-all duration-300"
          >
            <div class="w-14 h-14 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center mb-6 group-hover:from-green-200 group-hover:to-emerald-200 transition-colors">
              <component :is="beneficio.icon" class="h-7 w-7 text-green-600" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">{{ beneficio.title }}</h3>
            <p class="text-gray-600 leading-relaxed">{{ beneficio.description }}</p>
          </div>
        </div>

        <!-- Privacy Callout -->
        <div class="mt-16 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200">
          <div class="flex flex-col md:flex-row items-center gap-6">
            <div class="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Shield class="h-8 w-8 text-green-600" />
            </div>
            <div class="text-center md:text-left">
              <h3 class="text-xl font-bold text-green-900">Compromiso con la Privacidad</h3>
              <p class="mt-2 text-green-700">
                Las respuestas de cada empleado son completamente confidenciales. Los administradores solo ven resultados agregados y anónimos, nunca respuestas individuales. Tu honestidad está protegida.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Grid -->
    <section class="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900">
      <div class="max-w-7xl mx-auto">
        <div class="text-center max-w-3xl mx-auto mb-16">
          <h2 class="text-3xl sm:text-4xl font-bold text-white">
            Tecnología de clase empresarial
          </h2>
          <p class="mt-4 text-xl text-gray-400">
            Infraestructura robusta y segura para empresas de cualquier tamaño.
          </p>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="feature in caracteristicas"
            :key="feature.title"
            class="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-indigo-500 transition-colors"
          >
            <div class="w-12 h-12 bg-indigo-500/10 rounded-lg flex items-center justify-center mb-4">
              <component :is="feature.icon" class="h-6 w-6 text-indigo-400" />
            </div>
            <h3 class="text-lg font-bold text-white mb-2">{{ feature.title }}</h3>
            <p class="text-gray-400 text-sm">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-600 to-purple-600">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-3xl sm:text-4xl font-bold text-white">
          Empieza a medir el bienestar de tu equipo hoy
        </h2>
        <p class="mt-4 text-xl text-indigo-100">
          Solicita una demostración gratuita y descubre cómo SMART Bienestar puede transformar tu organización.
        </p>
        <div class="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            @click="goToDemo"
            class="px-8 py-4 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors shadow-xl flex items-center justify-center gap-2"
          >
            Solicitar Demo Gratuita
            <ArrowRight class="h-5 w-5" />
          </button>
          <button
            @click="goToLogin"
            class="px-8 py-4 bg-indigo-500 text-white font-semibold rounded-xl hover:bg-indigo-400 transition-colors border border-indigo-400 flex items-center justify-center gap-2"
          >
            Ya tengo cuenta
          </button>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900">
      <div class="max-w-7xl mx-auto">
        <div class="flex flex-col md:flex-row items-center justify-between gap-6">
          <div class="flex items-center gap-2">
            <div class="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Heart class="h-5 w-5 text-white" />
            </div>
            <span class="text-xl font-bold text-white">SMART Bienestar</span>
          </div>
          <div class="flex items-center gap-6 text-gray-400 text-sm">
            <a href="#" class="hover:text-white transition-colors">Términos de uso</a>
            <a href="#" class="hover:text-white transition-colors">Privacidad</a>
            <a href="#" class="hover:text-white transition-colors">Contacto</a>
          </div>
          <div class="text-gray-500 text-sm">
            © 2026 SMART Bienestar. Todos los derechos reservados.
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
