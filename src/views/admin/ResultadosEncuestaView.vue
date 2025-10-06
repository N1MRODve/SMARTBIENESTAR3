<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <Header subtitulo="Resultados de Encuesta" />
    
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
                    <span>{{ encuesta.totalParticipantes }} participantes</span>
                  </div>
                  <div class="flex items-center">
                    <TrendingUp class="h-4 w-4 mr-1" />
                    <span>{{ Math.round((encuesta.totalParticipantes / 50) * 100) }}% tasa de participación</span>
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
                      <div class="space-y-2">
                        <div 
                          v-for="(valor, labelIndex) in pregunta.resultados.data" 
                          :key="labelIndex"
                          class="flex items-center justify-between p-2 bg-gray-50 rounded"
                        >
                          <span class="text-sm text-gray-700">{{ pregunta.resultados.labels[labelIndex] }}</span>
                          <div class="flex items-center">
                            <span class="text-sm font-medium text-gray-900 mr-2">{{ valor }} respuestas</span>
                            <span class="text-xs text-gray-500">
                              ({{ Math.round((valor / encuesta.totalParticipantes) * 100) }}%)
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Resultados por Departamento (si existen) -->
                    <div v-if="pregunta.resultadosPorGrupo && pregunta.resultadosPorGrupo.length > 0