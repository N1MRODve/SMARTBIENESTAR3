# 🚀 Guía Rápida: Nuevas Funcionalidades UX

## Para Desarrolladores

### 🔔 Sistema de Notificaciones

```javascript
// En cualquier componente Vue
import { useToast } from '@/composables/useToast';

const toast = useToast();

// Notificaciones básicas
toast.success('¡Operación exitosa!');
toast.error('Algo salió mal');
toast.warning('Ten cuidado con esto');
toast.info('Información útil');

// Notificaciones de negocio
toast.encuestaCreated('Clima Laboral Q4');
toast.empleadoInvited('Juan Pérez');
toast.solicitudApproved();
toast.lowParticipation('Ergonomía', 30);
toast.dataLoadError('empleados');
```

### 📄 Paginación en Tablas

```javascript
import { usePagination } from '@/composables/usePagination';

// En tu componente
const empleados = ref([/* array de datos */]);

const {
  paginatedItems,      // Items para mostrar en la página actual
  currentPage,         // Página actual (ref)
  totalPages,          // Total de páginas
  nextPage,            // Función para siguiente
  prevPage,            // Función para anterior
  goToPage,            // Ir a página específica
  paginationInfo       // Info: { start, end, total, currentPage, totalPages }
} = usePagination(empleados, 25); // 25 items por página

// En el template
<template>
  <table>
    <tr v-for="item in paginatedItems" :key="item.id">
      <!-- ... -->
    </tr>
  </table>

  <Pagination
    :current-page="currentPage"
    :total-pages="totalPages"
    :info="paginationInfo"
    @go-to-page="goToPage"
    @prev="prevPage"
    @next="nextPage"
  />
</template>
```

### 🔍 Filtros y Búsqueda

```javascript
import { useFilters } from '@/composables/useFilters';

const empleados = ref([/* ... */]);

const {
  searchQuery,         // Query de búsqueda (ref)
  filteredItems,       // Items filtrados
  filters,             // Objeto de filtros (ref)
  setFilter,           // Función para establecer filtro
  clearFilters,        // Limpiar todos los filtros
  activeFiltersCount   // Cantidad de filtros activos
} = useFilters(empleados, {
  searchFields: ['nombre', 'email', 'departamento']
});

// En el template
<template>
  <input v-model="searchQuery" placeholder="Buscar..." />

  <select @change="setFilter('departamento', $event.target.value)">
    <option value="">Todos</option>
    <option value="RRHH">RRHH</option>
    <!-- ... -->
  </select>

  <button v-if="activeFiltersCount > 0" @click="clearFilters">
    Limpiar filtros ({{ activeFiltersCount }})
  </button>
</template>
```

### 🔘 Botones Estandarizados

```vue
<template>
  <!-- Acción principal -->
  <Button variant="primary">
    Crear Encuesta
  </Button>

  <!-- Acción secundaria -->
  <Button variant="secondary">
    Ver detalles
  </Button>

  <!-- Bordes solamente -->
  <Button variant="outline">
    Cancelar
  </Button>

  <!-- Acción destructiva -->
  <Button variant="destructive">
    Eliminar
  </Button>

  <!-- Acción sutil -->
  <Button variant="ghost">
    Editar
  </Button>

  <!-- Confirmación -->
  <Button variant="success">
    Aprobar
  </Button>

  <!-- Con loading state -->
  <Button :loading="guardando">
    Guardar
  </Button>

  <!-- Tamaños -->
  <Button size="xs">Mini</Button>
  <Button size="sm">Pequeño</Button>
  <Button size="md">Mediano</Button>
  <Button size="lg">Grande</Button>

  <!-- Ancho completo -->
  <Button full-width>
    Botón 100% ancho
  </Button>
</template>

<script setup>
import Button from '@/components/common/Button.vue';
</script>
```

---

## Para Administradores

### 🎯 Cómo Usar el Nuevo Dashboard

#### 1. Estado del Sistema (Widget Principal)

Al entrar al dashboard verás el **Estado del Sistema**:

