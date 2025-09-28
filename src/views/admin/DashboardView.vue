<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
    <!-- Hero Section -->
    <div class="bg-white shadow-sm border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center shadow-lg">
              <TrendingUp class="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 class="text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
              <p class="text-lg text-gray-600 mt-1">Centro de control del bienestar corporativo</p>
            </div>
          </div>
          <div class="flex items-center space-x-3">
            <div class="bg-gradient-to-r from-green-100 to-emerald-100 px-4 py-2 rounded-xl border border-green-200">
              <div class="flex items-center">
                <div class="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                <span class="text-green-800 font-medium text-sm">Sistema Activo</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isLoading" class="flex items-center justify-center min-h-96">
      <div class="text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
        <p class="text-xl font-medium text-gray-700">Calculando métricas de bienestar...</p>
        <p class="text-gray-500 mt-2">Analizando datos del equipo</p>
      </div>
    </div>

    <div v-else-if="summary" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <!-- Wellness Score Hero Section -->
      <div class="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div class="bg-gradient-to-r from-primary/5 via-blue-50 to-indigo-50 px-8 py-6 border-b border-gray-100">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4">
              <Activity class="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 class="text-2xl font-bold text-gray-900">Índice de Bienestar General</h2>
              <p class="text-gray-600">Puntuación global del equipo basada en todas las métricas</p>
            </div>
          </div>
        </div>
        
        <div class="p-8">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <!-- Gauge -->
            <div class="flex justify-center">
              <ScoreGauge
                :score="summary.wellnessScore"
                title="Puntuación Global"
                description="Índice calculado en tiempo real"
                :trend="0.3"
              />
            </div>
            
            <!-- Insights -->
            <div class="space-y-6">
              <div>
                <h3 class="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Lightbulb class="h-6 w-6 text-yellow-500 mr-3" />
                  Insights Clave
                </h3>
                <div class="space-y-4">
                  <div v-for="insight in summary.insights" :key="insight.text" 
                       :class="[
                         'p-4 rounded-xl border-l-4 transition-all duration-200 hover:shadow-md',
                         insight.type === 'strength' 
                           ? 'bg-green-50 border-green-500 hover:bg-green-100' 
                           : 'bg-orange-50 border-orange-500 hover:bg-orange-100'
                       ]">
                    <div class="flex items-start">
                      <div :class="[
                        'w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0',
                        insight.type === 'strength' ? 'bg-green-100' : 'bg-orange-100'
                      ]">
                        <TrendingUp v-if="insight.type === 'strength'" class="h-4 w-4 text-green-600" />
                        <AlertTriangle v-else class="h-4 w-4 text-orange-600" />
                      </div>
                      <p :class="[
                        'text-sm font-medium leading-relaxed',
                        insight.type === 'strength' ? 'text-green-800' : 'text-orange-800'
                      ]">
                        {{ insight.text }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="pt-4 border-t border-gray-200">
                <Button 
                  @click="router.push('/admin/encuestas')" 
                  variant="primary"
                  class="w-full bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  <BarChart3 class="h-5 w-5 mr-2" />
                  Ver Análisis Completo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Metrics Breakdown -->
      <div class="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div class="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 px-8 py-6 border-b border-gray-100">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mr-4">
              <PieChart class="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 class="text-2xl font-bold text-gray-900">Desglose por Dimensiones</h2>
              <p class="text-gray-600">Análisis detallado de cada área de bienestar</p>
            </div>
          </div>
        </div>
        
        <div class="p-8">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <SubScoreCard 
              v-for="score in summary.subScores" 
              :key="score.titulo"
              :titulo="score.titulo"
              :puntuacion="score.puntuacion"
            />
          </div>
        </div>
      </div>

      <!-- Action Recommendations -->
      <div class="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div class="bg-gradient-to-r from-orange-50 via-amber-50 to-yellow-50 px-8 py-6 border-b border-gray-100">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center mr-4">
              <Target class="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 class="text-2xl font-bold text-gray-900">Recomendaciones Accionables</h2>
              <p class="text-gray-600">Servicios sugeridos basados en el análisis de datos</p>
            </div>
          </div>
        </div>
        
        <div class="p-8">
          <div class="space-y-6">
            <div v-for="rec in recomendaciones" :key="rec.id" 
                 class="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
              <div class="flex items-start justify-between">
                <div class="flex items-start space-x-4">
                  <div class="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Zap class="h-6 w-6 text-white" />
                  </div>
                  <div class="flex-1">
                    <h3 class="text-xl font-bold text-orange-900 mb-2">{{ rec.titulo }}</h3>
                    <p class="text-orange-800 leading-relaxed mb-4">{{ rec.descripcion }}</p>
                    <div class="flex items-center text-sm text-orange-700">
                      <Clock class="h-4 w-4 mr-2" />
                      <span>Implementación recomendada: Inmediata</span>
                    </div>
                  </div>
                </div>
                <Button 
                  @click="router.push('/admin/servicios')" 
                  class="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  <ExternalLink class="h-4 w-4 mr-2" />
                  Ver Servicio
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Platform Overview -->
      <div class="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div class="bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 px-8 py-6 border-b border-gray-100">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mr-4">
              <Layers class="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 class="text-2xl font-bold text-gray-900">Componentes de la Plataforma</h2>
              <p class="text-gray-600">Herramientas disponibles para gestionar el bienestar</p>
            </div>
          </div>
        </div>
        
        <div class="p-8">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Gestión de Encuestas -->
            <div class="group bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 border border-blue-200 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer"
                 @click="router.push('/admin/encuestas')">
              <div class="flex items-center mb-4">
                <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4">
                  <FileText class="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 class="text-lg font-bold text-blue-900">Encuestas</h3>
                  <p class="text-blue-700 text-sm">Pulso del equipo</p>
                </div>
              </div>
              <p class="text-blue-800 text-sm mb-4">Crea y gestiona encuestas de bienestar para obtener feedback valioso del equipo.</p>
              <div class="flex items-center justify-between">
                <div class="flex items-center text-blue-700">
                  <Users class="h-4 w-4 mr-2" />
                  <span class="text-sm font-medium">3 Encuestas Activas</span>
                </div>
                <ArrowRight class="h-5 w-5 text-blue-600 group-hover:translate-x-1 transition-transform duration-200" />
              </div>
            </div>

            <!-- Gestión de Empleados -->
            <div class="group bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6 border border-green-200 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer"
                 @click="router.push('/admin/empleados')">
              <div class="flex items-center mb-4">
                <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-4">
                  <Users class="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 class="text-lg font-bold text-green-900">Empleados</h3>
                  <p class="text-green-700 text-sm">Gestión de equipo</p>
                </div>
              </div>
              <p class="text-green-800 text-sm mb-4">Administra invitaciones, perfiles y el estado de todos los miembros del equipo.</p>
              <div class="flex items-center justify-between">
                <div class="flex items-center text-green-700">
                  <UserCheck class="h-4 w-4 mr-2" />
                  <span class="text-sm font-medium">50 Empleados Activos</span>
                </div>
                <ArrowRight class="h-5 w-5 text-green-600 group-hover:translate-x-1 transition-transform duration-200" />
              </div>
            </div>

            <!-- Sistema de Recompensas -->
            <div class="group bg-gradient-to-br from-purple-50 to-violet-100 rounded-2xl p-6 border border-purple-200 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer"
                 @click="router.push('/admin/recompensas')">
              <div class="flex items-center mb-4">
                <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center mr-4">
                  <Gift class="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 class="text-lg font-bold text-purple-900">Recompensas</h3>
                  <p class="text-purple-700 text-sm">Sistema de puntos</p>
                </div>
              </div>
              <p class="text-purple-800 text-sm mb-4">Gestiona el catálogo de recompensas y controla los canjes realizados por empleados.</p>
              <div class="flex items-center justify-between">
                <div class="flex items-center text-purple-700">
                  <Star class="h-4 w-4 mr-2" />
                  <span class="text-sm font-medium">10 Recompensas Activas</span>
                </div>
                <ArrowRight class="h-5 w-5 text-purple-600 group-hover:translate-x-1 transition-transform duration-200" />
              </div>
            </div>

            <!-- Comunicados -->
            <div class="group bg-gradient-to-br from-orange-50 to-red-100 rounded-2xl p-6 border border-orange-200 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer"
                 @click="router.push('/admin/comunicados')">
              <div class="flex items-center mb-4">
                <div class="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mr-4">
                  <Megaphone class="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 class="text-lg font-bold text-orange-900">Comunicados</h3>
                  <p class="text-orange-700 text-sm">Mensajería interna</p>
                </div>
              </div>
              <p class="text-orange-800 text-sm mb-4">Publica anuncios y mantén informado al equipo sobre mejoras y novedades.</p>
              <div class="flex items-center justify-between">
                <div class="flex items-center text-orange-700">
                  <MessageSquare class="h-4 w-4 mr-2" />
                  <span class="text-sm font-medium">5 Comunicados Activos</span>
                </div>
                <ArrowRight class="h-5 w-5 text-orange-600 group-hover:translate-x-1 transition-transform duration-200" />
              </div>
            </div>

            <!-- Servicios de Bienestar -->
            <div class="group bg-gradient-to-br from-teal-50 to-cyan-100 rounded-2xl p-6 border border-teal-200 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer"
                 @click="router.push('/admin/servicios')">
              <div class="flex items-center mb-4">
                <div class="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center mr-4">
                  <Heart class="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 class="text-lg font-bold text-teal-900">Servicios</h3>
                  <p class="text-teal-700 text-sm">Bienestar integral</p>
                </div>
              </div>
              <p class="text-teal-800 text-sm mb-4">Programa sesiones de mindfulness, yoga, coaching y otros servicios especializados.</p>
              <div class="flex items-center justify-between">
                <div class="flex items-center text-teal-700">
                  <Calendar class="h-4 w-4 mr-2" />
                  <span class="text-sm font-medium">3 Servicios Solicitados</span>
                </div>
                <ArrowRight class="h-5 w-5 text-teal-600 group-hover:translate-x-1 transition-transform duration-200" />
              </div>
            </div>

            <!-- Analytics y Reportes -->
            <div class="group bg-gradient-to-br from-pink-50 to-rose-100 rounded-2xl p-6 border border-pink-200 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer"
                 @click="router.push('/admin/encuestas')">
              <div class="flex items-center mb-4">
                <div class="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center mr-4">
                  <BarChart3 class="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 class="text-lg font-bold text-pink-900">Analytics</h3>
                  <p class="text-pink-700 text-sm">Datos e insights</p>
                </div>
              </div>
              <p class="text-pink-800 text-sm mb-4">Accede a reportes detallados, tendencias y análisis predictivo del bienestar.</p>
              <div class="flex items-center justify-between">
                <div class="flex items-center text-pink-700">
                  <TrendingUp class="h-4 w-4 mr-2" />
                  <span class="text-sm font-medium">Reportes Disponibles</span>
                </div>
                <ArrowRight class="h-5 w-5 text-pink-600 group-hover:translate-x-1 transition-transform duration-200" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div class="bg-gradient-to-r from-gray-50 via-slate-50 to-gray-100 px-8 py-6 border-b border-gray-100">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-gradient-to-br from-gray-600 to-slate-700 rounded-xl flex items-center justify-center mr-4">
              <Zap class="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 class="text-2xl font-bold text-gray-900">Acciones Rápidas</h2>
              <p class="text-gray-600">Herramientas más utilizadas para gestión diaria</p>
            </div>
          </div>
        </div>
        
        <div class="p-8">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button 
              @click="router.push('/admin/encuestas/crear')" 
              class="h-20 bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 flex flex-col items-center justify-center space-y-2"
            >
              <Plus class="h-6 w-6" />
              <span class="font-semibold">Crear Encuesta</span>
            </Button>
            
            <Button 
              @click="router.push('/admin/empleados')" 
              class="h-20 bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 flex flex-col items-center justify-center space-y-2"
            >
              <UserPlus class="h-6 w-6" />
              <span class="font-semibold">Gestionar Empleados</span>
            </Button>
            
            <Button 
              @click="router.push('/admin/recompensas')" 
              class="h-20 bg-gradient-to-br from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 flex flex-col items-center justify-center space-y-2"
            >
              <Gift class="h-6 w-6" />
              <span class="font-semibold">Gestionar Recompensas</span>
            </Button>
            
            <Button 
              @click="router.push('/admin/comunicados/crear')" 
              class="h-20 bg-gradient-to-br from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 flex flex-col items-center justify-center space-y-2"
            >
              <Megaphone class="h-6 w-6" />
              <span class="font-semibold">Crear Comunicado</span>
            </Button>
          </div>
        </div>
      </div>

      <!-- Recent Activity Feed -->
      <div class="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div class="bg-gradient-to-r from-violet-50 via-purple-50 to-fuchsia-50 px-8 py-6 border-b border-gray-100">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                <Activity class="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 class="text-2xl font-bold text-gray-900">Actividad Reciente</h2>
                <p class="text-gray-600">Últimas acciones en la plataforma</p>
              </div>
            </div>
            <Button variant="outline" class="border-violet-300 text-violet-700 hover:bg-violet-50">
              <Eye class="h-4 w-4 mr-2" />
              Ver Todo
            </Button>
          </div>
        </div>
        
        <div class="p-8">
          <div class="space-y-4">
            <!-- Activity Item 1 -->
            <div class="flex items-center p-4 bg-green-50 rounded-xl border border-green-200">
              <div class="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-4">
                <CheckCircle class="h-5 w-5 text-white" />
              </div>
              <div class="flex-1">
                <p class="font-medium text-green-900">Nueva encuesta completada</p>
                <p class="text-green-700 text-sm">42 empleados respondieron la "Encuesta de Pulso Q3"</p>
              </div>
              <span class="text-green-600 text-sm font-medium">Hace 2 horas</span>
            </div>

            <!-- Activity Item 2 -->
            <div class="flex items-center p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                <Calendar class="h-5 w-5 text-white" />
              </div>
              <div class="flex-1">
                <p class="font-medium text-blue-900">Sesión de mindfulness programada</p>
                <p class="text-blue-700 text-sm">Nueva sesión disponible para el viernes 17 de enero</p>
              </div>
              <span class="text-blue-600 text-sm font-medium">Hace 4 horas</span>
            </div>

            <!-- Activity Item 3 -->
            <div class="flex items-center p-4 bg-purple-50 rounded-xl border border-purple-200">
              <div class="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center mr-4">
                <Gift class="h-5 w-5 text-white" />
              </div>
              <div class="flex-1">
                <p class="font-medium text-purple-900">Recompensa canjeada</p>
                <p class="text-purple-700 text-sm">Ana García canjeó "Masaje Relajante" por 300 puntos</p>
              </div>
              <span class="text-purple-600 text-sm font-medium">Hace 1 día</span>
            </div>

            <!-- Activity Item 4 -->
            <div class="flex items-center p-4 bg-orange-50 rounded-xl border border-orange-200">
              <div class="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center mr-4">
                <Megaphone class="h-5 w-5 text-white" />
              </div>
              <div class="flex-1">
                <p class="font-medium text-orange-900">Comunicado publicado</p>
                <p class="text-orange-700 text-sm">"Nuevas mejoras en la sala de bienestar" enviado a todo el equipo</p>
              </div>
              <span class="text-orange-600 text-sm font-medium">Hace 2 días</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="text-center bg-white rounded-3xl shadow-xl p-12">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <BarChart3 class="h-8 w-8 text-gray-400" />
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">No hay datos suficientes</h3>
        <p class="text-gray-600 mb-6">Necesitamos más respuestas de encuestas para generar un análisis completo.</p>
        <Button 
          @click="router.push('/admin/encuestas/crear')"
          class="bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
        >
          <Plus class="h-5 w-5 mr-2" />
          Crear Primera Encuesta
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Button from '@/components/ui/Button.vue';
import SubScoreCard from '@/components/admin/SubScoreCard.vue';
import ScoreGauge from '@/components/admin/ScoreGauge.vue';
import { getAnalyticsSummary } from '@/services/mock/analytics.service.js';
import { 
  TrendingUp, 
  Activity, 
  Lightbulb, 
  AlertTriangle, 
  BarChart3, 
  PieChart,
  Target,
  Zap,
  Clock,
  ExternalLink,
  Layers,
  FileText,
  Users,
  UserCheck,
  UserPlus,
  Gift,
  Star,
  Megaphone,
  MessageSquare,
  Heart,
  Calendar,
  ArrowRight,
  Plus,
  Eye,
  CheckCircle
} from 'lucide-vue-next';

// --- Inicialización ---
const router = useRouter();
const summary = ref(null);
const isLoading = ref(true);

// --- Simulación de Recomendaciones ---
const recomendaciones = ref([
  { 
    id: 'serv-01', 
    titulo: 'Taller de Mindfulness y Gestión del Estrés', 
    descripcion: 'Programa especializado para reducir los niveles de estrés detectados en el equipo. Incluye técnicas de respiración, meditación guiada y estrategias de manejo emocional aplicables al entorno laboral.' 
  }
]);

// --- Carga de Datos ---
onMounted(async () => {
  isLoading.value = true;
  try {
    summary.value = await getAnalyticsSummary();
  } catch (error) {
    console.error("Error al cargar el resumen de analítica:", error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
/* Animaciones personalizadas */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

/* Gradientes personalizados */
.bg-gradient-wellness {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Efectos de hover mejorados */
.hover-lift:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Transiciones suaves */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}
</style>