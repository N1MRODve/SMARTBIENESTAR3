// /src/services/mock/analytics.service.js
import { ref } from 'vue';

// Simulación de datos de encuestas que serían la base del análisis
const respuestasSimuladas = [
    { 'salud_mental': 6, 'carga_laboral': 7, 'comunicacion': 9, 'ergonomia': 8 },
    { 'salud_mental': 5, 'carga_laboral': 6, 'comunicacion': 8, 'ergonomia': 9 },
    { 'salud_mental': 8, 'carga_laboral': 8, 'comunicacion': 9, 'ergonomia': 8 },
    { 'salud_mental': 4, 'carga_laboral': 5, 'comunicacion': 7, 'ergonomia': 7 },
];

/**
 * Calcula y devuelve un resumen analítico del bienestar de la empresa.
 */
export const getAnalyticsSummary = async () => {
    // Lógica de cálculo simulada
    const totalRespuestas = respuestasSimuladas.length;
    
    const sumaSaludMental = respuestasSimuladas.reduce((acc, r) => acc + r.salud_mental, 0);
    const sumaCargaLaboral = respuestasSimuladas.reduce((acc, r) => acc + r.carga_laboral, 0);
    const sumaComunicacion = respuestasSimuladas.reduce((acc, r) => acc + r.comunicacion, 0);
    const sumaErgonomia = respuestasSimuladas.reduce((acc, r) => acc + r.ergonomia, 0);

    const subScores = [
        { titulo: 'Salud Mental', puntuacion: parseFloat((sumaSaludMental / totalRespuestas).toFixed(1)) },
        { titulo: 'Carga Laboral', puntuacion: parseFloat((sumaCargaLaboral / totalRespuestas).toFixed(1)) },
        { titulo: 'Comunicación', puntuacion: parseFloat((sumaComunicacion / totalRespuestas).toFixed(1)) },
        { titulo: 'Ergonomía', puntuacion: parseFloat((sumaErgonomia / totalRespuestas).toFixed(1)) }
    ];

    const wellnessScore = parseFloat((subScores.reduce((acc, s) => acc + s.puntuacion, 0) / subScores.length).toFixed(1));

    const insights = [
        { type: 'strength', text: `La comunicación (${subScores[2].puntuacion}) es el punto más fuerte del equipo.` },
        { type: 'weakness', text: `La salud mental (${subScores[0].puntuacion}) es el área con mayor oportunidad de mejora.` }
    ];

    const summary = {
        wellnessScore,
        subScores,
        insights
    };

    return new Promise(resolve => setTimeout(() => resolve(summary), 500));
};