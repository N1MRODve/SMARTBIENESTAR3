# 📋 Instrucciones para Aplicar la Migración SQL

## ⚠️ ¿Necesito ejecutar la migración?

**NO es obligatorio.** La aplicación funciona perfectamente sin las nuevas columnas.

Sin embargo, ejecutar la migración desbloquea funcionalidades avanzadas:
- ✅ Tracking de último acceso de empleados
- ✅ Historial de reenvío de invitaciones
- ✅ Cálculo automático de nivel de participación

---

## 🚀 Opción 1: Supabase Dashboard (Recomendado)

### Para Supabase en la nube:

1. Ve a tu proyecto en [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. En el menú lateral, selecciona **SQL Editor**
3. Haz clic en **New Query**
4. Copia todo el contenido del archivo `add-empleados-columns.sql`
5. Pégalo en el editor SQL
6. Haz clic en **Run** (▶️)
7. Verifica que aparezca el mensaje de éxito

### Para Supabase Local:

1. Asegúrate de que Supabase esté corriendo:
   ```bash
   supabase status
   ```

2. Abre el Studio local en: `http://localhost:54323`

3. Ve a **SQL Editor**

4. Copia y pega el contenido de `add-empleados-columns.sql`

5. Ejecuta el query

---

## 🔍 Verificar que la Migración fue Exitosa

### Método 1: Via SQL Editor

Ejecuta este query en el SQL Editor:

```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'empleados'
AND column_name IN ('ultimo_acceso', 'invitacion_enviada_at', 'participacion_nivel');
```

**Resultado esperado:** Debe mostrar 3 filas con las nuevas columnas.

### Método 2: Via Aplicación

1. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

2. Inicia sesión como admin

3. Ve a **Gestión de Empleados**

4. Invita un nuevo empleado

5. Verifica que:
   - El card "Sin Participación" funcione correctamente
   - El botón "Reenviar invitación" funcione sin errores
   - Los tooltips de "último acceso" aparezcan

---

## 📝 Contenido de la Migración

El archivo `add-empleados-columns.sql` incluye:

### 1. Creación de Columnas

```sql
-- ultimo_acceso: Para trackear último acceso del empleado
ALTER TABLE empleados ADD COLUMN ultimo_acceso TIMESTAMP WITH TIME ZONE;

-- invitacion_enviada_at: Para historial de invitaciones
ALTER TABLE empleados ADD COLUMN invitacion_enviada_at TIMESTAMP WITH TIME ZONE;

-- participacion_nivel: Nivel calculado automáticamente
ALTER TABLE empleados ADD COLUMN participacion_nivel TEXT DEFAULT 'nuevo';
```

### 2. Índices para Performance

```sql
CREATE INDEX idx_empleados_ultimo_acceso ON empleados(ultimo_acceso);
CREATE INDEX idx_empleados_estado ON empleados(estado);
CREATE INDEX idx_empleados_puntos ON empleados(puntos);
```

### 3. Trigger Automático

Actualiza automáticamente `participacion_nivel` cuando cambian los `puntos`:

```sql
CREATE TRIGGER trigger_actualizar_nivel_participacion
  BEFORE INSERT OR UPDATE OF puntos ON empleados
  FOR EACH ROW
  EXECUTE FUNCTION actualizar_nivel_participacion();
```

---

## 🛡️ Seguridad

- ✅ El script es **idempotente** (puede ejecutarse múltiples veces)
- ✅ Usa `IF NOT EXISTS` para evitar errores
- ✅ No elimina ni modifica datos existentes
- ✅ Solo agrega columnas nuevas y crea índices

---

## ❌ Qué hacer si hay errores

### Error: "permission denied"

**Solución:** Asegúrate de estar usando un usuario con permisos de admin en Supabase.

### Error: "column already exists"

**Solución:** Las columnas ya existen. No hay problema, ignora el error.

### Error: "relation empleados does not exist"

**Solución:** Verifica que la tabla `empleados` exista en tu base de datos. Ejecuta:

```sql
SELECT * FROM empleados LIMIT 1;
```

---

## 🔄 Rollback (Deshacer la Migración)

Si necesitas revertir los cambios por alguna razón:

```sql
-- Eliminar trigger
DROP TRIGGER IF EXISTS trigger_actualizar_nivel_participacion ON empleados;
DROP FUNCTION IF EXISTS actualizar_nivel_participacion();

-- Eliminar índices
DROP INDEX IF EXISTS idx_empleados_ultimo_acceso;
DROP INDEX IF EXISTS idx_empleados_estado;
DROP INDEX IF EXISTS idx_empleados_puntos;

-- Eliminar columnas (¡CUIDADO: Esto borra los datos!)
ALTER TABLE empleados DROP COLUMN IF EXISTS ultimo_acceso;
ALTER TABLE empleados DROP COLUMN IF EXISTS invitacion_enviada_at;
ALTER TABLE empleados DROP COLUMN IF EXISTS participacion_nivel;
```

⚠️ **Advertencia:** El rollback eliminará los datos almacenados en estas columnas.

---

## 📞 Soporte

Si tienes problemas con la migración:

1. Revisa los logs de Supabase
2. Verifica que tengas permisos de admin
3. Asegúrate de que la sintaxis SQL sea compatible con PostgreSQL

---

## ✅ Checklist Post-Migración

- [ ] Migración ejecutada sin errores
- [ ] Verificación de columnas exitosa
- [ ] Aplicación compila correctamente (`npm run build`)
- [ ] Cards KPIs muestran datos correctos
- [ ] Botón "Reenviar invitación" funciona
- [ ] Tooltips de último acceso aparecen
- [ ] Niveles de participación se calculan correctamente

---

**Fecha de última actualización:** 2025-12-15
