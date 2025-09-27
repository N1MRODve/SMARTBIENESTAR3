// /src/services/mock/analytics.service.js

// Simulación de datos de encuestas que serían la base del análisis.
// Las puntuaciones están sobre 10.
const respuestasSimuladas = [
    { salud_mental: 6, carga_laboral: 7, comunicacion: 9, ergonomia: 8 },
    { salud_mental: 5, carga_laboral: 6, comunicacion: 8, ergonomia: 9 },
    { salud_mental: 8, carga_laboral: 8, comunicacion: 9, ergonomia: 8 },
    { salud_mental: 4, carga_laboral: 5, comunicacion: 7, ergonomia: 7 },
];

/**
 * Calcula y devuelve un resumen analítico del bienestar de la empresa.
 */
export const getAnalyticsSummary = async () => {
    const totalRespuestas = respuestasSimuladas.length;
    
    // Calcula las puntuaciones promedio para cada dimensión
    const subScores = [
        { 
          titulo: 'Salud Mental', 
          puntuacion: parseFloat((respuestasSimuladas.reduce((acc, r) => acc + r.salud_mental, 0) / totalRespuestas).toFixed(1)) 
        },
        { 
          titulo: 'Carga Laboral', 
          puntuacion: parseFloat((respuestasSimuladas.reduce((acc, r) => acc + r.carga_laboral, 0) / totalRespuestas).toFixed(1)) 
        },
        { 
          titulo: 'Comunicación', 
          puntuacion: parseFloat((respuestasSimuladas.reduce((acc, r) => acc + r.comunicacion, 0) / totalRespuestas).toFixed(1)) 
        },
        { 
          titulo: 'Ergonomía', 
          puntuacion: parseFloat((respuestasSimuladas.reduce((acc, r) => acc + r.ergonomia, 0) / totalRespuestas).toFixed(1)) 
        }
    ];

    // Calcula el Wellness Score general como el promedio de las sub-puntuaciones
    const wellnessScore = parseFloat((subScores.reduce((acc, s) => acc + s.puntuacion, 0) / subScores.length).toFixed(1));

    // Encuentra la fortaleza y debilidad principal
    const sortedScores = [...subScores].sort((a, b) => a.puntuacion - b.puntuacion);
    const debilidad = sortedScores[0];
    const fortaleza = sortedScores[sortedScores.length - 1];

    const insights = [
        { type: 'strength', text: `La ${fortaleza.titulo.toLowerCase()} (${fortaleza.puntuacion}) es el punto más fuerte del equipo.` },
        { type: 'weakness', text: `La ${debilidad.titulo.toLowerCase()} (${debilidad.puntuacion}) es el área con mayor oportunidad de mejora.` }
    ];

    const summary = {
        wellnessScore,
        subScores,
        insights
    };

    return new Promise(resolve => setTimeout(() => resolve(summary), 500));
};

/**
 * Función auxiliar para obtener el color apropiado según la puntuación
 */
export const getScoreColor = (score) => {
    if (score >= 8) {
        return { color: '#10B981', label: 'Excelente' }; // Verde
    } else if (score >= 6) {
        return { color: '#F59E0B', label: 'Bueno' }; // Amarillo
    } else if (score >= 4) {
        return { color: '#EF4444', label: 'Necesita Mejora' }; // Rojo
    } else {
        return { color: '#DC2626', label: 'Crítico' }; // Rojo oscuro
    }
};