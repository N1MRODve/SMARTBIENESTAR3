import { defineStore } from 'pinia';
import { useEncuestasStore } from './encuestas.store';
import { useAuthStore } from './auth.store';

export const useDemoStore = defineStore('demo', () => {
  
  const resetDemo = async () => {
    try {
      // Resetear el store de encuestas al estado inicial
      const encuestasStore = useEncuestasStore();
      
      // Restaurar solo la encuesta inicial
      encuestasStore.encuestas = [
        {
          id: 1,
          titulo: 'Pulso de Bienestar Semanal',
          descripcion: 'Encuesta semanal sobre el bienestar de los empleados',
          fechaCreacion: '2024-01-15',
          estado: 'activa',
          totalRespuestas: 0,
          totalEmpleados: 120,
          preguntas: 3
        }
      ];
      
      // Resetear la encuesta activa
      encuestasStore.encuestaActiva = null;
      encuestasStore.loading = false;
      encuestasStore.error = null;
      
      console.log('Demo reseteada al estado inicial');
      return { success: true, message: 'Demo reseteada correctamente' };
    } catch (error) {
      console.error('Error al resetear demo:', error);
      throw error;
    }
  };

  return {
    resetDemo
  };
});