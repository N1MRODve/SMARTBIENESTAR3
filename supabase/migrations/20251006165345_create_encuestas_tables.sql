/*
  # Create encuestas (surveys) tables

  1. New Tables
    - `encuestas`
      - `id` (uuid, primary key)
      - `titulo` (text) - Survey title
      - `descripcion` (text) - Survey description
      - `categoria` (text) - Survey category (salud-mental, carga-laboral, etc.)
      - `estado` (text) - Survey status (borrador, activa, finalizada)
      - `privacidad_nivel` (text) - Privacy level (anonimato_completo, anonimato_parcial, identificado)
      - `es_recurrente` (boolean) - Whether survey is recurring
      - `recurrencia` (jsonb) - Recurrence configuration
      - `empresa_id` (uuid) - Company reference
      - `creado_por` (uuid) - Creator user reference
      - `fecha_creacion` (timestamptz) - Creation date
      - `fecha_inicio` (timestamptz) - Start date
      - `fecha_fin` (timestamptz) - End date

    - `preguntas_encuesta`
      - `id` (uuid, primary key)
      - `encuesta_id` (uuid) - Survey reference
      - `texto` (text) - Question text
      - `tipo` (text) - Question type (opcion_multiple, si_no, escala_1_5, texto_abierto)
      - `opciones` (jsonb) - Options for multiple choice questions
      - `orden` (integer) - Question order
      - `es_anonima` (boolean) - Whether question is anonymous

    - `respuestas_encuesta`
      - `id` (uuid, primary key)
      - `encuesta_id` (uuid) - Survey reference
      - `pregunta_id` (uuid) - Question reference
      - `empleado_id` (uuid) - Employee reference (null for anonymous)
      - `departamento` (text) - Department (for partial anonymity)
      - `respuesta` (text) - Answer text
      - `fecha_respuesta` (timestamptz) - Answer date

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their surveys
    - Ensure privacy levels are respected in queries
*/

-- Create encuestas table
CREATE TABLE IF NOT EXISTS encuestas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  descripcion text,
  categoria text NOT NULL,
  estado text NOT NULL DEFAULT 'borrador',
  privacidad_nivel text NOT NULL DEFAULT 'anonimato_completo',
  es_recurrente boolean DEFAULT false,
  recurrencia jsonb,
  empresa_id uuid,
  creado_por uuid REFERENCES auth.users(id),
  fecha_creacion timestamptz DEFAULT now(),
  fecha_inicio timestamptz,
  fecha_fin timestamptz
);

-- Create preguntas_encuesta table
CREATE TABLE IF NOT EXISTS preguntas_encuesta (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  encuesta_id uuid REFERENCES encuestas(id) ON DELETE CASCADE,
  texto text NOT NULL,
  tipo text NOT NULL,
  opciones jsonb,
  orden integer NOT NULL,
  es_anonima boolean DEFAULT true
);

-- Create respuestas_encuesta table
CREATE TABLE IF NOT EXISTS respuestas_encuesta (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  encuesta_id uuid REFERENCES encuestas(id) ON DELETE CASCADE,
  pregunta_id uuid REFERENCES preguntas_encuesta(id) ON DELETE CASCADE,
  empleado_id uuid REFERENCES auth.users(id),
  departamento text,
  respuesta text NOT NULL,
  fecha_respuesta timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_encuestas_estado ON encuestas(estado);
CREATE INDEX IF NOT EXISTS idx_encuestas_empresa ON encuestas(empresa_id);
CREATE INDEX IF NOT EXISTS idx_preguntas_encuesta ON preguntas_encuesta(encuesta_id);
CREATE INDEX IF NOT EXISTS idx_respuestas_encuesta ON respuestas_encuesta(encuesta_id);
CREATE INDEX IF NOT EXISTS idx_respuestas_pregunta ON respuestas_encuesta(pregunta_id);

-- Enable RLS
ALTER TABLE encuestas ENABLE ROW LEVEL SECURITY;
ALTER TABLE preguntas_encuesta ENABLE ROW LEVEL SECURITY;
ALTER TABLE respuestas_encuesta ENABLE ROW LEVEL SECURITY;

-- Policies for encuestas table
CREATE POLICY "Users can view all surveys"
  ON encuestas
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create surveys"
  ON encuestas
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = creado_por);

CREATE POLICY "Users can update their own surveys"
  ON encuestas
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = creado_por)
  WITH CHECK (auth.uid() = creado_por);

CREATE POLICY "Users can delete their own surveys"
  ON encuestas
  FOR DELETE
  TO authenticated
  USING (auth.uid() = creado_por);

-- Policies for preguntas_encuesta table
CREATE POLICY "Users can view all questions"
  ON preguntas_encuesta
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create questions for their surveys"
  ON preguntas_encuesta
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM encuestas
      WHERE encuestas.id = encuesta_id
      AND encuestas.creado_por = auth.uid()
    )
  );

CREATE POLICY "Users can update questions for their surveys"
  ON preguntas_encuesta
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM encuestas
      WHERE encuestas.id = encuesta_id
      AND encuestas.creado_por = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM encuestas
      WHERE encuestas.id = encuesta_id
      AND encuestas.creado_por = auth.uid()
    )
  );

CREATE POLICY "Users can delete questions for their surveys"
  ON preguntas_encuesta
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM encuestas
      WHERE encuestas.id = encuesta_id
      AND encuestas.creado_por = auth.uid()
    )
  );

-- Policies for respuestas_encuesta table
CREATE POLICY "Users can view responses for their surveys"
  ON respuestas_encuesta
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM encuestas
      WHERE encuestas.id = encuesta_id
      AND encuestas.creado_por = auth.uid()
    )
  );

CREATE POLICY "Users can submit responses to active surveys"
  ON respuestas_encuesta
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM encuestas
      WHERE encuestas.id = encuesta_id
      AND encuestas.estado = 'activa'
    )
  );
