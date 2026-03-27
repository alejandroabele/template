CREATE TABLE `usuario_permiso` (
  `usuario_id` int NOT NULL,
  `permiso_id` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`usuario_id`, `permiso_id`),
  KEY `IDX_permiso_id` (`permiso_id`),
  CONSTRAINT `FK_usuario_id` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_permiso_id` FOREIGN KEY (`permiso_id`) REFERENCES `permiso` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO usuario_permiso (usuario_id, permiso_id)
SELECT 
    id AS usuario_id, 
    permisoId AS permiso_id 
FROM 
    usuario 
WHERE 
    permisoId IS NOT NULL;

ALTER TABLE permiso
ADD COLUMN color VARCHAR(30) NULL,
ADD COLUMN icono VARCHAR(50) NULL;

UPDATE `pintegralco`.`permiso` SET `color` = '#f87171', `icono` = 'BadgeDollarSign' WHERE (`id` = '5');
UPDATE `pintegralco`.`permiso` SET `color` = '#d61a1a', `icono` = 'UserCheck' WHERE (`id` = '2');
UPDATE `pintegralco`.`permiso` SET `color` = '#0284c7', `icono` = 'Airplay' WHERE (`id` = '3');
UPDATE `pintegralco`.`permiso` SET `color` = '#404040', `icono` = 'Hammer' WHERE (`id` = '4');
UPDATE `pintegralco`.`permiso` SET `color` = '#65a30d', `icono` = 'UsersRound' WHERE (`id` = '6');
UPDATE `pintegralco`.`permiso` SET `color` = '#4f46e5', `icono` = 'Brush' WHERE (`id` = '7');
UPDATE `pintegralco`.`permiso` SET `color` = '#92400e', `icono` = 'Blocks' WHERE (`id` = '8');
UPDATE `pintegralco`.`permiso` SET `color` = '#a21caf', `icono` = 'Brain' WHERE (`id` = '10');
UPDATE `pintegralco`.`permiso` SET `color` = '#14532d', `icono` = 'HardHat' WHERE (`id` = '9');
