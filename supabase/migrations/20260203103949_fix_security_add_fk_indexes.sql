/*
  # Add Missing Foreign Key Indexes

  1. New Indexes
    - `idx_encuestas_creado_por` on encuestas(creado_por)
    - `idx_servicios_contratados_creado_por` on servicios_contratados(creado_por)
    - `idx_servicios_contratados_empresa_id` on servicios_contratados(empresa_id)
    - `idx_solicitudes_servicios_servicio_id` on solicitudes_servicios(servicio_id)

  2. Purpose
    - Improve query performance for foreign key lookups
    - Prevent table scans when joining on these columns
*/

CREATE INDEX IF NOT EXISTS idx_encuestas_creado_por 
  ON public.encuestas(creado_por);

CREATE INDEX IF NOT EXISTS idx_servicios_contratados_creado_por 
  ON public.servicios_contratados(creado_por);

CREATE INDEX IF NOT EXISTS idx_servicios_contratados_empresa_id 
  ON public.servicios_contratados(empresa_id);

CREATE INDEX IF NOT EXISTS idx_solicitudes_servicios_servicio_id 
  ON public.solicitudes_servicios(servicio_id);