- **🟢 Verde - "Todo en orden"**: No hay acciones pendientes
- **🟡 Amarillo - "Atención recomendada"**: 1-2 acciones requieren atención
- **🟠 Naranja - "Requiere atención"**: 3+ acciones urgentes

**Acciones detectadas automáticamente:**
- Encuestas con baja participación (<50%)
- Encuestas cerrando en menos de 3 días
- Solicitudes de servicios sin atender
- Empleados que no han respondido encuestas

**Qué hacer:** Cada alerta tiene un botón que te lleva directamente a resolverla.

---

#### 2. Navegación Mejorada (Sidebar)

El menú lateral ahora está organizado por categorías:

**📊 Visión General**
- Dashboard: Vista principal
- Analítica: Reportes y métricas

**👥 Personas**
- Empleados: Gestión de equipo
  - Badge azul = empleados invitados pendientes

**📋 Medición**
- Encuestas: Crear y gestionar encuestas
  - Badge morado = encuestas activas
- Participación: Ver quién ha respondido

**💼 Servicios**
- Catálogo: Servicios disponibles
- Solicitudes: Revisar peticiones
  - Badge amarillo = solicitudes pendientes
- Recompensas: Gestionar incentivos

**📢 Comunicación**
- Centro de Comunicación: Enviar mensajes

**⚙️ Configuración**
- Ajustes del sistema

---

#### 3. Breadcrumbs (Migas de Pan)

En la parte superior de cada página verás la ruta:
```
Dashboard > Encuestas > Crear
```

**Puedes hacer clic** en cualquier parte de la ruta para volver atrás rápidamente.

---

#### 4. Notificaciones

Cuando realices acciones verás notificaciones en la esquina superior derecha:

- **✅ Verde**: Éxito (ej: "Empleado invitado correctamente")
- **❌ Rojo**: Error (ej: "Error al guardar, intenta de nuevo")
- **⚠️ Amarillo**: Advertencia (ej: "Encuesta tiene baja participación")
- **💡 Azul**: Información

---

#### 5. Tablas con Paginación

Cuando veas listas grandes (empleados, encuestas, etc.):

**En la parte inferior:**
- "Mostrando 1-25 de 150 resultados"
- Botones: ← Anterior | 1 2 3 4 5 | Siguiente →

**Controles:**
- Clic en número de página para ir directamente
- Flechas para navegar página por página
- En móvil: solo botones Anterior/Siguiente

---

#### 6. Búsqueda y Filtros

**Buscar:**
- Escribe en el campo de búsqueda
- Busca por nombre, email, departamento, etc.

**Filtrar:**
- Usa los selectores de filtro (departamento, estado, etc.)
- El contador muestra filtros activos
- Botón "Limpiar filtros" para resetear

---

### 📱 Acceso Rápido

**Desde el Dashboard:**

1. **Ver encuestas activas**: Badge morado en "Encuestas" del menú
2. **Revisar solicitudes**: Badge amarillo en "Solicitudes"
3. **Invitar empleados**: Badge azul en "Empleados"
4. **Detectar problemas**: Widget "Estado del Sistema"

---

### ⚡ Atajos de Teclado (Próximamente)

En futuras versiones:
- `Ctrl+K` o `Cmd+K`: Búsqueda global
- `Ctrl+N`: Nueva encuesta
- `Ctrl+E`: Ir a empleados

---

### 🆘 Soporte

Si tienes dudas o encuentras problemas:

1. Revisa el **Estado del Sistema** en el dashboard
2. Verifica las **notificaciones** (esquina superior derecha)
3. Usa los **breadcrumbs** para navegar
4. Contacta al equipo de desarrollo

---

### 🎓 Video Tutorial (Próximamente)

Estará disponible en:
- Sección de Ayuda
- Configuración > Tutorial
- Primer login (onboarding)

---

## 📞 Contacto

**Equipo de Desarrollo**
- Email: dev@smartbienestar.com
- Slack: #smart-bienestar-soporte

---

**Última actualización:** 2025-12-14
