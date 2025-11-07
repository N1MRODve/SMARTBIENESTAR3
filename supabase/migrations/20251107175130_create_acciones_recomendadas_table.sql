/*
  # Create acciones_recomendadas table

  1. New Tables
    - `acciones_recomendadas`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `encuesta_id` (uuid, nullable - may not always be tied to specific survey)
      - `tipo_accion` (text) - Type of action recommended
      - `nivel_bienestar` (numeric, nullable) - Wellness index at time of action
      - `fecha_solicitud` (timestamptz) - When the action was requested
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `acciones_recomendadas` table
    - Add policy for users to insert their own actions
    - Add policy for users to read their own actions
    - Add policy for authenticated users (admins) to read all actions
*/

-- Create acciones_recomendadas table
CREATE TABLE IF NOT EXISTS acciones_recomendadas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  encuesta_id uuid,
  tipo_accion text NOT NULL,
  nivel_bienestar numeric,
  fecha_solicitud timestamptz DEFAULT now() NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE acciones_recomendadas ENABLE ROW LEVEL SECURITY;

-- Policy: Users can insert their own actions
CREATE POLICY "Users can insert own actions"
  ON acciones_recomendadas
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can read their own actions
CREATE POLICY "Users can read own actions"
  ON acciones_recomendadas
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Admins can read all actions
CREATE POLICY "Admins can read all actions"
  ON acciones_recomendadas
  FOR SELECT
  TO authenticated
  USING (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_acciones_user_id ON acciones_recomendadas(user_id);
CREATE INDEX IF NOT EXISTS idx_acciones_fecha ON acciones_recomendadas(fecha_solicitud DESC);