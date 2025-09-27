<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <Header subtitulo="Panel de Administración" />
    
    <!-- Main Content -->
    <div class="py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Dashboard Administrador</h1>
          <p class="mt-2 text-lg text-gray-600">Vista general del bienestar de tu empresa</p>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="bg-white rounded-lg shadow-sm p-12 text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent mx-auto mb-4"></div>
          <p class="text-gray-600">Cargando datos del dashboard...</p>
        </div>

        <!-- Dashboard Content -->
        <div v-else class="space-y-8">
          <!-- FILA SUPERIOR: El Pulso de la Empresa -->
          <div class="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <!-- Componente Principal: Wellness Score (60% del ancho) -->
            <div class="lg:col-span-3">
              <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center hover:shadow-xl transition-shadow duration-300">
                <div class="mb-6">
                  <h2 class="text-2xl font-bold text-gray-900 mb-2">Índice de Bienestar General</h2>
                  <p class="text-gray-600">Puntuación basada en las últimas respuestas de tus empleados</p>
                </div>
                
                <ScoreGauge 
                  :score="wellnessData.overallScore"
                  title="Wellness Score"
                  description="Nivel general de bienestar del equipo"
                  :trend="wellnessData.trends?.overallChange || null"
                />
                
                <div class="mt-6 pt-6 border-t border-gray-200">
                  <div class="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p class="text-2xl font-bold text-gray-900">{{ wellnessData.totalResponses }}</p>
                      <p class="text-sm text-gray-500">Respuestas Recibidas</p>
                    </div>
                    <div>
                      <p class="text-2xl font-bold text-gray-900">{{ wellnessData.responseRate }}%</p>
                      <p class="text-sm text-gray-500">Tasa de Participación</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Componentes Secundarios: Insights Críticos (40% del ancho) -->
            <div class="lg:col-span-2 space-y-6">
              <div 
                v-for="insight in wellnessData.insights" 
                :key="insight.title"
                @click="navegarAInsight(insight)"
                class="cursor-pointer transform hover:scale-105 transition-transform duration-200"
              >
                <InsightCard 
                  :insight="insight"
                  :show-progress-bar="true"
                />
              </div>
            </div>
          </div>

          <!-- FILA INTERMEDIA: Acciones y Engagement -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Recomendaciones Accionables -->
            <div class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div class="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6">
                <div class="flex items-center">
                  <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                    <Lightbulb class="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 class="text-xl font-bold">Recomendación Principal</h3>
                    <p class="text-orange-100">Acción sugerida basada en tus datos</p>
                  </div>
                </div>
              </div>
              
              <div class="p-6">
                <div v-if="recomendacionPrincipal" class="space-y-4">
                  <div class="flex items-start">
                    <div class="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                      <span class="text-lg">{{ recomendacionPrincipal.icono }}</span>
                    </div>
                    <div class="flex-1">
                      <h4 class="text-lg font-semibold text-gray-900 mb-2">
                        {{ recomendacionPrincipal.titulo }}
                      </h4>
                      <p class="text-gray-600 leading-relaxed mb-4">
                        {{ recomendacionPrincipal.descripcion }}
                      </p>
                      <div class="flex items-center text-sm text-orange-600 bg-orange-50 p-3 rounded-lg">
                        <TrendingUp class="h-4 w-4 mr-2" />
                        <span class="font-medium">{{ recomendacionPrincipal.impacto }}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div class="pt-4 border-t border-gray-200">
                    <Button 
                      @click="implementarRecomendacion"
                      class="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                    >
                      <Zap class="h-4 w-4 mr-2" />
                      Implementar Ahora
                    </Button>
                  </div>
                </div>
                
                <div v-else class="text-center py-8">
                  <CheckCircle class="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h4 class="text-lg font-medium text-gray-900 mb-2">¡Todo va bien!</h4>
                  <p class="text-gray-600">No hay recomendaciones críticas en este momento</p>
                </div>
              </div>
            </div>

            <!-- Próximas Sesiones -->
            <div class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div class="bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-6">
                <div class="flex items-center">
                  <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                    <Calendar class="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 class="text-xl font-bold">Próximas Sesiones</h3>
                    <p class="text-purple-100">Actividades programadas esta semana</p>
                  </div>
                </div>
              </div>
              
              <div class="p-6">
                <div v-if="proximasSesiones.length > 0" class="space-y-4">
                  <div 
                    v-for="sesion in proximasSesiones" 
                    :key="sesion.id"
                    class="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors duration-200"
                  >
                    <div class="flex-1">
                      <h4 class="font-semibold text-gray-900">{{ sesion.titulo }}</h4>
                      <div class="flex items-center text-sm text-gray-600 mt-1">
                        <Clock class="h-4 w-4 mr-1" />
                        <span>{{ formatearFechaSesion(sesion.fecha, sesion.hora) }}</span>
                      </div>
                    </div>
                    <div class="text-right">
                      <div class="flex items-center text-sm font-medium text-purple-700">
                        <Users class="h-4 w-4 mr-1" />
                        <span>{{ sesion.participantes?.length || 0 }}/{{ sesion.plazasTotales }}</span>
                      </div>
                      <p class="text-xs text-gray-500 mt-1">{{ sesion.modalidad }}</p>
                    </div>
                  </div>
                  
                  <div class="pt-4 border-t border-gray-200">
                    <Button 
                      @click="router.push('/admin/servicios')"
                      variant="outline"
                      class="w-full"
                    >
                      <Calendar class="h-4 w-4 mr-2" />
                      Ver Todas las Sesiones
                    </Button>
                  </div>
                </div>
                
                <div v-else class="text-center py-8">
                  <Calendar class="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 class="text-lg font-medium text-gray-900 mb-2">No hay sesiones programadas</h4>
                  <p class="text-gray-600 mb-4">Programa actividades para mejorar el bienestar</p>
                  <Button @click="router.push('/admin/servicios')" variant="outline">
                    <Plus class="h-4 w-4 mr-2" />
                    Programar Primera Sesión
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <!-- FILA INFERIOR: Gestión y Detalles -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Feedback Reciente -->
            <div class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div class="bg-gradient-to-r from-green-500 to-teal-500 text-white p-6">
                <div class="flex items-center">
                  <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                    <MessageSquare class="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 class="text-xl font-bold">Feedback Reciente</h3>
                    <p class="text-green-100">Últimos comentarios anónimos</p>
                  </div>
                </div>
              </div>
              
              <div class="p-6">
                <div v-if="feedbackReciente.length > 0" class="space-y-4">
                  <div 
                    v-for="(comentario, index) in feedbackReciente" 
                    :key="index"
                    class="p-4 bg-green-50 rounded-lg border border-green-200"
                  >
                    <div class="flex items-start">
                      <div class="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <Quote class="h-4 w-4 text-green-600" />
                      </div>
                      <div class="flex-1">
                        <p class="text-sm text-gray-800 italic leading-relaxed">
                          "{{ comentario }}"
                        </p>
                        <p class="text-xs text-gray-500 mt-2">Empleado anónimo</p>
                      </div>
                    </div>
                  </div>
                  
                  <div class="pt-4 border-t border-gray-200">
                    <Button 
                      @click="verTodosFeedback"
                      variant="outline"
                      class="w-full"
                    >
                      <MessageSquare class="h-4 w-4 mr-2" />
                      Ver Todos los Comentarios
                    </Button>
                  </div>
                </div>
                
                <div v-else class="text-center py-8">
                  <MessageSquare class="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 class="text-lg font-medium text-gray-900 mb-2">Sin comentarios recientes</h4>
                  <p class="text-gray-600">Los comentarios aparecerán cuando los empleados respondan encuestas</p>
                </div>
              </div>
            </div>

            <!-- Accesos Directos -->
            <div class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div class="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-6">
                <div class="flex items-center">
                  <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                    <Zap class="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 class="text-xl font-bold">Acciones Rápidas</h3>
                    <p class="text-blue-100">Herramientas de gestión principales</p>
                  </div>
                </div>
              </div>
              
              <div class="p-6">
                <div class="grid grid-cols-2 gap-4">
                  <!-- Crear Encuesta -->
                  <button
                    @click="router.push('/admin/crear-encuesta')"
                    class="group p-4 bg-blue-50 rounded-xl border border-blue-200 hover:bg-blue-100 hover:shadow-md transition-all duration-200 text-center"
                  >
                    <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-200 transition-colors duration-200">
                      <FileText class="h-6 w-6 text-blue-600" />
                    </div>
                    <h4 class="font-semibold text-gray-900 text-sm">Crear Encuesta</h4>
                    <p class="text-xs text-gray-600 mt-1">Nueva encuesta de bienestar</p>
                  </button>

                  <!-- Gestionar Empleados -->
                  <button
                    @click="router.push('/admin/empleados')"
                    class="group p-4 bg-green-50 rounded-xl border border-green-200 hover:bg-green-100 hover:shadow-md transition-all duration-200 text-center"
                  >
                    <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-green-200 transition-colors duration-200">
                      <Users class="h-6 w-6 text-green-600" />
                    </div>
                    <h4 class="font-semibold text-gray-900 text-sm">Gestionar Empleados</h4>
                    <p class="text-xs text-gray-600 mt-1">Administrar tu equipo</p>
                  </button>

                  <!-- Gestionar Recompensas -->
                  <button
                    @click="router.push('/admin/recompensas')"
                    class="group p-4 bg-yellow-50 rounded-xl border border-yellow-200 hover:bg-yellow-100 hover:shadow-md transition-all duration-200 text-center"
                  >
                    <div class="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-yellow-200 transition-colors duration-200">
                      <Gift class="h-6 w-6 text-yellow-600" />
                    </div>
                    <h4 class="font-semibold text-gray-900 text-sm">Recompensas</h4>
                    <p class="text-xs text-gray-600 mt-1">Catálogo de incentivos</p>
                  </button>

                  <!-- Crear Comunicado -->
                  <button
                    @click="router.push('/admin/comunicados')"
                    class="group p-4 bg-purple-50 rounded-xl border border-purple-200 hover:bg-purple-100 hover:shadow-md transition-all duration-200 text-center"
                  >
                    <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-purple-200 transition-colors duration-200">
                      <Megaphone class="h-6 w-6 text-purple-600" />
                    </div>
                    <h4 class="font-semibold text-gray-900 text-sm">Comunicado</h4>
                    <p class="text-xs text-gray-600 mt-1">Informar al equipo</p>
                  </button>
                </div>

                <!-- Botón Analytics -->
                <div class="mt-6 pt-6 border-t border-gray-200">
                  <Button 
                    @click="verAnalytics"
                    variant="outline"
                    class="w-full"
                  >
                    <BarChart3 class="h-4 w-4 mr-2" />
                    Ver Analytics Detallados
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <!-- Encuestas Recientes (Solo si hay encuestas) -->
          <div v-if="encuestasRecientes.length > 0" class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <FileText class="h-5 w-5 text-gray-600 mr-2" />
                  <h3 class="text-lg font-semibold text-gray-900">Encuestas Recientes</h3>
                </div>
                <Button 
                  @click="router.push('/admin/crear-encuesta')"
                  variant="outline"
                  class="text-sm"
                >
                  <Plus class="h-4 w-4 mr-2" />
                  Nueva Encuesta
                </Button>
              </div>
            </div>
            
            <div class="p-6">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div 
                  v-for="encuesta in encuestasRecientes" 
                  :key="encuesta.id"
                  @click="router.push(`/admin/encuesta/${encuesta.id}/resultados`)"
                  class="group p-4 border border-gray-200 rounded-lg hover:border-primary hover:shadow-md transition-all duration-200 cursor-pointer"
                >
                  <div class="flex items-center justify-between mb-3">
                    <span 
                      :class="[
                        'px-2 py-1 rounded-full text-xs font-medium',
                        encuesta.estado === 'activa' ? 'bg-green-100 text-green-800' :
                        encuesta.estado === 'finalizada' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      ]"
                    >
                      {{ encuesta.estado }}
                    </span>
                    <ArrowRight class="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors duration-200" />
                  </div>
                  
                  <h4 class="font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors duration-200">
                    {{ encuesta.titulo }}
                  </h4>
                  
                  <div class="space-y-2">
                    <div class="flex items-center justify-between text-sm">
                      <span class="text-gray-600">Respuestas:</span>
                      <span class="font-medium text-gray-900">{{ encuesta.totalRespuestas || 0 }}</span>
                    </div>
                    <div class="flex items-center justify-between text-sm">
                      <span class="text-gray-600">Preguntas:</span>
                      <span class="font-medium text-gray-900">{{ encuesta.preguntas || 0 }}</span>
                    </div>
                  </div>
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
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { storeToRefs } from 'pinia';
import { useEncuestasStore } from '@/stores/encuestas.store';
import { useSesionesStore } from '@/stores/sesiones.store';
import { calculateWellnessScore } from '@/services/mock/analytics.service';
import { getSurveyById } from '@/services/mock/encuestas.service';
import Header from '@/components/common/Header.vue';
import Button from '@/components/common/Button.vue';
import ScoreGauge from '@/components/admin/ScoreGauge.vue';
import InsightCard from '@/components/admin/InsightCard.vue';
import { 
  Users, 
  FileText, 
  TrendingUp, 
  Heart,
  Plus,
  Calendar,
  Gift,
  Megaphone,
  BarChart3,
  Lightbulb,
  CheckCircle,
  Zap,
  Clock,
  MessageSquare,
  Quote,
  ArrowRight
} from 'lucide-vue-next';

