-- Rediseño de la relación entre ofertas y solcoms
-- Cambio: oferta_item ahora se vincula directamente con solcom_item
-- El comprador se asigna por item de solcom, no por solcom completa

-- 1. Agregar campo comprador_id a solcom_item
-- El comprador ahora se asigna a nivel de item, no de solcom
ALTER TABLE solcom_item
  ADD COLUMN comprador_id INT NULL AFTER maximo,
  ADD CONSTRAINT fk_solcom_item_comprador FOREIGN KEY (comprador_id) REFERENCES usuario(id),
  ADD INDEX idx_comprador_id (comprador_id);

-- 2. Migrar compradores de solcom a solcom_item
-- Asignar el comprador de la solcom a todos sus items
UPDATE solcom_item si
INNER JOIN solcom s ON s.id = si.solcom_id
SET si.comprador_id = s.comprador_id
WHERE s.comprador_id IS NOT NULL;

-- 3. Agregar campo solcom_item_id a oferta_item
-- Esto vincula cada item de oferta con su item de solcom original
ALTER TABLE oferta_item
  ADD COLUMN solcom_item_id INT NULL AFTER oferta_id,
  ADD CONSTRAINT fk_oferta_item_solcom_item FOREIGN KEY (solcom_item_id) REFERENCES solcom_item(id),
  ADD INDEX idx_solcom_item_id (solcom_item_id);

-- 4. Migrar datos: vincular oferta_items con solcom_items
-- Vincular cada item de oferta con el item de solcom correspondiente
-- La oferta tiene solcom_id (modelo legacy) que apunta a la SOLCOM completa
-- Ahora vinculamos cada item de oferta con su item de solcom por inventario

-- IMPORTANTE: Primero verificar qué se va a actualizar
SELECT
    oi.id as oferta_item_id,
    oi.oferta_id,
    o.solcom_id,
    oi.inventario_id,
    oi.inventario_conversion_id as oi_conversion,
    si.id as solcom_item_id,
    si.inventario_conversion_id as si_conversion
FROM oferta_item oi
INNER JOIN oferta o ON o.id = oi.oferta_id
INNER JOIN solcom_item si ON si.solcom_id = o.solcom_id
  AND si.inventario_id = oi.inventario_id
  AND (
    si.inventario_conversion_id = oi.inventario_conversion_id
    OR (IFNULL(si.inventario_conversion_id, 0) = 0 AND IFNULL(oi.inventario_conversion_id, 0) = 0)
  )
WHERE o.solcom_id IS NOT NULL
  AND o.deleted_at IS NULL
  AND oi.deleted_at IS NULL
  AND si.deleted_at IS NULL
LIMIT 50;

-- Ahora hacer el UPDATE
UPDATE oferta_item oi
INNER JOIN oferta o ON o.id = oi.oferta_id
INNER JOIN solcom_item si ON si.solcom_id = o.solcom_id
  AND si.inventario_id = oi.inventario_id
  AND (
    si.inventario_conversion_id = oi.inventario_conversion_id
    OR (IFNULL(si.inventario_conversion_id, 0) = 0 AND IFNULL(oi.inventario_conversion_id, 0) = 0)
  )
SET oi.solcom_item_id = si.id
WHERE o.solcom_id IS NOT NULL
  AND o.deleted_at IS NULL
  AND oi.deleted_at IS NULL
  AND si.deleted_at IS NULL;
