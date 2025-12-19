<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    
    <!-- Main Content -->
    <div class="py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Loading State -->
        <div v-if="loading" class="bg-white rounded-lg shadow-sm p-8 text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent mx-auto mb-4"></div>
          <p class="text-gray-600">Cargando resultados de la encuesta...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle class="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-red-800 mb-2">Error al cargar los resultados</h3>
          <p class="text-red-600 mb-4">{{ error }}</p>
          <Button @click="cargarResultados" variant="outline">
            <RefreshCw class="h-4 w-4 mr-2" />
            Reintentar
          </Button>
        </div>

        <!-- Results Content -->
        <div v-else-if="encuesta" class="space-y-8">
          <!-- Breadcrumb -->
          <nav class="flex" aria-label="Breadcrumb">
            <ol class="flex items-center space-x-4">
              <li>
                <button @click="volverAtras" class="text-gray-500 hover:text-gray-700 transition-colors duration-200">
                  <ArrowLeft class="h-5 w-5" />
                </button>
              </li>
              <li>
                <div class="flex items-center">
                  <ChevronRight class="h-5 w-5 text-gray-400 mr-4" />
                  <span class="text-sm font-medium text-gray-500">Encuestas</span>
                </div>
              </li>
              <li>
                <div class="flex items-center">
                  <ChevronRight class="h-5 w-5 text-gray-400 mr-4" />
                  <span class="text-sm font-medium text-gray-900">{{ encuesta.titulo }}</span>
                </div>
              </li>
            </ol>
          </nav>

          <!-- Resumen Ejecutivo Sticky -->
          <div class="sticky top-0 z-10 bg-gray-50 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 py-4">
            <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-5">
              <!-- TODO: conectar con datos reales desde Supabase cuando esté disponible -->
              <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <!-- Columna Izquierda: Indicadores Principales -->
                <div class="flex items-center gap-6 flex-wrap">
                  <!-- Índice de Bienestar -->
                  <div class="flex items-center gap-3">
                    <div class="flex items-center justify-center w-16 h-16 rounded-full"
                         :class="getBienestarColorClasses(indiceBienestarGlobal).bgClass">
                      <Activity class="h-8 w-8" :class="getBienestarColorClasses(indiceBienestarGlobal).textClass" />
                    </div>
                    <div>
                      <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">Índice de Bienestar</p>
                      <p class="text-4xl font-bold" :class="getBienestarColorClasses(indiceBienestarGlobal).textClass">
                        {{ indiceBienestarGlobal }}%
                      </p>
                    </div>
                  </div>

                  <!-- Separador -->
                  <div class="hidden md:block w-px h-16 bg-gray-200"></div>

                  <!-- Tendencia -->
                  <div>
                    <p class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Tendencia</p>
                    <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold"
                         :class="getTendenciaClasses(tendenciaBienestar)">
                      <component :is="getTendenciaIcon(tendenciaBienestar)" class="h-4 w-4" />
                      <span>{{ getTendenciaTexto(tendenciaBienestar) }}</span>
                    </div>
                  </div>

                  <!-- Separador -->
                  <div class="hidden md:block w-px h-16 bg-gray-200"></div>

                  <!-- Alertas Activas -->
                  <div>
                    <p class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Alertas Activas</p>
                    <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold"
                         :class="alertasActivas.length === 0 ? 'bg-green-100 text-green-800' : alertasPorTipo.criticas > 0 ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'">
                      <Bell class="h-4 w-4" />
                      <span>{{ alertasActivas.length }}</span>
                    </div>
                  </div>
                </div>

                <!-- Columna Derecha: Interpretación -->
                <div class="max-w-lg">
                  <div class="p-3 rounded-lg" :class="getBienestarColorClasses(indiceBienestarGlobal).bgLightClass">
                    <p class="text-sm font-semibold mb-1" :class="getBienestarColorClasses(indiceBienestarGlobal).textDarkClass">
                      Estado General
                    </p>
                    <p class="text-sm" :class="getBienestarColorClasses(indiceBienestarGlobal).textDarkClass">
                      {{ getEstadoGeneralTexto(indiceBienestarGlobal) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Header de Resultados -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <h1 class="text-3xl font-bold text-gray-900">{{ encuesta.titulo }}</h1>
                  <!-- Badge de Alertas Activas -->
                  <div v-if="alertasActivas.length > 0"
                       class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold"
                       :class="alertasPorTipo.criticas > 0 ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'">
                    <Bell class="h-4 w-4" />
                    <span>{{ alertasActivas.length }} {{ alertasActivas.length === 1 ? 'alerta activa' : 'alertas activas' }}</span>
                  </div>
                </div>
                <div class="flex items-center space-x-6 text-sm text-gray-500">
                  <div class="flex items-center">
                    <Users class="h-4 w-4 mr-1" />
                    <span>{{ encuesta.totalParticipantes }} participante{{ encuesta.totalParticipantes !== 1 ? 's' : '' }}</span>
                  </div>
                  <div class="flex items-center">
                    <TrendingUp class="h-4 w-4 mr-1" />
                    <span>{{ tasaParticipacion }}% tasa de participación</span>
                  </div>
                  <div class="flex items-center">
                    <Calendar class="h-4 w-4 mr-1" />
                    <span>{{ encuesta.estado }}</span>
                  </div>
                </div>
              </div>
              <div class="flex space-x-3">
                <Button @click="exportarResultados" variant="outline">
                  <Download class="h-4 w-4 mr-2" />
                  Exportar
                </Button>
                <Button @click="crearComunicado" variant="primary">
                  <Megaphone class="h-4 w-4 mr-2" />
                  Crear Comunicado
                </Button>
              </div>
            </div>
          </div>

          <!-- Resumen Interpretativo General -->
          <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg border border-blue-100 overflow-hidden">
            <div class="px-8 py-6 border-b border-blue-200 bg-white/50">
              <div class="flex items-center">
                <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4">
                  <BarChart3 class="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 class="text-2xl font-bold text-gray-900">Interpretación General</h2>
                  <p class="text-gray-600">Análisis automático del estado de bienestar del equipo</p>
                </div>
              </div>
            </div>

            <div class="p-8">
              <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <!-- Índice de Bienestar Global -->
                <div class="lg:col-span-1 text-center">
                  <div class="inline-flex items-center justify-center w-32 h-32 rounded-full mb-4"
                       :class="getBienestarColorClasses(indiceBienestarGlobal).bgClass">
                    <div class="text-center">
                      <div class="text-4xl font-bold" :class="getBienestarColorClasses(indiceBienestarGlobal).textClass">
                        {{ indiceBienestarGlobal }}%
                      </div>
                      <div class="text-xs font-medium mt-1" :class="getBienestarColorClasses(indiceBienestarGlobal).textClass">
                        Bienestar Global
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Interpretación Textual -->
                <div class="lg:col-span-2">
                  <div class="p-6 rounded-xl border-2"
                       :class="getBienestarColorClasses(indiceBienestarGlobal).borderClass + ' ' + getBienestarColorClasses(indiceBienestarGlobal).bgLightClass">
                    <h3 class="text-lg font-semibold mb-3" :class="getBienestarColorClasses(indiceBienestarGlobal).textDarkClass">
                      Estado General del Equipo
                    </h3>
                    <p class="text-base leading-relaxed" :class="getBienestarColorClasses(indiceBienestarGlobal).textDarkClass">
                      {{ getInterpretacionGlobal(indiceBienestarGlobal) }}
                    </p>
                    <div class="mt-4 pt-4 border-t" :class="getBienestarColorClasses(indiceBienestarGlobal).borderClass">
                      <p class="text-sm font-medium" :class="getBienestarColorClasses(indiceBienestarGlobal).textDarkClass">
                        Basado en {{ encuesta.totalParticipantes }} respuestas de {{ encuesta.preguntas?.length || 0 }} preguntas
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Interpretación por Categorías -->
          <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div class="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
              <div class="flex items-center">
                <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mr-4">
                  <Target class="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 class="text-2xl font-bold text-gray-900">Interpretación por Categorías</h2>
                  <p class="text-gray-600">Análisis detallado de cada área evaluada</p>
                </div>
              </div>
            </div>

            <div class="p-8">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div v-for="(categoria, index) in categoriasInterpretadas" :key="index"
                     class="rounded-xl border-2 p-6 transition-all duration-200 hover:shadow-lg"
                     :class="categoria.colorClasses.borderClass + ' ' + categoria.colorClasses.bgLightClass">
                  <div class="flex items-start gap-4">
                    <div class="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
                         :class="categoria.colorClasses.bgClass">
                      <component :is="categoria.icon" class="h-7 w-7 text-white" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <h3 class="text-lg font-bold mb-1" :class="categoria.colorClasses.textDarkClass">
                        {{ categoria.nombre }}
                      </h3>
                      <div class="flex items-center gap-2 mb-3">
                        <span class="text-2xl font-bold" :class="categoria.colorClasses.textClass">
                          {{ categoria.valor }}%
                        </span>
                        <span class="text-sm px-2 py-1 rounded-full font-medium"
                              :class="categoria.colorClasses.badgeClass">
                          {{ categoria.nivel }}
                        </span>
                      </div>
                      <p class="text-sm leading-relaxed" :class="categoria.colorClasses.textDarkClass">
                        {{ categoria.interpretacion }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Resultados por Pregunta -->
          <div v-if="encuesta.preguntas" class="space-y-8">
            <div 
              v-for="(pregunta, index) in encuesta.preguntas" 
              :key="pregunta.id"
              class="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              <!-- Header de la Pregunta -->
              <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h3 class="text-lg font-semibold text-gray-900">
                  Pregunta {{ index + 1 }}: {{ pregunta.texto }}
                </h3>
              </div>

              <!-- Contenido de Resultados -->
              <div class="p-6">
                <!-- Alerta de Protección de Anonimato -->
                <div v-if="pregunta.resultadosPorGrupo && tieneGruposConPocasRespuestas(pregunta)" class="mb-6 bg-yellow-50 text-yellow-800 border border-yellow-300 rounded-lg p-4 flex items-start gap-3">
                  <AlertTriangle class="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p class="font-medium">Protección de Anonimato</p>
                    <p class="text-sm mt-1">No se muestran resultados de grupos con menos de 5 respuestas para preservar el anonimato.</p>
                  </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <!-- Gráfico -->
                  <div>
                    <h4 class="text-md font-medium text-gray-900 mb-4">Distribución de Respuestas</h4>
                    <div class="bg-gray-50 rounded-lg p-6">
                      <div class="relative h-64 w-full">
                        <canvas :id="`chart-${pregunta.id}`" class="w-full h-full"></canvas>
                      </div>
                    </div>
                  </div>

                  <!-- Análisis e Insights -->
                  <div class="space-y-6">
                    <!-- Insight -->
                    <div>
                      <h4 class="text-md font-medium text-gray-900 mb-3">Análisis del Resultado</h4>
                      <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div class="flex items-start">
                          <BarChart3 class="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                          <p class="text-blue-800 font-medium">{{ pregunta.insight }}</p>
                        </div>
                      </div>
                    </div>

                    <!-- Recomendación -->
                    <div>
                      <h4 class="text-md font-medium text-gray-900 mb-3">Acción Recomendada</h4>
                      <div v-if="pregunta.recomendacion" class="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                        <div class="flex items-start justify-between">
                          <div class="flex-1">
                            <div class="flex items-start">
                              <Lightbulb class="h-5 w-5 text-orange-600 mt-0.5 mr-3 flex-shrink-0" />
                              <div>
                                <h5 class="font-semibold text-orange-900 mb-1">{{ pregunta.recomendacion.titulo }}</h5>
                                <p class="text-orange-800 text-sm">{{ pregunta.recomendacion.descripcion }}</p>
                              </div>
                            </div>
                          </div>
                          <Button 
                            @click="handleSolicitarServicio(pregunta.recomendacion.id)"
                            class="ml-4 flex-shrink-0"
                          >
                            <Send class="h-4 w-4 mr-2" />
                            Solicitar Servicio
                          </Button>
                        </div>
                      </div>
                      <div v-else class="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div class="flex items-center">
                          <CheckCircle class="h-5 w-5 text-green-600 mr-3" />
                          <p class="text-green-800 font-medium">¡Excelente! No se requiere acción inmediata para esta área.</p>
                        </div>
                      </div>
                    </div>

                    <!-- Estadísticas Detalladas -->
                    <div>
                      <h4 class="text-md font-medium text-gray-900 mb-3">Estadísticas Detalladas</h4>
                      <p class="text-xs text-gray-500 mb-2">Total: {{ pregunta.resultados.totalRespuestas }} respuesta{{ pregunta.resultados.totalRespuestas !== 1 ? 's' : '' }}</p>
                      <div class="space-y-2">
                        <div
                          v-for="(valor, labelIndex) in pregunta.resultados.data"
                          :key="labelIndex"
                          class="flex items-center justify-between p-2 bg-gray-50 rounded"
                        >
                          <span class="text-sm text-gray-700">{{ pregunta.resultados.labels[labelIndex] }}</span>
                          <div class="flex items-center">
                            <span class="text-sm font-medium text-gray-900 mr-2">{{ valor }} respuesta{{ valor !== 1 ? 's' : '' }}</span>
                            <span class="text-xs text-gray-500">
                              ({{ pregunta.resultados.porcentajes ? pregunta.resultados.porcentajes[labelIndex] : 0 }}%)
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Resultados por Departamento (si existen) -->
                    <div v-if="pregunta.resultadosPorGrupo && pregunta.resultadosPorGrupo.length > 0">
                      <h4 class="text-md font-medium text-gray-900 mb-3">Resultados por Departamento</h4>
                      <div class="space-y-3">
                        <template v-for="grupo in pregunta.resultadosPorGrupo" :key="grupo.departamento">
                          <div v-if="grupo.total_respuestas >= 5" class="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                            <div class="flex items-center justify-between mb-2">
                              <span class="font-medium text-gray-900">{{ grupo.departamento }}</span>
                              <span class="text-sm text-gray-500">{{ grupo.total_respuestas }} respuestas</span>
                            </div>
                            <div class="text-sm text-gray-700">
                              Promedio: <span class="font-semibold">{{ grupo.promedio }}</span>
                            </div>
                          </div>
                        </template>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Resultados por Departamento -->
          <ResultadosPorDepartamento
            :encuesta-id="encuesta?.id"
            :respuestas="encuesta?.resultados || []"
          />

          <!-- Resumen General -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-semibold text-gray-900">Resumen Ejecutivo</h2>
              <button
                @click="abrirModalComunicado"
                class="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm hover:shadow-md"
              >
                <MessageSquare class="h-5 w-5" />
                Comunicar resultados
              </button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div class="text-center p-4 bg-blue-50 rounded-lg">
                <p class="text-2xl font-bold text-blue-600">{{ encuesta.totalParticipantes }}</p>
                <p class="text-sm text-blue-800">Participantes</p>
              </div>
              <div class="text-center p-4 bg-gray-50 rounded-lg">
                <p class="text-2xl font-bold text-gray-600">{{ totalEmpleadosEmpresa }}</p>
                <p class="text-sm text-gray-700">Total Empleados</p>
              </div>
              <div class="text-center p-4 bg-green-50 rounded-lg">
                <p class="text-2xl font-bold text-green-600">{{ tasaParticipacion }}%</p>
                <p class="text-sm text-green-800">Tasa de Participación</p>
              </div>
              <div class="text-center p-4 bg-purple-50 rounded-lg">
                <p class="text-2xl font-bold text-purple-600">{{ encuesta.preguntas?.length || 0 }}</p>
                <p class="text-sm text-purple-800">Preguntas</p>
              </div>
            </div>
          </div>

          <!-- Bloque de Alertas de Bienestar -->
          <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div class="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-red-50 to-orange-50">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl flex items-center justify-center mr-4">
                    <Bell class="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 class="text-2xl font-bold text-gray-900">Alertas de Bienestar</h2>
                    <p class="text-gray-600">Prioridades de intervención automáticas</p>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-3xl font-bold" :class="alertasPorTipo.criticas > 0 ? 'text-red-600' : alertasPorTipo.moderadas > 0 ? 'text-orange-600' : 'text-green-600'">
                    {{ alertasActivas.length }}
                  </div>
                  <div class="text-sm text-gray-600">
                    {{ alertasActivas.length === 0 ? 'Sin alertas' : alertasActivas.length === 1 ? 'Alerta activa' : 'Alertas activas' }}
                  </div>
                </div>
              </div>
            </div>

            <div class="p-8">
              <!-- TODO: conectar con datos reales desde Supabase cuando esté disponible -->

              <!-- Sin Alertas -->
              <div v-if="alertasActivas.length === 0"
                   class="bg-green-50 rounded-lg p-4 shadow-sm flex items-center gap-3 text-sm border border-green-200">
                <div class="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle class="h-5 w-5 text-white" />
                </div>
                <div class="flex-1">
                  <p class="font-semibold text-green-900">Todo estable</p>
                  <p class="text-green-700">No se requieren acciones urgentes. Todas las categorías muestran niveles saludables.</p>
                </div>
              </div>

              <!-- Con Alertas -->
              <div v-else class="space-y-3">
                <div v-for="(alerta, index) in alertasActivas"
                     :key="index"
                     class="rounded-lg p-4 shadow-sm flex items-start gap-3 text-sm transition-all duration-200 hover:shadow-md border cursor-pointer"
                     :class="[
                       getAlertaClasses(alerta.tipo),
                       alerta.gestionada ? 'opacity-50' : ''
                     ]"
                     @click="abrirModalRecomendaciones(alerta)">
                  <div class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                       :class="getAlertaIconClasses(alerta.tipo)">
                    <component :is="alerta.gestionada ? CheckCircle : getAlertaIcon(alerta.tipo)" class="h-5 w-5 text-white" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-start justify-between gap-2 mb-1">
                      <h3 class="font-bold" :class="getAlertaTitleClasses(alerta.tipo)">
                        {{ alerta.titulo }}
                        <span v-if="alerta.gestionada" class="ml-2 text-xs font-normal text-green-600">
                          (Gestionada ✓)
                        </span>
                      </h3>
                      <span class="text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap"
                            :class="getAlertaBadgeClasses(alerta.tipo)">
                        {{ alerta.tipo === 'critica' ? 'Riesgo Alto' : alerta.tipo === 'moderada' ? 'Atención Moderada' : 'Estable' }}
                      </span>
                    </div>
                    <p class="leading-relaxed" :class="getAlertaTextClasses(alerta.tipo)">
                      {{ alerta.mensaje }}
                    </p>
                    <div class="mt-2 pt-2 border-t" :class="getAlertaBorderClasses(alerta.tipo)">
                      <p class="text-xs font-medium" :class="getAlertaTextClasses(alerta.tipo)">
                        Categoría: {{ alerta.categoria }} ({{ alerta.valor }}%)
                      </p>
                    </div>
                  </div>
                  <div class="flex-shrink-0 text-gray-400">
                    <ChevronRight class="h-5 w-5" />
                  </div>
                </div>

                <!-- Resumen de Alertas -->
                <div class="mt-6 pt-6 border-t border-gray-200">
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="bg-red-50 rounded-lg p-4 text-center border border-red-200">
                      <div class="text-2xl font-bold text-red-600">{{ alertasPorTipo.criticas }}</div>
                      <div class="text-sm text-red-800 font-medium">Alertas Críticas</div>
                    </div>
                    <div class="bg-orange-50 rounded-lg p-4 text-center border border-orange-200">
                      <div class="text-2xl font-bold text-orange-600">{{ alertasPorTipo.moderadas }}</div>
                      <div class="text-sm text-orange-800 font-medium">Alertas Moderadas</div>
                    </div>
                    <div class="bg-green-50 rounded-lg p-4 text-center border border-green-200">
                      <div class="text-2xl font-bold text-green-600">{{ alertasPorTipo.estables }}</div>
                      <div class="text-sm text-green-800 font-medium">Áreas Estables</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Recomendaciones SMART -->
          <RecomendacionesSmart
            :resultados="encuesta.resultados"
            :encuesta-id="encuesta.id"
            :empresa-id="authStore.empresaId"
            :categorias-interpretadas="categoriasInterpretadas"
            :indice-bienestar-global="indiceBienestarGlobal"
            @ver-detalle="verDetalleRecomendacion"
            @recomendacion-actualizada="onRecomendacionActualizada"
          />
        </div>
      </div>
    </div>

    <!-- Modal de Recomendaciones -->
    <ModalAccionRecomendada
      v-model="modalRecomendacionesAbierto"
      :alerta="alertaSeleccionada"
      @marcar-gestionado="marcarAlertaComoGestionada"
    />

    <!-- Modal de Comunicado Post-Encuesta -->
    <ModalComunicadoPostEncuesta
      :is-open="modalComunicadoAbierto"
      :nombre-encuesta="encuesta?.titulo || 'Encuesta'"
      :encuesta-id="encuesta?.id || ''"
      @close="cerrarModalComunicado"
      @comunicado-enviado="handleComunicadoEnviado"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/auth.store';
import Button from '@/components/common/Button.vue';
import ModalAccionRecomendada from '@/components/admin/ModalAccionRecomendada.vue';
import ResultadosPorDepartamento from '@/components/admin/results/ResultadosPorDepartamento.vue';
import ModalComunicadoPostEncuesta from '@/components/admin/ModalComunicadoPostEncuesta.vue';
import RecomendacionesSmart from '@/components/admin/RecomendacionesSmart.vue';
import {
  ArrowLeft,
  AlertCircle,
  RefreshCw,
  MessageSquare,
  ChevronRight,
  Users,
  TrendingUp,
  Calendar,
  Download,
  Megaphone,
  BarChart3,
  Lightbulb,
  Send,
  CheckCircle,
  AlertTriangle,
  Target,
  Brain,
  Heart,
  Smile,
  Zap,
  Bell,
  ShieldAlert,
  Activity,
  TrendingDown,
  Minus
} from 'lucide-vue-next';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const route = useRoute();
const router = useRouter();
const toast = useToast();
const authStore = useAuthStore();

const encuesta = ref(null);
const loading = ref(true);
const error = ref(null);
const charts = ref({});
const totalEmpleadosEmpresa = ref(0);

const indiceBienestarGlobal = ref(72);
const tendenciaBienestar = ref('up'); // 'up', 'down', 'stable'

// Computed for participation rate
const tasaParticipacion = computed(() => {
  if (!encuesta.value || totalEmpleadosEmpresa.value === 0) return 0;
  return Math.round((encuesta.value.totalParticipantes / totalEmpleadosEmpresa.value) * 100);
});

const modalRecomendacionesAbierto = ref(false);
const alertaSeleccionada = ref(null);
const alertasGestionadas = ref([]);
const modalComunicadoAbierto = ref(false);

const cargarResultados = async () => {
  loading.value = true;
  error.value = null;

  try {
    const encuestaId = route.params.encuestaId;

    console.log('[ResultadosEncuesta] Cargando encuesta:', encuestaId);
    console.log('[ResultadosEncuesta] empresa_id del usuario:', authStore.empresaId);

    // Load survey data from Supabase
    const { data: encuestaData, error: encuestaError } = await supabase
      .from('encuestas')
      .select(`
        *,
        preguntas:preguntas_encuesta(*)
      `)
      .eq('id', encuestaId)
      .eq('empresa_id', authStore.empresaId)
      .single();

    console.log('[ResultadosEncuesta] Encuesta cargada:', encuestaData);
    console.log('[ResultadosEncuesta] Error encuesta:', encuestaError);

    if (encuestaError) throw encuestaError;

    // Get total employees in the company for participation rate
    const { count: empleadosCount, error: empleadosError } = await supabase
      .from('empleados')
      .select('*', { count: 'exact', head: true })
      .eq('empresa_id', authStore.empresaId);

    if (!empleadosError && empleadosCount !== null) {
      totalEmpleadosEmpresa.value = empleadosCount;
    }
    console.log('[ResultadosEncuesta] Total empleados empresa:', totalEmpleadosEmpresa.value);

    // Load responses
    const { data: respuestasData, error: respuestasError } = await supabase
      .from('respuestas_encuesta')
      .select('*')
      .eq('encuesta_id', encuestaId);

    console.log('[ResultadosEncuesta] Respuestas cargadas:', respuestasData?.length || 0, respuestasData);
    console.log('[ResultadosEncuesta] Error respuestas:', respuestasError);

    if (respuestasError) throw respuestasError;

    // Calculate total unique participants (by empleado_id)
    // Filtrar valores null/undefined para contar solo participantes reales
    const empleadoIds = respuestasData
      .map(r => r.empleado_id)
      .filter(id => id !== null && id !== undefined);

    const uniqueEmpleadoIds = new Set(empleadoIds);
    const totalParticipantes = uniqueEmpleadoIds.size;

    console.log('[ResultadosEncuesta] empleado_ids encontrados:', empleadoIds);
    console.log('[ResultadosEncuesta] empleado_ids únicos:', Array.from(uniqueEmpleadoIds));
    console.log('[ResultadosEncuesta] Total participantes únicos:', totalParticipantes);

    // Calcular departamentos únicos
    const departamentosUnicos = new Set(
      respuestasData
        .map(r => r.departamento)
        .filter(d => d !== null && d !== undefined && d !== '')
    );
    const totalDepartamentos = departamentosUnicos.size;
    console.log('[ResultadosEncuesta] Departamentos únicos:', Array.from(departamentosUnicos));
    console.log('[ResultadosEncuesta] Total departamentos:', totalDepartamentos);

    // Process responses per question to generate chart data
    const preguntasConResultados = (encuestaData.preguntas || []).map(pregunta => {
      // Filter responses for this question
      const respuestasPregunta = respuestasData.filter(r => r.pregunta_id === pregunta.id);
      const totalRespuestasPregunta = respuestasPregunta.length;
      console.log(`[ResultadosEncuesta] Pregunta "${pregunta.texto}" tiene ${totalRespuestasPregunta} respuestas`);

      // Count responses by value
      const conteo = {};
      respuestasPregunta.forEach(r => {
        const valor = r.respuesta || 'Sin respuesta';
        conteo[valor] = (conteo[valor] || 0) + 1;
      });

      // Generate labels and data for charts
      let labels = [];
      let data = [];
      let esRespuestaNegativa = false;

      // Variables para cálculo académico del score
      let scorePromedio = null; // Score de 0-100 para esta pregunta
      let esRespuestaNeutral = false; // Mayoría respondió neutral (3 en escala 1-5)

      if (pregunta.tipo === 'escala' || pregunta.tipo === 'escala_numerica' || pregunta.tipo === 'escala_1_5') {
        // For scale questions, show all scale values
        const escalaLabels = ['1 - Muy bajo', '2 - Bajo', '3 - Neutral', '4 - Alto', '5 - Muy alto'];
        labels = escalaLabels;
        data = escalaLabels.map((_, i) => conteo[String(i + 1)] || 0);

        // CÁLCULO ACADÉMICO: Convertir escala Likert a porcentaje real
        // 1=0%, 2=25%, 3=50%, 4=75%, 5=100%
        if (totalRespuestasPregunta > 0) {
          let sumaScore = 0;
          for (let i = 1; i <= 5; i++) {
            const count = conteo[String(i)] || 0;
            const scoreValor = ((i - 1) / 4) * 100; // 1→0%, 2→25%, 3→50%, 4→75%, 5→100%
            sumaScore += count * scoreValor;
          }
          scorePromedio = sumaScore / totalRespuestasPregunta;

          // Clasificación según umbrales académicos
          const negativos = (conteo['1'] || 0) + (conteo['2'] || 0);
          const neutrales = conteo['3'] || 0;
          const positivos = (conteo['4'] || 0) + (conteo['5'] || 0);

          // Negativo si mayoría es 1-2
          esRespuestaNegativa = (negativos / totalRespuestasPregunta) > 0.5;
          // Neutral si mayoría es 3 (ambivalencia)
          esRespuestaNeutral = (neutrales / totalRespuestasPregunta) > 0.5;
        }
      } else if (pregunta.tipo === 'opcion_multiple' || pregunta.tipo === 'seleccion_unica') {
        // For multiple choice, use the options from the question
        const opciones = pregunta.opciones || [];
        labels = opciones;
        data = opciones.map(op => conteo[op] || 0);
        // Check for negative keywords in most common response
        const maxIndex = data.indexOf(Math.max(...data));
        const maxLabel = (labels[maxIndex] || '').toLowerCase();
        esRespuestaNegativa = maxLabel.includes('no') || maxLabel.includes('malo') ||
                             maxLabel.includes('necesita mejorar') || maxLabel.includes('insatisfecho') ||
                             maxLabel.includes('nunca') || maxLabel.includes('raramente');
        // Score basado en posición de la opción más común (asumiendo opciones ordenadas de peor a mejor)
        if (opciones.length > 0 && totalRespuestasPregunta > 0) {
          scorePromedio = (maxIndex / (opciones.length - 1)) * 100;
        }
      } else if (pregunta.tipo === 'si_no') {
        labels = ['Sí', 'No'];
        const siCount = conteo['Sí'] || conteo['si'] || conteo['true'] || conteo['SI'] || 0;
        const noCount = conteo['No'] || conteo['no'] || conteo['false'] || conteo['NO'] || 0;
        data = [siCount, noCount];
        // Negative if "No" is majority (depends on question context - assume "No" is generally negative)
        esRespuestaNegativa = totalRespuestasPregunta > 0 && (noCount / totalRespuestasPregunta) > 0.5;
        // Score: 100% si Sí, 0% si No
        if (totalRespuestasPregunta > 0) {
          scorePromedio = (siCount / totalRespuestasPregunta) * 100;
        }
      } else {
        // For text or other types, just show the distribution of unique responses
        labels = Object.keys(conteo);
        data = Object.values(conteo);
      }

      // Calculate percentages based on total responses for THIS question
      const porcentajes = data.map(val =>
        totalRespuestasPregunta > 0 ? Math.round((val / totalRespuestasPregunta) * 100) : 0
      );

      // Find most common response
      const maxIndex = data.indexOf(Math.max(...data));
      const maxLabel = labels[maxIndex] || 'N/A';
      const maxPorcentaje = porcentajes[maxIndex] || 0;
      const maxCount = data[maxIndex] || 0;

      // Generate insight with correct count
      let insight = '';
      if (totalRespuestasPregunta === 0) {
        insight = 'No hay respuestas registradas para esta pregunta.';
      } else if (totalRespuestasPregunta === 1) {
        insight = `Se recibió 1 respuesta: "${maxLabel}".`;
      } else {
        insight = `De ${totalRespuestasPregunta} respuestas, la más frecuente es "${maxLabel}" con ${maxCount} respuesta${maxCount !== 1 ? 's' : ''} (${maxPorcentaje}%).`;
      }

      // Generar recomendación basada en análisis académico
      let recomendacion = null;
      let nivelRiesgo = 'bajo'; // bajo, medio, alto, critico

      if (totalRespuestasPregunta > 0) {
        // Usar scorePromedio si está disponible, sino usar lógica anterior
        const scoreParaAnalisis = scorePromedio !== null ? scorePromedio : (esRespuestaNegativa ? 40 : 80);

        if (scoreParaAnalisis < 53) {
          nivelRiesgo = 'critico';
          recomendacion = {
            tipo: 'critico',
            titulo: 'CRÍTICO - Intervención urgente',
            descripcion: `Score: ${Math.round(scoreParaAnalisis)}%. Estado crítico que requiere intervención inmediata. Alto riesgo de impacto negativo en rotación y productividad.`
          };
        } else if (scoreParaAnalisis < 66) {
          nivelRiesgo = 'alto';
          recomendacion = {
            tipo: 'atencion',
            titulo: 'Requiere atención prioritaria',
            descripcion: `Score: ${Math.round(scoreParaAnalisis)}%. Situación preocupante. Se recomienda investigar causas y desarrollar plan de acción inmediato.`
          };
        } else if (scoreParaAnalisis < 75 || esRespuestaNeutral) {
          nivelRiesgo = 'medio';
          recomendacion = {
            tipo: 'mejora',
            titulo: 'Oportunidad de mejora',
            descripcion: esRespuestaNeutral
              ? `Score: ${Math.round(scoreParaAnalisis)}%. Mayoría de respuestas neutrales indica ambivalencia. Requiere investigación para entender causas.`
              : `Score: ${Math.round(scoreParaAnalisis)}%. Área con potencial de mejora. Considere acciones proactivas.`
          };
        } else if (scoreParaAnalisis < 88) {
          nivelRiesgo = 'bajo';
          // Área saludable, no requiere acción inmediata pero puede mostrar info
          recomendacion = null;
        } else {
          nivelRiesgo = 'optimo';
          // Área óptima
          recomendacion = null;
        }
      }

      return {
        ...pregunta,
        resultados: {
          labels,
          data,
          porcentajes,
          totalRespuestas: totalRespuestasPregunta
        },
        insight,
        recomendacion,
        esRespuestaNegativa,
        esRespuestaNeutral,
        scorePromedio,
        nivelRiesgo
      };
    });

    // CÁLCULO ACADÉMICO del índice de bienestar global
    // Promedio ponderado de los scorePromedio de cada pregunta
    let sumaScores = 0;
    let preguntasConScore = 0;

    preguntasConResultados.forEach(p => {
      if (p.resultados.totalRespuestas > 0 && p.scorePromedio !== null) {
        sumaScores += p.scorePromedio;
        preguntasConScore++;
      }
    });

    // Calcular promedio. Si todas son 3/5, el resultado será 50%, NO 100%
    const calculatedBienestar = preguntasConScore > 0
      ? Math.round(sumaScores / preguntasConScore)
      : 50; // Default a 50% si no hay datos

    console.log('[ResultadosEncuesta] Cálculo de bienestar académico:');
    console.log(`  - Suma de scores: ${sumaScores}`);
    console.log(`  - Preguntas con score: ${preguntasConScore}`);
    console.log(`  - Bienestar calculado: ${calculatedBienestar}%`);

    indiceBienestarGlobal.value = calculatedBienestar;

    encuesta.value = {
      ...encuestaData,
      preguntas: preguntasConResultados,
      totalParticipantes,
      resultados: respuestasData
    };

    console.log('[ResultadosEncuesta] Encuesta procesada:', encuesta.value);
    console.log('[ResultadosEncuesta] Índice de bienestar calculado:', calculatedBienestar);

    await nextTick();
    crearGraficos();

  } catch (err) {
    error.value = err.message || 'Error al cargar los resultados';
    console.error('Error cargando resultados:', err);
  } finally {
    loading.value = false;
  }
};

const crearGraficos = () => {
  if (!encuesta.value?.preguntas) return;

  encuesta.value.preguntas.forEach(pregunta => {
    if (pregunta.resultados) {
      setTimeout(() => {
        const canvas = document.getElementById(`chart-${pregunta.id}`);
        if (canvas) {
          if (charts.value[pregunta.id]) {
            charts.value[pregunta.id].destroy();
          }

          const ctx = canvas.getContext('2d');

          const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];
          const totalRespuestas = pregunta.resultados.totalRespuestas || pregunta.resultados.data.reduce((a, b) => a + b, 0);

          // Generate labels with percentages
          const labelsConPorcentaje = pregunta.resultados.labels.map((label, i) => {
            const porcentaje = totalRespuestas > 0
              ? Math.round((pregunta.resultados.data[i] / totalRespuestas) * 100)
              : 0;
            return `${label} (${porcentaje}%)`;
          });

          charts.value[pregunta.id] = new Chart(ctx, {
            type: 'doughnut',
            data: {
              labels: labelsConPorcentaje,
              datasets: [{
                data: pregunta.resultados.data,
                backgroundColor: colors.slice(0, pregunta.resultados.labels.length),
                borderColor: '#ffffff',
                borderWidth: 3,
                hoverOffset: 8
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom',
                  labels: {
                    padding: 15,
                    usePointStyle: true,
                    pointStyle: 'circle',
                    font: {
                      size: 12,
                      weight: '500'
                    },
                    generateLabels: function(chart) {
                      const data = chart.data;
                      if (data.labels.length && data.datasets.length) {
                        return data.labels.map((label, i) => {
                          const value = data.datasets[0].data[i];
                          const backgroundColor = data.datasets[0].backgroundColor[i];
                          return {
                            text: label,
                            fillStyle: backgroundColor,
                            strokeStyle: '#ffffff',
                            lineWidth: 2,
                            hidden: false,
                            index: i,
                            fontColor: value > 0 ? '#374151' : '#9CA3AF'
                          };
                        });
                      }
                      return [];
                    }
                  }
                },
                tooltip: {
                  backgroundColor: 'rgba(0, 0, 0, 0.85)',
                  titleColor: '#ffffff',
                  bodyColor: '#ffffff',
                  borderColor: '#ffffff',
                  borderWidth: 1,
                  padding: 12,
                  callbacks: {
                    label: function(context) {
                      const total = context.dataset.data.reduce((a, b) => a + b, 0);
                      const percentage = total > 0 ? Math.round((context.parsed / total) * 100) : 0;
                      return `${context.parsed} respuesta${context.parsed !== 1 ? 's' : ''} (${percentage}%)`;
                    }
                  }
                }
              },
              cutout: '60%',
              animation: {
                animateRotate: true,
                duration: 800
              }
            }
          });
        }
      }, 100);
    }
  });
};

const volverAtras = () => {
  router.push('/admin/encuestas');
};

const abrirModalComunicado = () => {
  modalComunicadoAbierto.value = true;
};

const cerrarModalComunicado = () => {
  modalComunicadoAbierto.value = false;
};

const handleComunicadoEnviado = (comunicado) => {
  toast.add({
    severity: 'success',
    summary: 'Comunicado enviado',
    detail: `Se ha enviado el comunicado a ${comunicado.total_destinatarios} personas`,
    life: 4000
  });
};

const handleSolicitarServicio = (servicioId) => {
  router.push({ name: 'admin-servicio-detalle', params: { id: servicioId } });
};

const exportarResultados = () => {
  toast.add({
    severity: 'info',
    summary: 'Exportando resultados',
    detail: 'Los resultados se están preparando para descarga...',
    life: 4000
  });
};

const crearComunicado = () => {
  router.push('/admin/crear-comunicado');
};

const tieneGruposConPocasRespuestas = (pregunta) => {
  if (!pregunta.resultadosPorGrupo) return false;
  return pregunta.resultadosPorGrupo.some(grupo => grupo.total_respuestas < 5);
};

/**
 * Colores basados en umbrales académicos validados (IWBS Study)
 * 0-53: Crítico (rojo)
 * 53-66: Riesgo alto (naranja)
 * 66-75: Moderado (amarillo)
 * 75-88: Saludable (verde claro)
 * 88-100: Óptimo (verde)
 */
const getBienestarColorClasses = (valor) => {
  if (valor < 53) {
    return {
      bgClass: 'bg-red-100',
      bgLightClass: 'bg-red-50',
      textClass: 'text-red-600',
      textDarkClass: 'text-red-800',
      borderClass: 'border-red-200',
      badgeClass: 'bg-red-100 text-red-700'
    };
  } else if (valor < 66) {
    return {
      bgClass: 'bg-orange-100',
      bgLightClass: 'bg-orange-50',
      textClass: 'text-orange-600',
      textDarkClass: 'text-orange-800',
      borderClass: 'border-orange-200',
      badgeClass: 'bg-orange-100 text-orange-700'
    };
  } else if (valor < 75) {
    return {
      bgClass: 'bg-yellow-100',
      bgLightClass: 'bg-yellow-50',
      textClass: 'text-yellow-600',
      textDarkClass: 'text-yellow-800',
      borderClass: 'border-yellow-200',
      badgeClass: 'bg-yellow-100 text-yellow-700'
    };
  } else if (valor < 88) {
    return {
      bgClass: 'bg-teal-100',
      bgLightClass: 'bg-teal-50',
      textClass: 'text-teal-600',
      textDarkClass: 'text-teal-800',
      borderClass: 'border-teal-200',
      badgeClass: 'bg-teal-100 text-teal-700'
    };
  } else {
    return {
      bgClass: 'bg-green-100',
      bgLightClass: 'bg-green-50',
      textClass: 'text-green-600',
      textDarkClass: 'text-green-800',
      borderClass: 'border-green-200',
      badgeClass: 'bg-green-100 text-green-700'
    };
  }
};

/**
 * Interpretación basada en umbrales académicos validados (IWBS Study)
 * Basado en investigación con 11,702 empleados
 */
const getInterpretacionTexto = (valor) => {
  if (valor < 53) {
    return {
      nivel: 'Crítico',
      texto: 'Estado crítico. Alto riesgo de rotación, absentismo y baja productividad. Intervención urgente obligatoria.'
    };
  } else if (valor < 66) {
    return {
      nivel: 'Riesgo Alto',
      texto: 'Situación preocupante. El equipo muestra signos significativos de malestar. Acción prioritaria requerida.'
    };
  } else if (valor < 75) {
    return {
      nivel: 'Moderado',
      texto: 'Bienestar moderado con áreas de preocupación. Requiere atención proactiva y plan de mejora.'
    };
  } else if (valor < 88) {
    return {
      nivel: 'Saludable',
      texto: 'Bienestar positivo. El equipo está en buenas condiciones. Monitoreo continuo recomendado.'
    };
  } else {
    return {
      nivel: 'Óptimo',
      texto: 'Bienestar excepcional. Mantener y reforzar las prácticas actuales.'
    };
  }
};

/**
 * Interpretación global basada en umbrales académicos
 */
const getInterpretacionGlobal = (valor) => {
  if (valor < 53) {
    return `El bienestar global es del ${valor}%. Este resultado indica un estado CRÍTICO con alto riesgo de rotación, absentismo y baja productividad. Se requiere intervención urgente e inmediata para abordar las áreas problemáticas.`;
  } else if (valor < 66) {
    return `El bienestar global es del ${valor}%. Este resultado indica una situación PREOCUPANTE. El equipo muestra signos de malestar que requieren acción prioritaria para evitar deterioro.`;
  } else if (valor < 75) {
    return `El bienestar global es del ${valor}%. Este resultado muestra un nivel MODERADO con áreas de preocupación. Se recomienda desarrollar un plan de mejora proactivo y monitorear continuamente.`;
  } else if (valor < 88) {
    return `El bienestar global es del ${valor}%. Este resultado refleja un estado SALUDABLE. El equipo está en buenas condiciones con oportunidades de mejora incremental. Continuar monitoreando.`;
  } else {
    return `El bienestar global es del ${valor}%. Este resultado refleja un estado ÓPTIMO de bienestar. Se recomienda mantener las prácticas actuales y compartir las mejores prácticas con otros equipos.`;
  }
};

const getEstadoGeneralTexto = (valor) => {
  if (valor < 53) {
    return 'Estado CRÍTICO de bienestar. Intervención urgente obligatoria.';
  } else if (valor < 66) {
    return 'Situación PREOCUPANTE. Acción prioritaria requerida.';
  } else if (valor < 75) {
    return 'Bienestar MODERADO. Plan de mejora proactivo recomendado.';
  } else if (valor < 88) {
    return 'Bienestar SALUDABLE. Monitoreo continuo recomendado.';
  } else {
    return 'Bienestar ÓPTIMO. Mantener las prácticas actuales.';
  }
};

const getTendenciaClasses = (tendencia) => {
  if (tendencia === 'up') return 'bg-green-100 text-green-700';
  if (tendencia === 'down') return 'bg-red-100 text-red-700';
  return 'bg-gray-100 text-gray-700';
};

const getTendenciaIcon = (tendencia) => {
  if (tendencia === 'up') return TrendingUp;
  if (tendencia === 'down') return TrendingDown;
  return Minus;
};

const getTendenciaTexto = (tendencia) => {
  if (tendencia === 'up') return 'En mejora';
  if (tendencia === 'down') return 'En descenso';
  return 'Estable';
};

/**
 * Categorías interpretadas usando cálculo académico de scores
 */
const categoriasInterpretadas = computed(() => {
  if (!encuesta.value?.preguntas) return [];

  // Group questions by category and calculate ACADEMIC score average
  const categoriaMap = {};
  const icons = {
    'salud-mental': Brain,
    'carga-laboral': Zap,
    'comunicacion': Megaphone,
    'bienestar': Heart,
    'clima-laboral': Smile,
    'desarrollo': Target,
    'ergonomia': Activity,
    'general': Heart
  };

  encuesta.value.preguntas.forEach(pregunta => {
    const cat = pregunta.categoria || 'general';
    if (!categoriaMap[cat]) {
      categoriaMap[cat] = { total: 0, sumaScores: 0, preguntasConScore: 0 };
    }
    categoriaMap[cat].total++;

    // Usar scorePromedio si está disponible
    if (pregunta.scorePromedio !== null && pregunta.scorePromedio !== undefined) {
      categoriaMap[cat].sumaScores += pregunta.scorePromedio;
      categoriaMap[cat].preguntasConScore++;
    }
  });

  const categoriaLabels = {
    'salud-mental': 'Salud Mental',
    'carga-laboral': 'Carga Laboral',
    'comunicacion': 'Comunicación',
    'bienestar': 'Bienestar Personal',
    'clima-laboral': 'Clima Laboral',
    'desarrollo': 'Desarrollo Profesional',
    'ergonomia': 'Ergonomía',
    'general': 'General'
  };

  return Object.entries(categoriaMap).map(([cat, data]) => {
    // Calcular score promedio de la categoría usando método académico
    const valor = data.preguntasConScore > 0
      ? Math.round(data.sumaScores / data.preguntasConScore)
      : 50;

    const interpretacion = getInterpretacionTexto(valor);

    // Descripción basada en umbrales académicos
    let descripcion = '';
    if (valor < 53) {
      descripcion = `Estado CRÍTICO. Score promedio: ${valor}%. Requiere intervención urgente e inmediata.`;
    } else if (valor < 66) {
      descripcion = `Situación PREOCUPANTE. Score promedio: ${valor}%. Acción prioritaria requerida.`;
    } else if (valor < 75) {
      descripcion = `Nivel MODERADO. Score promedio: ${valor}%. Área con potencial de mejora. Plan proactivo recomendado.`;
    } else if (valor < 88) {
      descripcion = `Estado SALUDABLE. Score promedio: ${valor}%. Mantener monitoreo continuo.`;
    } else {
      descripcion = `Estado ÓPTIMO. Score promedio: ${valor}%. Mantener y reforzar prácticas actuales.`;
    }

    return {
      nombre: categoriaLabels[cat] || cat,
      valor,
      icon: icons[cat] || Heart,
      ...interpretacion,
      interpretacion: descripcion,
      colorClasses: getBienestarColorClasses(valor)
    };
  });
});

/**
 * Alertas basadas en umbrales académicos validados
 * <53: Crítico, 53-66: Riesgo Alto, 66-75: Moderado
 */
const alertasActivas = computed(() => {
  if (!encuesta.value?.preguntas) return [];

  const alertas = [];

  categoriasInterpretadas.value.forEach(categoria => {
    const alertaId = `${categoria.nombre}-${categoria.valor}`;
    const gestionada = alertasGestionadas.value.includes(alertaId);

    if (categoria.valor < 53) {
      alertas.push({
        id: alertaId,
        tipo: 'critica',
        categoria: categoria.nombre,
        valor: categoria.valor,
        titulo: `CRÍTICO: ${categoria.nombre}`,
        mensaje: `Score: ${categoria.valor}%. Estado crítico con alto riesgo de rotación, absentismo y baja productividad. Requiere intervención URGENTE e inmediata.`,
        gestionada
      });
    } else if (categoria.valor < 66) {
      alertas.push({
        id: alertaId,
        tipo: 'alta',
        categoria: categoria.nombre,
        valor: categoria.valor,
        titulo: `Riesgo alto en ${categoria.nombre}`,
        mensaje: `Score: ${categoria.valor}%. Situación preocupante que requiere acción prioritaria para evitar deterioro.`,
        gestionada
      });
    } else if (categoria.valor < 75) {
      alertas.push({
        id: alertaId,
        tipo: 'moderada',
        categoria: categoria.nombre,
        valor: categoria.valor,
        titulo: `Atención moderada en ${categoria.nombre}`,
        mensaje: `Score: ${categoria.valor}%. Área con potencial de mejora. Se recomienda plan de acción proactivo.`,
        gestionada
      });
    }
    // Scores >= 75 no generan alertas (saludable/óptimo)
  });

  return alertas;
});

const abrirModalRecomendaciones = (alerta) => {
  alertaSeleccionada.value = alerta;
  modalRecomendacionesAbierto.value = true;
};

const marcarAlertaComoGestionada = (alerta) => {
  if (!alertasGestionadas.value.includes(alerta.id)) {
    alertasGestionadas.value.push(alerta.id);
  }

  toast.add({
    severity: 'success',
    summary: 'Alerta gestionada',
    detail: `La alerta de "${alerta.categoria}" ha sido marcada como gestionada.`,
    life: 4000
  });
};

// Handlers para RecomendacionesSmart
const verDetalleRecomendacion = (recomendacion) => {
  console.log('[ResultadosEncuesta] Ver detalle de recomendación:', recomendacion);
  // Por ahora, mostrar en el modal existente adaptando los datos
  alertaSeleccionada.value = {
    id: recomendacion.id,
    tipo: recomendacion.nivel_riesgo === 'critico' ? 'critica' : recomendacion.nivel_riesgo,
    categoria: recomendacion.dimension_afectada,
    valor: recomendacion.score_dimension,
    titulo: recomendacion.titulo,
    mensaje: recomendacion.descripcion,
    recomendacion_id: recomendacion.id,
    objetivo_smart: recomendacion.objetivo_especifico,
    metrica_exito: recomendacion.metrica_exito,
    acciones_sugeridas: recomendacion.acciones_sugeridas,
    plazo_dias: recomendacion.plazo_dias
  };
  modalRecomendacionesAbierto.value = true;
};

const onRecomendacionActualizada = (recomendacion) => {
  console.log('[ResultadosEncuesta] Recomendación actualizada:', recomendacion);
  toast.add({
    severity: 'success',
    summary: 'Plan iniciado',
    detail: `El plan "${recomendacion.titulo}" está ahora en progreso.`,
    life: 4000
  });
};

/**
 * Conteo de alertas por tipo usando umbrales académicos
 */
const alertasPorTipo = computed(() => {
  const conteo = {
    criticas: 0,    // < 53
    altas: 0,       // 53-66
    moderadas: 0,   // 66-75
    estables: 0     // >= 75
  };

  categoriasInterpretadas.value.forEach(categoria => {
    if (categoria.valor < 53) {
      conteo.criticas++;
    } else if (categoria.valor < 66) {
      conteo.altas++;
    } else if (categoria.valor < 75) {
      conteo.moderadas++;
    } else {
      conteo.estables++;
    }
  });

  return conteo;
});

const getAlertaClasses = (tipo) => {
  if (tipo === 'critica') return 'bg-red-50 border-red-200';
  if (tipo === 'alta') return 'bg-orange-50 border-orange-200';
  if (tipo === 'moderada') return 'bg-yellow-50 border-yellow-200';
  return 'bg-green-50 border-green-200';
};

const getAlertaIconClasses = (tipo) => {
  if (tipo === 'critica') return 'bg-red-500';
  if (tipo === 'alta') return 'bg-orange-500';
  if (tipo === 'moderada') return 'bg-yellow-500';
  return 'bg-green-500';
};

const getAlertaIcon = (tipo) => {
  if (tipo === 'critica') return AlertTriangle;
  if (tipo === 'alta') return ShieldAlert;
  if (tipo === 'moderada') return AlertCircle;
  return CheckCircle;
};

const getAlertaTitleClasses = (tipo) => {
  if (tipo === 'critica') return 'text-red-900';
  if (tipo === 'alta') return 'text-orange-900';
  if (tipo === 'moderada') return 'text-yellow-900';
  return 'text-green-900';
};

const getAlertaTextClasses = (tipo) => {
  if (tipo === 'critica') return 'text-red-700';
  if (tipo === 'alta') return 'text-orange-700';
  if (tipo === 'moderada') return 'text-yellow-700';
  return 'text-green-700';
};

const getAlertaBadgeClasses = (tipo) => {
  if (tipo === 'critica') return 'bg-red-100 text-red-700';
  if (tipo === 'alta') return 'bg-orange-100 text-orange-700';
  if (tipo === 'moderada') return 'bg-yellow-100 text-yellow-700';
  return 'bg-green-100 text-green-700';
};

const getAlertaBorderClasses = (tipo) => {
  if (tipo === 'critica') return 'border-red-200';
  if (tipo === 'alta') return 'border-orange-200';
  if (tipo === 'moderada') return 'border-yellow-200';
  return 'border-green-200';
};

onMounted(() => {
  cargarResultados();
});
</script>

<style scoped>
canvas {
  max-width: 100% !important;
  height: auto !important;
}
</style>
