/*
  # Add hash_ip column to respuestas_encuesta table

  1. Changes
    - Add `hash_ip` column to `respuestas_encuesta` table
      - Type: text
      - Purpose: Store SHA256 hash of (IP + encuesta_id) to prevent duplicate submissions
      - Not null: false (for backward compatibility with existing data)
    
    - Add unique constraint on (encuesta_id, hash_ip) to prevent duplicates at database level

  2. Security
    - No personal data (IP addresses) is stored
    - Hash prevents identification while allowing duplicate detection
*/

-- Add hash_ip column to respuestas_encuesta table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'respuestas_encuesta' AND column_name = 'hash_ip'
  ) THEN
    ALTER TABLE respuestas_encuesta ADD COLUMN hash_ip text;
  END IF;
END $$;

-- Create unique index to prevent duplicate submissions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE indexname = 'idx_respuestas_unique_hash'
  ) THEN
    CREATE UNIQUE INDEX idx_respuestas_unique_hash 
    ON respuestas_encuesta(encuesta_id, hash_ip) 
    WHERE hash_ip IS NOT NULL;
  END IF;
END $$;