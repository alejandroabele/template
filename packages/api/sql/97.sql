-- Cambiar el unique constraint de jornada_persona para permitir múltiples trabajos
-- por operario en la misma jornada
ALTER TABLE jornada_persona
  DROP INDEX unique_jornada_persona,
  ADD UNIQUE KEY unique_jornada_persona (jornada_id, persona_id, produccion_trabajo_id);
