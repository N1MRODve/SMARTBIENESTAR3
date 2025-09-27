<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header con navegación -->
    <div class="bg-white shadow-sm border-b border-gray-200 mb-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo y título -->
          <div class="flex items-center">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <BarChart3 class="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 class="text-xl font-bold text-gray-900">
                  SMART<span class="text-primary">Bienestar</span>
                </h1>
                <p class="text-xs text-gray-500">Mi Dashboard</p>
              </div>
            </div>
          </div>

          <!-- Navegación -->
          <div class="flex items-center space-x-4">
            <!-- Contador de Puntos -->
            <div class="flex items-center bg-gradient-to-r from-yellow-100 to-yellow-200 px-4 py-2 rounded-lg border border-yellow-300">
              <svg class="w-5 h-5 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              <span class="text-lg font-bold text-yellow-800">{{ puntosUsuario }} Puntos</span>
            </div>
            
            <router-link 
              to="/empleado/dashboard"
              class="bg-primary text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Dashboard
            </router-link>
            <router-link 
              to="/empleado/encuesta"
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Encuestas
            </router-link>
            <router-link 
              to="/empleado/actividades"
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Actividades
            </router-link>
            <router-link 
              to="/empleado/apoyo-personal"
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Apoyo Personal
            </router-link>
            <router-link 
              to="/empleado/recompensas"
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Recompensas
            </router-link>
            
            <!-- Botón Cerrar Sesión -->
            <button
              @click="handleLogout"
              :disabled="loggingOut"
              class="inline-flex items-center px-4 py-2 border border-red-300 rounded-lg text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogOut class="w-4 h-4 mr-2" />
              <span class="hidden sm:inline">{{ loggingOut ? 'Cerrando...' : 'Cerrar Sesión' }}</span>
              <span class="sm:hidden">{{ loggingOut ? '...' : 'Salir' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- 1. CABECERA DE BIENVENIDA Y ESTADO -->
        <div class="mb-12">
          <div class="bg-gradient-to-r from-primary to-primary-dark rounded-2xl shadow-xl text-white p-8">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <h1 class="text-4xl font-bold mb-2">
                  ¡Hola, {{ nombreEmpleado }}! 👋
                </h1>
                <p class="text-xl text-white/90 mb-4">
                  Bienvenido a tu centro de bienestar personal
                </p>
                <div class="flex items-center text-white/80">
                  <Calendar class="h-5 w-5 mr-2" />
                  <span>{{ fechaActual }}</span>
                </div>
              </div>
              
              <!-- Saldo de Puntos Prominente -->
              <div class="text-center">
                <div class="bg-white/20 rounded-2xl p-6 backdrop-blur-sm">
                  <div class="flex items-center justify-center mb-2">
                    <svg class="w-8 h-8 text-yellow-300 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    <span class="text-sm text-white/80">Mis Puntos</span>
                  </div>
                  <p class="text-4xl font-bold text-white">{{ puntosUsuario }}</p>
                  <p class="text-sm text-white/80 mt-1">Puntos de Bienestar</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="bg-white rounded-lg shadow-sm p-12 text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent mx-auto mb-4"></div>
          <p class="text-gray-600">Cargando tu dashboard personalizado...</p>
        </div>

        <!-- Dashboard Content -->
        <div v-else class="space-y-12">
          <!-- 2. SECCIÓN PRINCIPAL: ACCIONES PENDIENTES -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Encuesta Pendiente -->
            <div class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div class="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6">
                <div class="flex items-center">
                  <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                    <FileText class="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 class="text-xl font-bold">Encuesta Pendiente</h3>
                    <p class="text-orange-100">Tu opinión es importante</p>
                  </div>
                </div>
              </div>
              
              <div class="p-6">
                <div v-if="encuestaPendiente" class="space-y-4">
                  <div>
                    <h4 class="text-lg font-semibold text-gray-900 mb-2">
                      {{ encuestaPendiente.titulo }}
                    </h4>
                    <p class="text-gray-600 leading-relaxed">
                      {{ encuestaPendiente.descripcion || 'Comparte tu experiencia para ayudarnos a mejorar el ambiente laboral' }}
                    </p>
                  </div>
                  
                  <div class="flex items-center text-sm text-gray-500 space-x-4">
                    <div class="flex items-center">
                      <HelpCircle class="h-4 w-4 mr-1" />
                      <span>{{ encuestaPendiente.preguntas?.length || 3 }} preguntas</span>
                    </div>
                    <div class="flex items-center">
                      <Clock class="h-4 w-4 mr-1" />
                      <span>~5 minutos</span>
                    </div>
                  </div>
                  
                  <div class="pt-4 border-t border-gray-200">
                    <Button 
                      @click="router.push('/empleado/encuesta')"
                      class="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3"
                    >
                      <Send class="h-4 w-4 mr-2" />
                      Responder Ahora (+10 puntos)
                    </Button>
                  </div>
                </div>
                
                <div v-else class="text-center py-8">
                  <CheckCircle class="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h4 class="text-lg font-medium text-gray-900 mb-2">¡Todo al día!</h4>
                  <p class="text-gray-600">No tienes encuestas pendientes en este momento</p>
                </div>
              </div>
            </div>

            <!-- Próximas Sesiones Reservadas -->
            <div class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div class="bg-gradient-to-r from-green-500 to-teal-500 text-white p-6">
                <div class="flex items-center">
                  <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                    <Calendar class="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 class="text-xl font-bold">Mis Próximas Sesiones</h3>
                    <p class="text-green-100">Actividades reservadas</p>
                  </div>
                </div>
              </div>
              
              <div class="p-6">
                <div v-if="proximasSesiones.length > 0" class="space-y-4">
                  <div 
                    v-for="sesion in proximasSesiones" 
                    :key="sesion.id"
                    class="p-4 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors duration-200"
                  >
                    <div class="flex items-center justify-between">
                      <div class="flex-1">
                        <h4 class="font-semibold text-gray-900">{{ sesion.titulo }}</h4>
                        <div class="flex items-center text-sm text-gray-600 mt-1">
                          <Clock class="h-4 w-4 mr-1" />
                          <span>{{ formatearFechaSesion(sesion.fecha, sesion.hora) }}</span>
                        </div>
                        <div class="flex items-center text-sm text-gray-500 mt-1">
                          <MapPin class="h-4 w-4 mr-1" />
                          <span>{{ sesion.tipo === 'personal' ? 'Sesión Confidencial' : sesion.modalidad === 'virtual' ? 'Sesión Virtual' : sesion.ubicacion }}</span>
                        </div>
                      </div>
                      <div class="text-right">
                        <span :class="[
                          'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                          sesion.tipo === 'personal' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                        ]">
                          Confirmada
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div class="pt-4 border-t border-gray-200">
                    <Button 
                      @click="router.push('/empleado/actividades')"
                      variant="outline"
                      class="w-full"
                    >
                      <Calendar class="h-4 w-4 mr-2" />
                      Ver Todas Mis Reservas
                    </Button>
                  </div>
                </div>
                
                <div v-else class="text-center py-8">
                  <Calendar class="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 class="text-lg font-medium text-gray-900 mb-2">Sin sesiones reservadas</h4>
                  <p class="text-gray-600 mb-4">Explora las actividades disponibles y reserva tu plaza</p>
                  <Button 
                    @click="router.push('/empleado/actividades')"
                    variant="outline"
                  >
                    <Plus class="h-4 w-4 mr-2" />
                    Explorar Actividades
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <!-- 3. SECCIÓN SECUNDARIA: NOVEDADES Y OPORTUNIDADES -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Últimos Comunicados -->
            <div class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div class="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-6">
                <div class="flex items-center">
                  <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                    <Megaphone class="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 class="text-xl font-bold">Últimos Comunicados</h3>
                    <p class="text-blue-100">Novedades de la empresa</p>
                  </div>
                </div>
              </div>
              
              <div class="p-6">
                <div v-if="comunicadosRecientes.length > 0" class="space-y-4">
                  <div 
                    v-for="comunicado in comunicadosRecientes" 
                    :key="comunicado.id"
                    class="p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors duration-200"
                  >
                    <div class="flex items-start">
                      <div class="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <Megaphone class="h-4 w-4 text-blue-600" />
                      </div>
                      <div class="flex-1 min-w-0">
                        <h4 class="font-semibold text-gray-900 mb-1">{{ comunicado.titulo }}</h4>
                        <p class="text-sm text-gray-600 line-clamp-2">
                          {{ comunicado.contenido }}
                        </p>
                        <div class="flex items-center text-xs text-gray-500 mt-2">
                          <Clock class="h-3 w-3 mr-1" />
                          <span>{{ formatearTiempoTranscurrido(comunicado.fechaCreacion) }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="pt-4 border-t border-gray-200">
                    <Button 
                      @click="verTodosComunicados"
                      variant="outline"
                      class="w-full"
                    >
                      <MessageSquare class="h-4 w-4 mr-2" />
                      Ver Todos los Comunicados
                    </Button>
                  </div>
                </div>
                
                <div v-else class="text-center py-8">
                  <Megaphone class="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 class="text-lg font-medium text-gray-900 mb-2">Sin comunicados recientes</h4>
                  <p class="text-gray-600">Los anuncios de la empresa aparecerán aquí</p>
                </div>
              </div>
            </div>

            <!-- Nuevas Actividades Disponibles -->
            <div class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div class="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6">
                <div class="flex items-center">
                  <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                    <Sparkles class="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 class="text-xl font-bold">Nuevas Actividades</h3>
                    <p class="text-purple-100">Plazas disponibles</p>
                  </div>
                </div>
              </div>
              
              <div class="p-6">
                <div v-if="nuevasActividades.length > 0" class="space-y-4">
                  <div 
                    v-for="actividad in nuevasActividades" 
                    :key="actividad.id"
                    class="p-4 bg-purple-50 rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors duration-200"
                  >
                    <div class="flex items-center justify-between">
                      <div class="flex-1">
                        <h4 class="font-semibold text-gray-900">{{ actividad.titulo }}</h4>
                        <div class="flex items-center text-sm text-gray-600 mt-1">
                          <Calendar class="h-4 w-4 mr-1" />
                          <span>{{ formatearFecha(actividad.fecha) }}</span>
                        </div>
                        <div class="flex items-center text-sm text-gray-500 mt-1">
                          <Users class="h-4 w-4 mr-1" />
                          <span>{{ getPlazasDisponibles(actividad) }} plazas disponibles</span>
                        </div>
                      </div>
                      <div class="text-right">
                        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          ¡Nuevo!
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div class="pt-4 border-t border-gray-200">
                    <Button 
                      @click="router.push('/empleado/actividades')"
                      variant="outline"
                      class="w-full"
                    >
                      <Sparkles class="h-4 w-4 mr-2" />
                      Ver Todas las Actividades
                    </Button>
                  </div>
                </div>
                
                <div v-else class="text-center py-8">
                  <Sparkles class="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 class="text-lg font-medium text-gray-900 mb-2">Sin nuevas actividades</h4>
                  <p class="text-gray-600 mb-4">Te notificaremos cuando haya nuevas sesiones disponibles</p>
                  <Button 
                    @click="router.push('/empleado/actividades')"
                    variant="outline"
                  >
                    <Calendar class="h-4 w-4 mr-2" />
                    Ver Actividades Actuales
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <!-- 4. SECCIÓN DE ACCESOS DIRECTOS -->
          <div class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div class="flex items-center">
                <Zap class="h-5 w-5 text-gray-600 mr-2" />
                <h3 class="text-lg font-semibold text-gray-900">Accesos Directos</h3>
              </div>
              <p class="text-sm text-gray-500 mt-1">Herramientas principales para tu bienestar</p>
            </div>
            
            <div class="p-6">
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <!-- Ver Actividades -->
                <button
                  @click="router.push('/empleado/actividades')"
                  class="group p-6 bg-blue-50 rounded-xl border border-blue-200 hover:bg-blue-100 hover:shadow-md transition-all duration-200 text-center"
                >
                  <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-200 transition-colors duration-200">
                    <Calendar class="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 class="font-semibold text-gray-900 text-sm mb-1">Actividades</h4>
                  <p class="text-xs text-gray-600">Reservar sesiones</p>
                </button>

                <!-- Explorar Recompensas -->
                <button
                  @click="router.push('/empleado/recompensas')"
                  class="group p-6 bg-yellow-50 rounded-xl border border-yellow-200 hover:bg-yellow-100 hover:shadow-md transition-all duration-200 text-center"
                >
                  <div class="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-yellow-200 transition-colors duration-200">
                    <Gift class="h-6 w-6 text-yellow-600" />
                  </div>
                  <h4 class="font-semibold text-gray-900 text-sm mb-1">Recompensas</h4>
                  <p class="text-xs text-gray-600">Canjear puntos</p>
                </button>

                <!-- Apoyo Profesional -->
                <button
                  @click="router.push('/empleado/apoyo-personal')"
                  class="group p-6 bg-green-50 rounded-xl border border-green-200 hover:bg-green-100 hover:shadow-md transition-all duration-200 text-center"
                >
                  <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-green-200 transition-colors duration-200">
                    <Heart class="h-6 w-6 text-green-600" />
                  </div>
                  <h4 class="font-semibold text-gray-900 text-sm mb-1">Apoyo Personal</h4>
                  <p class="text-xs text-gray-600">Especialistas</p>
                </button>

                <!-- Mis Logros -->
                <button
                  @click="verLogros"
                  class="group p-6 bg-purple-50 rounded-xl border border-purple-200 hover:bg-purple-100 hover:shadow-md transition-all duration-200 text-center"
                >
                  <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-purple-200 transition-colors duration-200">
                    <Trophy class="h-6 w-6 text-purple-600" />
                  </div>
                  <h4 class="font-semibold text-gray-900 text-sm mb-1">Mis Logros</h4>
                  <p class="text-xs text-gray-600">Historial</p>
                </button>
              </div>
            </div>
          </div>

          <!-- Motivación y Progreso Personal -->
          <div class="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-xl text-white p-8">
            <div class="text-center">
              <div class="flex justify-center mb-4">
                <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <TrendingUp class="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 class="text-2xl font-bold mb-2">¡Sigue así, {{ nombreEmpleado }}!</h3>
              <p class="text-indigo-100 text-lg mb-6">
                Tu participación activa contribuye al bienestar de todo el equipo
              </p>
              
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="text-center">
                  <p class="text-3xl font-bold text-white">{{ estadisticasPersonales.encuestasCompletadas }}</p>
                  <p class="text-indigo-200 text-sm">Encuestas Completadas</p>
                </div>
                <div class="text-center">
                  <p class="text-3xl font-bold text-white">{{ estadisticasPersonales.sesionesAsistidas }}</p>
                  <p class="text-indigo-200 text-sm">Sesiones Asistidas</p>
                </div>
                <div class="text-center">
                  <p class="text-3xl font-bold text-white">{{ puntosUsuario }}</p>
                  <p class="text-indigo-200 text-sm">Puntos Ganados</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { storeToRefs } from 'pinia';
import { useEncuestasStore } from '@/stores/encuestas.store';
import { useComunicadosStore } from '@/stores/comunicados.store';
import { useSesionesStore } from '@/stores/sesiones.store';
import { useGamificacionStore } from '@/stores/gamificacion.store';
import { useReservasStore } from '@/stores/reservas.store.js';
import { useAuthStore } from '@/stores/auth.store';
import { storeToRefs } from 'pinia';
import Button from '@/components/common/Button.vue';
import { 
  BarChart3,
  LogOut,
  Calendar,
  Clock,
  MapPin,
  FileText,
  HelpCircle,
  Send,
  CheckCircle,
  Plus,
  Megaphone,
  MessageSquare,
  Sparkles,
  Users,
  Gift,
  Heart,
  Trophy,
  TrendingUp,
  Zap
} from 'lucide-vue-next';

const router = useRouter();
const toast = useToast();
const authStore = useAuthStore();

// Stores
const encuestasStore = useEncuestasStore();
const comunicadosStore = useComunicadosStore();
const sesionesStore = useSesionesStore();
const gamificacionStore = useGamificacionStore();
const reservasStore = useReservasStore();

// Store state
const { activeSurvey } = storeToRefs(encuestasStore);
const { comunicados } = storeToRefs(comunicadosStore);
const { sesiones } = storeToRefs(sesionesStore);
const { puntosUsuario } = storeToRefs(gamificacionStore);
const { misReservas } = storeToRefs(reservasStore);
// Simulación del ID de usuario
const usuarioIdDemo = 'user-empleado-01';

// Store actions
const { fetchActiveSurvey } = encuestasStore;
const { cargarComunicados } = comunicadosStore;
const { cargarSesiones } = sesionesStore;
const { cargarPuntos } = gamificacionStore;
const { fetchMisReservas } = reservasStore;

// Local state
const loading = ref(true);
const loggingOut = ref(false);

// Computed properties
const nombreEmpleado = computed(() => {
  return authStore.user?.name || 'Empleado Demo';
});

const empleadoActual = computed(() => ({
  id: authStore.user?.id || 'user-empleado-01',
  nombre: authStore.user?.name || 'Empleado Demo',
  email: authStore.user?.email || 'empleado@demo.com'
}));

const fechaActual = computed(() => {
  return new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

const encuestaPendiente = computed(() => {
  return activeSurvey.value && activeSurvey.value.estado === 'activa' ? activeSurvey.value : null;
});

const proximasSesiones = computed(() => {
  if (!sesiones.value) return [];
  
  const ahora = new Date();
  
  // Combinar sesiones de actividades grupales y sesiones de apoyo personal
  const sesionesGrupales = sesiones.value
    .filter(sesion => {
      const fechaSesion = new Date(`${sesion.fecha}T${sesion.hora}`);
      const estaInscrito = sesion.participantes?.some(p => p.id === empleadoActual.value.id);
      return fechaSesion > ahora && estaInscrito;
    })
    .map(sesion => ({
      ...sesion,
      tipo: 'grupal'
    }));
  
  // Sesiones de apoyo personal (reservas individuales)
  const sesionesPersonales = misReservas.value
    .filter(reserva => {
      const fechaSesion = new Date(`${reserva.sesionInfo.fecha}T${reserva.sesionInfo.hora}`);
      return fechaSesion > ahora;
    })
    .map(reserva => ({
      id: reserva.id,
      titulo: reserva.sesionInfo.titulo,
      fecha: reserva.sesionInfo.fecha,
      hora: reserva.sesionInfo.hora,
      modalidad: 'personal',
      ubicacion: 'Sesión confidencial',
      tipo: 'personal'
    }));
  
  // Combinar y ordenar todas las sesiones
  const todasLasSesiones = [...sesionesGrupales, ...sesionesPersonales];
  
  return todasLasSesiones
    .sort((a, b) => {
      const fechaA = new Date(`${a.fecha}T${a.hora}`);
      const fechaB = new Date(`${b.fecha}T${b.hora}`);
      return fechaA - fechaB;
    })
    .slice(0, 2);
});

const comunicadosRecientes = computed(() => {
  return comunicados.value?.slice(0, 2) || [];
});

const nuevasActividades = computed(() => {
  if (!sesiones.value) return [];
  
  const ahora = new Date();
  const hace7Dias = new Date(ahora.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  return sesiones.value
    .filter(sesion => {
      // Filtrar sesiones futuras, creadas en los últimos 7 días, con plazas disponibles
      const fechaSesion = new Date(`${sesion.fecha}T${sesion.hora}`);
      const fechaCreacion = new Date(sesion.fechaCreacion);
      const tieneEspacio = (sesion.participantes?.length || 0) < sesion.plazasTotales;
      const noEstaInscrito = !sesion.participantes?.some(p => p.id === empleadoActual.value.id);
      
      return fechaSesion > ahora && 
             fechaCreacion > hace7Dias && 
             tieneEspacio && 
             noEstaInscrito;
    })
    .sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion))
    .slice(0, 2);
});

const estadisticasPersonales = computed(() => {
  // Estadísticas simuladas del empleado
  return {
    encuestasCompletadas: 3,
    sesionesAsistidas: 2,
    puntosGanados: puntosUsuario.value
  };
});

// Methods
const formatearFecha = (fecha) => {
  return new Date(fecha).toLocaleDateString('es-ES', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
};

const formatearFechaSesion = (fecha, hora) => {
  const fechaObj = new Date(`${fecha}T${hora}`);
  const ahora = new Date();
  const diferenciaDias = Math.ceil((fechaObj - ahora) / (1000 * 60 * 60 * 24));
  
  if (diferenciaDias === 0) {
    return `Hoy a las ${hora}`;
  } else if (diferenciaDias === 1) {
    return `Mañana a las ${hora}`;
  } else if (diferenciaDias <= 7) {
    return `En ${diferenciaDias} días a las ${hora}`;
  } else {
    return fechaObj.toLocaleDateString('es-ES', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
};

const formatearTiempoTranscurrido = (fecha) => {
  const ahora = new Date();
  const fechaComunicado = new Date(fecha);
  const diferencia = ahora - fechaComunicado;
  
  const minutos = Math.floor(diferencia / (1000 * 60));
  const horas = Math.floor(diferencia / (1000 * 60 * 60));
  const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
  
  if (minutos < 60) {
    return minutos <= 1 ? 'Hace un momento' : `Hace ${minutos} minutos`;
  } else if (horas < 24) {
    return horas === 1 ? 'Hace 1 hora' : `Hace ${horas} horas`;
  } else if (dias < 7) {
    return dias === 1 ? 'Hace 1 día' : `Hace ${dias} días`;
  } else {
    return fechaComunicado.toLocaleDateString('es-ES');
  }
};

const getPlazasDisponibles = (sesion) => {
  return sesion.plazasTotales - (sesion.participantes?.length || 0);
};

const verTodosComunicados = () => {
  toast.add({
    severity: 'info',
    summary: 'Próximamente',
    detail: 'La vista completa de comunicados estará disponible pronto',
    life: 3000
  });
};

const verLogros = () => {
  toast.add({
    severity: 'info',
    summary: 'Próximamente',
    detail: 'La sección de logros personales estará disponible pronto',
    life: 3000
  });
};

const handleLogout = async () => {
  loggingOut.value = true;
  
  try {
    await authStore.logout();
    
    toast.add({
      severity: 'info',
      summary: 'Sesión cerrada',
      detail: 'Has cerrado sesión correctamente',
      life: 3000
    });
    
    router.push('/login');
  } catch (error) {
    console.error('Error durante el logout:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudo cerrar la sesión',
      life: 4000
    });
  } finally {
    loggingOut.value = false;
  }
};

// Load data on mount
const cargarDatosDashboard = async () => {
  loading.value = true;
  
  try {
    await Promise.all([
      fetchActiveSurvey(),
      cargarComunicados(),
      cargarSesiones(),
      cargarPuntos(empleadoActual.value.id)
    ]);
  } catch (error) {
    console.error('Error cargando datos del dashboard:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudieron cargar algunos datos del dashboard',
      life: 4000
    });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  cargarDatosDashboard();
});
</script>

<style scoped>
/* Estilos específicos para el dashboard del empleado */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Animaciones suaves */
.group:hover .group-hover\:bg-blue-200 {
  background-color: rgb(191 219 254);
}

.group:hover .group-hover\:bg-yellow-200 {
  background-color: rgb(254 240 138);
}

.group:hover .group-hover\:bg-green-200 {
  background-color: rgb(187 247 208);
}

.group:hover .group-hover\:bg-purple-200 {
  background-color: rgb(221 214 254);
}

/* Transiciones */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.duration-200 {
  transition-duration: 200ms;
}

.duration-300 {
  transition-duration: 300ms;
}
</style>