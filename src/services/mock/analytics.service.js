// /src/services/mock/analytics.service.js

import { getSurveyById } from './encuestas.service.js';

// Función principal para calcular el Wellness Score
export const calculateWellnessScore = async () => {
  try {
    // Obtener la encuesta más reciente (ID 1 es la activa)
    const latestSurvey = await getSurveyById(1);
    
    if (!latestSurvey || !latestSurvey.respuestas || latestSurvey.respuestas.length === 0) {
      return getDefaultScores();
    }

    const responses = latestSurvey.respuestas;
    const questions = latestSurvey.preguntas;
    
    // Calcular puntuaciones por dimensión
    const dimensionScores = calculateDimensionScores(responses, questions);
    
    // Calcular puntuación general
    const overallScore = calculateOverallScore(dimensionScores);
    
    // Crear array de sub-scores para el dashboard
    const subScores = createSubScoresArray(dimensionScores);
    
    // Identificar fortalezas y debilidades
    const insights = generateInsights(dimensionScores);
    
    // Calcular tendencias (comparar con encuesta anterior si existe)
    const trends = await calculateTrends();
    
    return {
      overallScore: Math.round(overallScore * 10) / 10,
      subScores,
      dimensionScores,
      insights,
      trends,
      totalResponses: responses.length,
      responseRate: Math.round((responses.length / 120) * 100), // 120 empleados simulados
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error calculating wellness score:', error);
    return getDefaultScores();
  }
};

// Crear array de sub-scores para el dashboard
const createSubScoresArray = (dimensionScores) => {
  const iconMap = {
    mentalHealth: '🧠',
    workLifeBalance: '⚖️',
    workEnvironment: '🏢',
    communication: '💬'
  };

  const descriptionMap = {
    mentalHealth: 'Nivel de estrés y bienestar psicológico',
    workLifeBalance: 'Equilibrio entre vida personal y laboral',
    workEnvironment: 'Calidad del ambiente y herramientas de trabajo',
    communication: 'Efectividad de la comunicación interna'
  };

  return Object.entries(dimensionScores).map(([key, data]) => ({
    titulo: data.name,
    puntuacion: Math.round(data.score * 10) / 10,
    descripcion: descriptionMap[key] || '',
    icono: iconMap[key] || '📊',
    tendencia: Math.random() * 2 - 1 // Simulamos tendencia aleatoria por ahora
  }));
};

// Calcular puntuaciones por dimensión basado en las preguntas
const calculateDimensionScores = (responses, questions) => {
  const dimensions = {
    mentalHealth: { name: 'Salud Mental', score: 0, count: 0, icon: '🧠' },
    workLifeBalance: { name: 'Balance Vida-Trabajo', score: 0, count: 0, icon: '⚖️' },
    workEnvironment: { name: 'Ambiente Laboral', score: 0, count: 0, icon: '🏢' },
    communication: { name: 'Comunicación', score: 0, count: 0, icon: '💬' }
  };

  questions.forEach(question => {
    const dimension = categorizeDimension(question.texto);
    if (!dimension) return;

    responses.forEach(response => {
      const answer = response.respuestas[question.id];
      if (answer === undefined) return;

      const score = scoreAnswer(answer, question.tipo);
      dimensions[dimension].score += score;
      dimensions[dimension].count++;
    });
  });

  // Calcular promedios
  Object.keys(dimensions).forEach(key => {
    if (dimensions[key].count > 0) {
      dimensions[key].score = dimensions[key].score / dimensions[key].count;
    } else {
      dimensions[key].score = 5; // Valor neutral si no hay datos
    }
  });

  return dimensions;
};

// Categorizar preguntas por dimensión
const categorizeDimension = (questionText) => {
  const text = questionText.toLowerCase();
  
  if (text.includes('estrés') || text.includes('ansiedad') || text.includes('mental')) {
    return 'mentalHealth';
  }
  if (text.includes('balance') || text.includes('vida') || text.includes('trabajo')) {
    return 'workLifeBalance';
  }
  if (text.includes('herramientas') || text.includes('ambiente') || text.includes('espacio')) {
    return 'workEnvironment';
  }
  if (text.includes('comunicación') || text.includes('equipo') || text.includes('colaboración')) {
    return 'communication';
  }
  
  return 'workEnvironment'; // Categoría por defecto
};

// Convertir respuestas a puntuaciones numéricas
const scoreAnswer = (answer, questionType) => {
  if (questionType === 'escala_1_5') {
    return parseFloat(answer) * 2; // Convertir escala 1-5 a 2-10
  }
  
  if (questionType === 'si_no') {
    return answer === 'Sí' ? 8 : 3;
  }
  
  if (questionType === 'opcion_multiple') {
    // Mapear respuestas comunes a puntuaciones
    const scoreMap = {
      'bajo': 9,
      'medio': 5,
      'alto': 2,
      'muy satisfecho': 10,
      'satisfecho': 7,
      'neutral': 5,
      'insatisfecho': 3,
      'muy insatisfecho': 1
    };
    
    const normalizedAnswer = answer.toLowerCase();
    return scoreMap[normalizedAnswer] || 5;
  }
  
  return 5; // Valor neutral por defecto
};

// Calcular puntuación general
const calculateOverallScore = (dimensionScores) => {
  const scores = Object.values(dimensionScores).map(d => d.score);
  return scores.reduce((sum, score) => sum + score, 0) / scores.length;
};

// Generar insights (fortalezas y debilidades)
const generateInsights = (dimensionScores) => {
  const sortedDimensions = Object.entries(dimensionScores)
    .map(([key, data]) => ({ key, ...data }))
    .sort((a, b) => b.score - a.score);

  const strengths = sortedDimensions.slice(0, 2).map(dim => ({
    type: 'strength',
    title: `Fortaleza: ${dim.name}`,
    description: `Puntuación alta de ${dim.score.toFixed(1)}/10`,
    icon: dim.icon,
    score: dim.score
  }));

  const weaknesses = sortedDimensions.slice(-2).map(dim => ({
    type: 'weakness',
    title: `Área de Mejora: ${dim.name}`,
    description: `Puntuación de ${dim.score.toFixed(1)}/10 requiere atención`,
    icon: dim.icon,
    score: dim.score
  }));

  return [...strengths, ...weaknesses];
};

// Calcular tendencias comparando con encuesta anterior
const calculateTrends = async () => {
  try {
    const previousSurvey = await getSurveyById(2);
    if (!previousSurvey || !previousSurvey.respuestas) {
      return { available: false };
    }

    // Calcular scores de encuesta anterior
    const previousDimensions = calculateDimensionScores(
      previousSurvey.respuestas, 
      previousSurvey.preguntas
    );
    const previousOverall = calculateOverallScore(previousDimensions);

    // Obtener scores actuales
    const currentSurvey = await getSurveyById(1);
    const currentDimensions = calculateDimensionScores(
      currentSurvey.respuestas, 
      currentSurvey.preguntas
    );
    const currentOverall = calculateOverallScore(currentDimensions);

    return {
      available: true,
      overallChange: currentOverall - previousOverall,
      dimensionChanges: Object.keys(currentDimensions).reduce((acc, key) => {
        acc[key] = currentDimensions[key].score - (previousDimensions[key]?.score || 5);
        return acc;
      }, {})
    };
  } catch (error) {
    return { available: false };
  }
};

// Valores por defecto si no hay datos
const getDefaultScores = () => ({
  overallScore: 6.5,
  subScores: [
    { titulo: 'Salud Mental', puntuacion: 6.2, descripcion: 'Nivel de estrés y bienestar psicológico', icono: '🧠', tendencia: -0.3 },
    { titulo: 'Balance Vida-Trabajo', puntuacion: 5.8, descripcion: 'Equilibrio entre vida personal y laboral', icono: '⚖️', tendencia: -0.5 },
    { titulo: 'Ambiente Laboral', puntuacion: 7.1, descripcion: 'Calidad del ambiente y herramientas de trabajo', icono: '🏢', tendencia: 0.4 },
    { titulo: 'Comunicación', puntuacion: 6.9, descripcion: 'Efectividad de la comunicación interna', icono: '💬', tendencia: 0.2 }
  ],
  dimensionScores: {
    mentalHealth: { name: 'Salud Mental', score: 6.2, count: 0, icon: '🧠' },
    workLifeBalance: { name: 'Balance Vida-Trabajo', score: 5.8, count: 0, icon: '⚖️' },
    workEnvironment: { name: 'Ambiente Laboral', score: 7.1, count: 0, icon: '🏢' },
    communication: { name: 'Comunicación', score: 6.9, count: 0, icon: '💬' }
  },
  insights: [
    {
      type: 'strength',
      title: 'Fortaleza: Ambiente Laboral',
      description: 'Puntuación alta de 7.1/10',
      icon: '🏢',
      score: 7.1
    },
    {
      type: 'strength',
      title: 'Fortaleza: Comunicación',
      description: 'Puntuación alta de 6.9/10',
      icon: '💬',
      score: 6.9
    },
    {
      type: 'weakness',
      title: 'Área de Mejora: Balance Vida-Trabajo',
      description: 'Puntuación de 5.8/10 requiere atención',
      icon: '⚖️',
      score: 5.8
    },
    {
      type: 'weakness',
      title: 'Área de Mejora: Salud Mental',
      description: 'Puntuación de 6.2/10 requiere atención',
      icon: '🧠',
      score: 6.2
    }
  ],
  trends: { available: false },
  totalResponses: 0,
  responseRate: 0,
  lastUpdated: new Date().toISOString()
});

// Función auxiliar para obtener el color basado en la puntuación
export const getScoreColor = (score) => {
  if (score >= 7.5) return { color: '#10B981', label: 'Excelente' };
  if (score >= 6.5) return { color: '#F59E0B', label: 'Bueno' };
  if (score >= 5.0) return { color: '#EF4444', label: 'Necesita Mejora' };
  return { color: '#DC2626', label: 'Crítico' };
};

// Función para obtener recomendaciones basadas en el score
export const getScoreRecommendations = (score) => {
  if (score >= 8.0) {
    return 'Excelente nivel de bienestar. Mantener las buenas prácticas.';
  }
  if (score >= 6.5) {
    return 'Buen nivel de bienestar con oportunidades de mejora.';
  }
  if (score >= 5.0) {
    return 'Nivel moderado. Se recomienda implementar acciones de mejora.';
  }
  return 'Nivel crítico. Se requiere atención inmediata y acciones correctivas.';
};