import { useToast as useVueToast } from 'vue-toastification';

export function useToast() {
  const toast = useVueToast();

  const success = (message, subtitle = null, options = {}) => {
    // Support both (message) and (title, subtitle) signatures
    const displayMessage = subtitle ? `${message}\n${subtitle}` : message;
    toast.success(displayMessage, {
      icon: '✅',
      timeout: 5000,
      ...options
    });
  };

  const error = (message, subtitle = null, options = {}) => {
    const displayMessage = subtitle ? `${message}\n${subtitle}` : message;
    toast.error(displayMessage, {
      icon: '❌',
      timeout: 5000,
      ...options
    });
  };

  const warning = (message, subtitle = null, options = {}) => {
    const displayMessage = subtitle ? `${message}\n${subtitle}` : message;
    toast.warning(displayMessage, {
      icon: '⚠️',
      timeout: 5000,
      ...options
    });
  };

  const info = (message, subtitle = null, options = {}) => {
    const displayMessage = subtitle ? `${message}\n${subtitle}` : message;
    toast.info(displayMessage, {
      icon: '💡',
      timeout: 5000,
      ...options
    });
  };

  return {
    // Original names
    success,
    error,
    warning,
    info,
    // Alias names (for components using showSuccess, showError, etc.)
    showSuccess: success,
    showError: error,
    showWarning: warning,
    showInfo: info,

    // Helpers específicos para el negocio
    encuestaCreated: (titulo) => {
      toast.success(`Encuesta "${titulo}" creada exitosamente`, {
        icon: '📋',
        timeout: 5000
      });
    },

    empleadoInvited: (nombre) => {
      toast.success(`${nombre} ha sido invitado correctamente`, {
        icon: '👤',
        timeout: 4000
      });
    },

    solicitudApproved: () => {
      toast.success('Solicitud aprobada exitosamente', {
        icon: '✅',
        timeout: 4000
      });
    },

    lowParticipation: (encuestaTitulo, porcentaje) => {
      toast.warning(`La encuesta "${encuestaTitulo}" tiene baja participación (${porcentaje}%)`, {
        icon: '⚠️',
        timeout: 6000
      });
    },

    dataLoadError: (entity = 'datos') => {
      toast.error(`Error al cargar ${entity}. Por favor, intenta de nuevo.`, {
        icon: '❌',
        timeout: 5000
      });
    },

    saveError: () => {
      toast.error('Error al guardar. Por favor, verifica los datos e intenta de nuevo.', {
        icon: '❌',
        timeout: 5000
      });
    }
  };
}
