-- Módulo de Herramientas: columna es_herramienta en inventario
ALTER TABLE inventario ADD COLUMN es_herramienta BOOLEAN NOT NULL DEFAULT FALSE;
