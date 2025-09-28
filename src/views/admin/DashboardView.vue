<template>
  <div class="space-y-8">
    <!-- Hero Section -->
    <div class="relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-blue-900 rounded-2xl shadow-2xl">
      <div class="absolute inset-0 bg-black/10"></div>
      <div class="relative px-8 py-12">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-6">
            <div class="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <LayoutDashboard class="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 class="text-4xl font-bold text-white mb-2">Dashboard Administrativo</h1>
              <p class="text-xl text-white/80">Gestiona el bienestar de tu organización</p>
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

    <!-- Wellness Overview Section -->
    <div class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div class="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b border-gray-200">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4">
            <TrendingUp class="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 class="text-2xl font-bold text-gray-900">Índice de Bienestar General</h2>
            <p class="text-gray-600">Puntuación global basada en todas las métricas de bienestar del equipo</p>
          </div>
        </div>
      </div>
      
      <div class="p-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Wellness Score Gauge -->
          <div class="text-center">
            <ScoreGauge 
              :score="7.2" 
              title="Índice de Bienestar"
              description="Puntuación global del equipo"
              :trend="0.3"
            />
          </div>
          
          <!-- Key Insights -->
          <div class="space-y-4">
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Insights Clave</h3>
            
            <InsightCard 
              :insight="{
                type: 'strength',
                title: 'Comunicación Excelente',
                description: 'La comunicación (8.3) es el punto más fuerte del equipo.',
                icon: '💬',
                score: 8.3
              }"
            />
            
            <InsightCard 
              :insight="{
                type: 'weakness', 
                title: 'Oportunidad en Salud Mental',
                description: 'La salud mental (5.8) es el área con mayor oportunidad de mejora.',
                icon: '🧠',
                score: 5.8
              }"
            />
            
            <div class="pt-4">
              <Button 
                @click="router.push('/admin/encuestas/enc-01/resultados')"
                variant="outline"
                class="w-full"
              >
                <BarChart3 class="h-4 w-4 mr-2" />
                Ver Análisis Completo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Wellness Dimensions Breakdown -->
    <div class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div class="bg-gradient-to-r from-gray-50 to-blue-50 px-8 py-6 border-b border-gray-200">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl flex items-center justify-center mr-4">
            <BarChart3 class="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 class="text-2xl font-bold text-gray-900">Dimensiones de Medición</h2>
            <p class="text-gray-600">Desglose detallado de las métricas que componen el índice general</p>
          </div>
        </div>
      </div>
      
      <div class="p-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Comunicación -->
          <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <MessageSquare class="h-6 w-6 text-white" />
              </div>
              <div class="text-right">
                <div class="text-2xl font-bold text-green-700">8.3</div>
                <div class="text-green-600 text-sm">/10</div>
              </div>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Comunicación</h3>
            <p class="text-sm text-gray-600 mb-4">Excelente nivel de comunicación interna</p>
            <div class="w-full bg-green-200 rounded-full h-2">
              <div class="bg-green-500 h-2 rounded-full transition-all duration-1000 ease-out" style="width: 83%"></div>
            </div>
          </div>

          <!-- Ergonomía -->
          <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <Monitor class="h-6 w-6 text-white" />
              </div>
              <div class="text-right">
                <div class="text-2xl font-bold text-blue-700">8.0</div>
                <div class="text-blue-600 text-sm">/10</div>
              </div>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Ergonomía</h3>
            <p class="text-sm text-gray-600 mb-4">Buen nivel de confort en puestos</p>
            <div class="w-full bg-blue-200 rounded-full h-2">
              <div class="bg-blue-500 h-2 rounded-full transition-all duration-1000 ease-out" style="width: 80%"></div>
            </div>
          </div>

          <!-- Carga Laboral -->
          <div class="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
                <Clock class="h-6 w-6 text-white" />
              </div>
              <div class="text-right">
                <div class="text-2xl font-bold text-yellow-700">6.5</div>
                <div class="text-yellow-600 text-sm">/10</div>
              </div>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Carga Laboral</h3>
            <p class="text-sm text-gray-600 mb-4">Nivel moderado de carga de trabajo</p>
            <div class="w-full bg-yellow-200 rounded-full h-2">
              <div class="bg-yellow-500 h-2 rounded-full transition-all duration-1000 ease-out" style="width: 65%"></div>
            </div>
          </div>

          <!-- Salud Mental -->
          <div class="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 border border-red-200">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
                <Brain class="h-6 w-6 text-white" />
              </div>
              <div class="text-right">
                <div class="text-2xl font-bold text-red-700">5.8</div>
                <div class="text-red-600 text-sm">/10</div>
              </div>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Salud Mental</h3>
            <p class="text-sm text-gray-600 mb-4">Área de oportunidad identificada</p>
            <div class="w-full bg-red-200 rounded-full h-2">
              <div class="bg-red-500 h-2 rounded-full transition-all duration-1000 ease-out" style="width: 58%"></div>
            </div>
          </div>
        </div>

        <!-- Formula Explanation -->
        <div class="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
          <div class="text-center">
            <h4 class="text-lg font-semibold text-gray-900 mb-3">Cálculo del Índice General</h4>
            <div class="flex items-center justify-center space-x-2 text-lg font-mono">
              <span class="px-3 py-1 bg-green-100 text-green-800 rounded-lg">8.3</span>
              <span class="text-gray-500">+</span>
              <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg">8.0</span>
              <span class="text-gray-500">+</span>
              <span class="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-lg">6.5</span>
              <span class="text-gray-500">+</span>
              <span class="px-3 py-1 bg-red-100 text-red-800 rounded-lg">5.8</span>
              <span class="text-gray-500">÷ 4 =</span>
              <span class="px-4 py-2 bg-primary text-white rounded-lg font-bold">7.2</span>
            </div>
            <p class="text-sm text-gray-500 mt-3">
              Promedio de las cuatro dimensiones principales de bienestar organizacional
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Platform Components Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Surveys Management -->
      <div class="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div class="bg-gradient-to-br from-blue-500 to-blue-600 p-6">
          <div class="flex items-center justify-between">
            <div class="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <FileText class="h-7 w-7 text-white" />
            </div>
            <div class="text-right">
              <div class="text-3xl font-bold text-white">3</div>
              <div class="text-blue-100 text-sm">Encuestas</div>
            </div>
          </div>
        </div>
        <div class="p-6">
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Gestión de Encuestas</h3>
          <p class="text-gray-600 mb-4">Crea y analiza encuestas de bienestar para obtener insights valiosos</p>
          <div class="flex items-center justify-between">
            <div class="flex items-center text-sm text-gray-500">
              <CheckCircle class="h-4 w-4 mr-1 text-green-500" />
              <span>1 Activa</span>
            </div>
            <Button 
              @click="router.push('/admin/encuestas')"
              variant="outline"
              class="group-hover:bg-blue-50 group-hover:border-blue-200"
            >
              <ArrowRight class="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>

      <!-- Employee Management -->
      <div class="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div class="bg-gradient-to-br from-green-500 to-emerald-600 p-6">
          <div class="flex items-center justify-between">
            <div class="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Users class="h-7 w-7 text-white" />
            </div>
            <div class="text-right">
              <div class="text-3xl font-bold text-white">50</div>
              <div class="text-green-100 text-sm">Empleados</div>
            </div>
          </div>
        </div>
        <div class="p-6">
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Gestión de Empleados</h3>
          <p class="text-gray-600 mb-4">Administra tu equipo e invita nuevos miembros a la plataforma</p>
          <div class="flex items-center justify-between">
            <div class="flex items-center text-sm text-gray-500">
              <UserCheck class="h-4 w-4 mr-1 text-green-500" />
              <span>42 Activos</span>
            </div>
            <Button 
              @click="router.push('/admin/empleados')"
              variant="outline"
              class="group-hover:bg-green-50 group-hover:border-green-200"
            >
              <ArrowRight class="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>

      <!-- Rewards System -->
      <div class="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div class="bg-gradient-to-br from-purple-500 to-purple-600 p-6">
          <div class="flex items-center justify-between">
            <div class="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Gift class="h-7 w-7 text-white" />
            </div>
            <div class="text-right">
              <div class="text-3xl font-bold text-white">10</div>
              <div class="text-purple-100 text-sm">Recompensas</div>
            </div>
          </div>
        </div>
        <div class="p-6">
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Sistema de Recompensas</h3>
          <p class="text-gray-600 mb-4">Motiva a tu equipo con un catálogo de recompensas atractivas</p>
          <div class="flex items-center justify-between">
            <div class="flex items-center text-sm text-gray-500">
              <Star class="h-4 w-4 mr-1 text-yellow-500" />
              <span>4 Canjeadas</span>
            </div>
            <Button 
              @click="router.push('/admin/recompensas')"
              variant="outline"
              class="group-hover:bg-purple-50 group-hover:border-purple-200"
            >
              <ArrowRight class="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>

      <!-- Communications -->
      <div class="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div class="bg-gradient-to-br from-orange-500 to-red-500 p-6">
          <div class="flex items-center justify-between">
            <div class="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Megaphone class="h-7 w-7 text-white" />
            </div>
            <div class="text-right">
              <div class="text-3xl font-bold text-white">1</div>
              <div class="text-orange-100 text-sm">Comunicados</div>
            </div>
          </div>
        </div>
        <div class="p-6">
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Comunicados</h3>
          <p class="text-gray-600 mb-4">Mantén informado a tu equipo con comunicados importantes</p>
          <div class="flex items-center justify-between">
            <div class="flex items-center text-sm text-gray-500">
              <Clock class="h-4 w-4 mr-1 text-orange-500" />
              <span>Hace 2 días</span>
            </div>
            <Button 
              @click="router.push('/admin/comunicados')"
              variant="outline"
              class="group-hover:bg-orange-50 group-hover:border-orange-200"
            >
              <ArrowRight class="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>

      <!-- Wellness Services -->
      <div class="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div class="bg-gradient-to-br from-teal-500 to-cyan-600 p-6">
          <div class="flex items-center justify-between">
            <div class="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <HeartHandshake class="h-7 w-7 text-white" />
            </div>
            <div class="text-right">
              <div class="text-3xl font-bold text-white">3</div>
              <div class="text-teal-100 text-sm">Servicios</div>
            </div>
          </div>
        </div>
        <div class="p-6">
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Servicios de Bienestar</h3>
          <p class="text-gray-600 mb-4">Programa sesiones especializadas basadas en las necesidades del equipo</p>
          <div class="flex items-center justify-between">
            <div class="flex items-center text-sm text-gray-500">
              <Calendar class="h-4 w-4 mr-1 text-teal-500" />
              <span>2 Programadas</span>
            </div>
            <Button 
              @click="router.push('/admin/servicios')"
              variant="outline"
              class="group-hover:bg-teal-50 group-hover:border-teal-200"
            >
              <ArrowRight class="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>

      <!-- Analytics & Reports -->
      <div class="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div class="bg-gradient-to-br from-pink-500 to-rose-600 p-6">
          <div class="flex items-center justify-between">
            <div class="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <BarChart3 class="h-7 w-7 text-white" />
            </div>
            <div class="text-right">
              <div class="text-3xl font-bold text-white">85%</div>
              <div class="text-pink-100 text-sm">Participación</div>
            </div>
          </div>
        </div>
        <div class="p-6">
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Analytics & Reportes</h3>
          <p class="text-gray-600 mb-4">Analiza tendencias y genera reportes detallados de bienestar</p>
          <div class="flex items-center justify-between">
            <div class="flex items-center text-sm text-gray-500">
              <TrendingUp class="h-4 w-4 mr-1 text-green-500" />
              <span>+12% vs anterior</span>
            </div>
            <Button 
              @click="router.push('/admin/encuestas/enc-01/resultados')"
              variant="outline"
              class="group-hover:bg-pink-50 group-hover:border-pink-200"
            >
              <ArrowRight class="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions Section -->
    <div class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div class="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl flex items-center justify-center mr-4">
            <Zap class="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 class="text-2xl font-bold text-gray-900">Acciones Rápidas</h2>
            <p class="text-gray-600">Tareas frecuentes para gestionar la plataforma</p>
          </div>
        </div>
      </div>
      
      <div class="p-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Create Survey -->
          <Button 
            @click="router.push('/admin/encuestas/crear')"
            class="h-24 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <div class="flex flex-col items-center">
              <Plus class="h-8 w-8 mb-2" />
              <span class="font-semibold">Nueva Encuesta</span>
            </div>
          </Button>

          <!-- Invite Employees -->
          <Button 
            @click="router.push('/admin/empleados')"
            class="h-24 bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <div class="flex flex-col items-center">
              <UserPlus class="h-8 w-8 mb-2" />
              <span class="font-semibold">Invitar Empleados</span>
            </div>
          </Button>

          <!-- Create Reward -->
          <Button 
            @click="router.push('/admin/recompensas')"
            class="h-24 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <div class="flex flex-col items-center">
              <Gift class="h-8 w-8 mb-2" />
              <span class="font-semibold">Nueva Recompensa</span>
            </div>
          </Button>

          <!-- Send Communication -->
          <Button 
            @click="router.push('/admin/comunicados/crear')"
            class="h-24 bg-gradient-to-br from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <div class="flex flex-col items-center">
              <Send class="h-8 w-8 mb-2" />
              <span class="font-semibold">Nuevo Comunicado</span>
            </div>
          </Button>
        </div>
      </div>
    </div>

    <!-- Recent Activity Feed -->
    <div class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div class="bg-gradient-to-r from-indigo-50 to-purple-50 px-8 py-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
              <Activity class="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 class="text-2xl font-bold text-gray-900">Actividad Reciente</h2>
              <p class="text-gray-600">Últimas acciones en la plataforma</p>
            </div>
          </div>
          <Button variant="outline" class="text-sm">
            Ver Todo
          </Button>
        </div>
      </div>
      
      <div class="p-8">
        <div class="space-y-6">
          <!-- Activity Item 1 -->
          <div class="flex items-start space-x-4 p-4 bg-green-50 rounded-xl border border-green-200">
            <div class="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle class="h-5 w-5 text-white" />
            </div>
            <div class="flex-1">
              <p class="text-gray-900 font-medium">Nueva respuesta a encuesta recibida</p>
              <p class="text-gray-600 text-sm">Ana García completó "Pulso de Bienestar Semanal"</p>
              <p class="text-gray-500 text-xs mt-1">Hace 2 horas</p>
            </div>
          </div>

          <!-- Activity Item 2 -->
          <div class="flex items-start space-x-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Calendar class="h-5 w-5 text-white" />
            </div>
            <div class="flex-1">
              <p class="text-gray-900 font-medium">Sesión de mindfulness programada</p>
              <p class="text-gray-600 text-sm">Taller programado para el viernes 17 de enero</p>
              <p class="text-gray-500 text-xs mt-1">Hace 1 día</p>
            </div>
          </div>

          <!-- Activity Item 3 -->
          <div class="flex items-start space-x-4 p-4 bg-purple-50 rounded-xl border border-purple-200">
            <div class="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Gift class="h-5 w-5 text-white" />
            </div>
            <div class="flex-1">
              <p class="text-gray-900 font-medium">Recompensa canjeada</p>
              <p class="text-gray-600 text-sm">Carlos López canjeó "Almuerzo Premium" (150 puntos)</p>
              <p class="text-gray-500 text-xs mt-1">Hace 3 días</p>
            </div>
          </div>

          <!-- Activity Item 4 -->
          <div class="flex items-start space-x-4 p-4 bg-orange-50 rounded-xl border border-orange-200">
            <div class="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Megaphone class="h-5 w-5 text-white" />
            </div>
            <div class="flex-1">
              <p class="text-gray-900 font-medium">Comunicado publicado</p>
              <p class="text-gray-600 text-sm">"Bienvenida a la nueva plataforma" enviado a 50 empleados</p>
              <p class="text-gray-500 text-xs mt-1">Hace 1 semana</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { 
  LayoutDashboard, 
  TrendingUp, 
  FileText, 
  Users, 
  Gift, 
  Megaphone,
  HeartHandshake,
  Calendar,
  BarChart3,
  CheckCircle,
  UserCheck,
  Star,
  Clock,
  ArrowRight,
  Zap,
  Plus,
  UserPlus,
  Send,
  Activity,
  MessageSquare,
  Monitor,
  Brain
} from 'lucide-vue-next';
import Button from '@/components/common/Button.vue';
import ScoreGauge from '@/components/admin/ScoreGauge.vue';
import InsightCard from '@/components/admin/InsightCard.vue';

const router = useRouter();
</script>

<style scoped>
/* Custom animations and effects */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

/* Gradient text effect */
.gradient-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Enhanced hover effects */
.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}

/* Custom shadows */
.shadow-glow {
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
}

/* Backdrop blur support */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}
</style>