const router = useRouter();
const toast = useToast();
const encuestasStore = useEncuestasStore();
const sesionesStore = useSesionesStore();

// Store state
const { encuestas } = storeToRefs(encuestasStore);
const { sesiones } = storeToRefs(sesionesStore);
const { cargarEncuestas } = encuestasStore;
const { cargarSesiones } = sesionesStore;

// Local state
const loading = ref(true);
const wellnessData = ref({
  overallScore: 7.2,
  insights: [],
  trends: { available: false },
  totalResponses: 0,
  responseRate: 0
});

const encuestasRecientes = ref([]);
const proximasSesiones = ref([]);
const feedbackReciente = ref([]);
const recomendacionPrincipal = ref(null);

// Methods
const cargarDatosDashboard = async () => {
  loading.value = true;
  
  try {
    // Cargar datos de los stores
    await Promise.all([
      cargarEncuestas(),
      cargarSesiones()
    ]);
    
    // Cargar wellness score y analytics
    const analyticsData = await calculateWellnessScore();
    wellnessData.value = analyticsData;
    
    // Cargar encuestas recientes
    encuestasRecientes.value = encuestas.value.slice(0, 3);
    
    // Cargar próximas sesiones (filtrar futuras)
    const ahora = new Date();
    proximasSesiones.value = sesiones.value
      .filter(sesion => {
        const fechaSesion = new Date(`${sesion.fecha}T${sesion.hora}`);
        return fechaSesion > ahora;
      })
      .slice(0, 3);
    
    // Cargar feedback reciente de la encuesta activa
    await cargarFeedbackReciente();
    
    // Generar recomendación principal
    generarRecomendacionPrincipal();
    
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

const cargarFeedbackReciente = async () => {
  try {
    // Obtener la encuesta activa (ID 1)
    const encuestaActiva = await getSurveyById(1);
    
    if (encuestaActiva?.respuestas && encuestaActiva?.preguntas) {
      // Encontrar preguntas de texto abierto
      const preguntasTextoAbierto = encuestaActiva.preguntas.filter(p => p.tipo === 'texto_abierto');
      
      if (preguntasTextoAbierto.length > 0) {
        const comentarios = [];
        
        encuestaActiva.respuestas.forEach(respuesta => {
          preguntasTextoAbierto.forEach(pregunta => {
            const comentario = respuesta.respuestas[pregunta.id];
            if (comentario && typeof comentario === 'string' && comentario.trim()) {
              comentarios.push(comentario.trim());
            }
          });
        });
        
        // Filtrar comentarios genéricos y tomar los 4 más recientes
        const comentariosFiltrados = comentarios
          .filter(c => 
            c !== 'Sin comentarios adicionales por ahora.' && 
            c !== 'Todo bien en general.' &&
            c.length > 10
          )
          .slice(0, 4);
        
        feedbackReciente.value = comentariosFiltrados;
      }
    }
  } catch (error) {
    console.error('Error cargando feedback:', error);
    feedbackReciente.value = [];
  }
};

const generarRecomendacionPrincipal = () => {
  // Buscar la debilidad más crítica
  const debilidades = wellnessData.value.insights.filter(i => i.type === 'weakness');
  
  if (debilidades.length > 0) {
    const debilidadPrincipal = debilidades[0]; // La primera es la más crítica
    
    // Mapear debilidades a recomendaciones específicas
    const recomendaciones = {
      'Salud Mental': {
        titulo: 'Implementar Programa de Mindfulness',
        descripcion: 'Los datos muestran niveles elevados de estrés. Un programa de mindfulness puede reducir significativamente el estrés laboral y mejorar la concentración.',
        icono: '🧘‍♀️',
        impacto: 'Puede mejorar el bienestar mental hasta un 25%'
      },
      'Balance Vida-Trabajo': {
        titulo: 'Flexibilizar Horarios de Trabajo',
        descripcion: 'Los empleados reportan dificultades con el balance vida-trabajo. Implementar horarios flexibles o trabajo remoto puede mejorar significativamente esta área.',
        icono: '⚖️',
        impacto: 'Puede aumentar la satisfacción hasta un 30%'
      },
      'Ambiente Laboral': {
        titulo: 'Mejorar Espacios de Trabajo',
        descripcion: 'Se detectan problemas con el ambiente físico de trabajo. Una evaluación ergonómica y mejoras en el espacio pueden tener un impacto inmediato.',
        icono: '🏢',
        impacto: 'Puede reducir dolencias físicas hasta un 40%'
      },
      'Comunicación': {
        titulo: 'Programa de Coaching de Equipos',
        descripcion: 'Los datos indican problemas de comunicación interna. Un programa de coaching puede mejorar la colaboración y el clima laboral.',
        icono: '💬',
        impacto: 'Puede mejorar la comunicación hasta un 35%'
      }
    };
    
    const nombreDebilidad = debilidadPrincipal.title.replace('Área de Mejora: ', '');
    recomendacionPrincipal.value = recomendaciones[nombreDebilidad] || {
      titulo: 'Revisar Datos de Bienestar',
      descripcion: 'Se han detectado áreas de mejora que requieren atención. Revisa los resultados detallados para tomar acciones específicas.',
      icono: '📊',
      impacto: 'Análisis detallado recomendado'
    };
  } else {
    recomendacionPrincipal.value = null; // Todo va bien
  }
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

const navegarAInsight = (insight) => {
  // Navegar a resultados detallados de la encuesta activa
  if (encuestasRecientes.value.length > 0) {
    router.push(`/admin/encuesta/${encuestasRecientes.value[0].id}/resultados`);
  } else {
    toast.add({
      severity: 'info',
      summary: 'Sin datos detallados',
      detail: 'Crea una encuesta para ver análisis detallados',
      life: 3000
    });
  }
};

const implementarRecomendacion = () => {
  // Navegar a la gestión de servicios para implementar la recomendación
  router.push('/admin/servicios');
  
  toast.add({
    severity: 'info',
    summary: 'Implementando recomendación',
    detail: 'Te llevamos a la gestión de servicios para programar la actividad recomendada',
    life: 4000
  });
};

const verTodosFeedback = () => {
  // Navegar a resultados de encuesta para ver todos los comentarios
  if (encuestasRecientes.value.length > 0) {
    router.push(`/admin/encuesta/${encuestasRecientes.value[0].id}/resultados`);
  } else {
    toast.add({
      severity: 'info',
      summary: 'Sin encuestas',
      detail: 'Crea una encuesta para recopilar feedback de empleados',
      life: 3000
    });
  }
};

const verAnalytics = () => {
  toast.add({
    severity: 'info',
    summary: 'Próximamente',
    detail: 'La sección de analytics avanzados estará disponible pronto',
    life: 3000
  });
};

// Load data on mount
onMounted(() => {
  cargarDatosDashboard();
});
</script>

<style scoped>
/* Estilos específicos para el dashboard rediseñado */
.group:hover .group-hover\:bg-blue-200 {
  background-color: rgb(191 219 254);
}

.group:hover .group-hover\:bg-green-200 {
  background-color: rgb(187 247 208);
}

.group:hover .group-hover\:bg-yellow-200 {
  background-color: rgb(254 240 138);
}

.group:hover .group-hover\:bg-purple-200 {
  background-color: rgb(221 214 254);
}

/* Animaciones suaves */
.transform {
  transition: transform 0.2s ease-in-out;
}

.hover\:scale-105:hover {
  transform: scale(1.05);
}
</style>