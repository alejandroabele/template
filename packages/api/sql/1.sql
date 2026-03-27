/* FACTURA */
UPDATE factura
SET presupuestoId = NULL
WHERE presupuestoId = 0;

ALTER TABLE factura
MODIFY COLUMN presupuestoId INT NULL;

UPDATE factura
SET presupuestoId = NULL
WHERE presupuestoId NOT IN (SELECT presupuestoId FROM presupuesto);

ALTER TABLE factura
ADD CONSTRAINT fk_presupuesto
FOREIGN KEY (presupuestoId) REFERENCES presupuesto(presupuestoId);

/* INVENTARIO */

ALTER TABLE inventario
MODIFY COLUMN categoriaId INT NULL;

UPDATE inventario
SET categoriaId = NULL
WHERE categoriaId = 0
OR categoriaId NOT IN (SELECT id FROM categoria);

ALTER TABLE inventario
ADD CONSTRAINT fk_categoria
FOREIGN KEY (categoriaId) REFERENCES categoria(id);

/* MENSAJE */

ALTER TABLE mensaje
MODIFY COLUMN presupuestoId INT NULL;

UPDATE mensaje
SET presupuestoId = NULL
WHERE presupuestoId = 0
OR presupuestoId NOT IN (SELECT presupuestoId FROM presupuesto);

ALTER TABLE mensaje
ADD CONSTRAINT fk_presupuesto_mensaje
FOREIGN KEY (presupuestoId) REFERENCES presupuesto(presupuestoId);

ALTER TABLE mensaje
MODIFY COLUMN usuario_origen INT NULL;

ALTER TABLE mensaje
MODIFY COLUMN usuario_destino INT NULL;

UPDATE mensaje
SET usuario_origen = NULL
WHERE usuario_origen = 0
OR usuario_origen NOT IN (SELECT id FROM usuario);
UPDATE mensaje
SET usuario_destino = NULL
WHERE usuario_destino = 0
OR usuario_destino NOT IN (SELECT id FROM usuario);

ALTER TABLE mensaje
ADD CONSTRAINT fk_usuario_origen
FOREIGN KEY (usuario_origen) REFERENCES usuario(id);

ALTER TABLE mensaje
ADD CONSTRAINT fk_usuario_destino
FOREIGN KEY (usuario_destino) REFERENCES usuario(id);


/* MENSAJE VIA PUBLICA */

ALTER TABLE mensaje_viapublica
MODIFY COLUMN viapublicaId INT NULL;

UPDATE mensaje_viapublica
SET viapublicaId = NULL
WHERE viapublicaId = 0
OR viapublicaId NOT IN (SELECT viapublicaId FROM viapublica);

ALTER TABLE mensaje_viapublica
ADD CONSTRAINT fk_viapublica
FOREIGN KEY (viapublicaId) REFERENCES viapublica(viapublicaId);

ALTER TABLE mensaje_viapublica
MODIFY COLUMN usuario_origen INT NULL,
MODIFY COLUMN usuario_destino INT NULL;

UPDATE mensaje_viapublica
SET usuario_origen = NULL
WHERE usuario_origen = 0
OR usuario_origen NOT IN (SELECT id FROM usuario);
UPDATE mensaje_viapublica
SET usuario_destino = NULL
WHERE usuario_destino = 0
OR usuario_destino NOT IN (SELECT id FROM usuario);

ALTER TABLE mensaje_viapublica
ADD CONSTRAINT fk_usuario_origen_mensaje_viapublica
FOREIGN KEY (usuario_origen) REFERENCES usuario(id);

ALTER TABLE mensaje_viapublica
ADD CONSTRAINT fk_usuario_destino_mensaje_viapublica
FOREIGN KEY (usuario_destino) REFERENCES usuario(id);

/* NOTIFICACION */

ALTER TABLE notificacion
MODIFY COLUMN presupuestoId INT NULL,
MODIFY COLUMN usuario_origen INT NULL,
MODIFY COLUMN usuario_destino INT NULL,
MODIFY COLUMN tipoUsuario INT NULL;

UPDATE notificacion
SET presupuestoId = NULL
WHERE presupuestoId = 0
OR presupuestoId NOT IN (SELECT presupuestoId FROM presupuesto);

UPDATE notificacion
SET usuario_origen = NULL
WHERE usuario_origen = 0
OR usuario_origen NOT IN (SELECT id FROM usuario);

UPDATE notificacion
SET usuario_destino = NULL
WHERE usuario_destino = 0
OR usuario_destino NOT IN (SELECT id FROM usuario);

UPDATE notificacion
SET tipoUsuario = NULL
WHERE tipoUsuario = 0
OR tipoUsuario NOT IN (SELECT id FROM permiso);

ALTER TABLE notificacion
ADD CONSTRAINT fk_presupuesto_notificacion
FOREIGN KEY (presupuestoId) REFERENCES presupuesto(presupuestoId);

ALTER TABLE notificacion
ADD CONSTRAINT fk_usuario_origen_notificacion
FOREIGN KEY (usuario_origen) REFERENCES usuario(id);

ALTER TABLE notificacion
ADD CONSTRAINT fk_usuario_destino_notificacion
FOREIGN KEY (usuario_destino) REFERENCES usuario(id);

ALTER TABLE notificacion
ADD CONSTRAINT fk_tipo_usuario_notificacion
FOREIGN KEY (tipoUsuario) REFERENCES permiso(id);

/* ORDEN */

ALTER TABLE orden
MODIFY COLUMN presupuestoId INT NULL,
MODIFY COLUMN clienteId INT NULL;

UPDATE orden
SET presupuestoId = NULL
WHERE presupuestoId = 0
OR presupuestoId NOT IN (SELECT presupuestoId FROM presupuesto);

UPDATE orden
SET clienteId = NULL
WHERE clienteId = 0
OR clienteId NOT IN (SELECT clienteId FROM cliente);

ALTER TABLE orden
ADD CONSTRAINT fk_presupuesto_orden
FOREIGN KEY (presupuestoId) REFERENCES presupuesto(presupuestoId);

ALTER TABLE orden
ADD CONSTRAINT fk_cliente_orden
FOREIGN KEY (clienteId) REFERENCES cliente(clienteId);

/* PRESUPUESTO */
UPDATE presupuesto
SET fecha_entrega_estimada = NULL
WHERE CAST(fecha_entrega_estimada AS CHAR) = '0000-00-00';

UPDATE presupuesto
SET fecha_solicitud_prod = NULL
WHERE CAST(fecha_solicitud_prod AS CHAR) = '0000-00-00';

UPDATE presupuesto
SET fecha_factura = NULL
WHERE CAST(fecha_factura AS CHAR) = '0000-00-00';

ALTER TABLE presupuesto
MODIFY COLUMN clienteId INT NULL;

UPDATE presupuesto
SET clienteId = NULL
WHERE clienteId = 0
OR clienteId NOT IN (SELECT clienteId FROM cliente); /* TODO: Ver que hacer con los que no tienen clientId, pero si tienen cliente (inconsistencia de datos) */

ALTER TABLE presupuesto
ADD CONSTRAINT fk_cliente_presupuesto
FOREIGN KEY (clienteId) REFERENCES cliente(clienteId);


ALTER TABLE presupuesto
MODIFY COLUMN vendedorId INT NULL;

UPDATE presupuesto
SET vendedorId = NULL
WHERE vendedorId = 0
OR vendedorId NOT IN (SELECT id FROM usuario);

ALTER TABLE presupuesto
ADD CONSTRAINT fk_vendedor
FOREIGN KEY (vendedorId) REFERENCES usuario(id);

ALTER TABLE presupuesto
MODIFY COLUMN areaId INT NULL;

UPDATE presupuesto
SET areaId = NULL
WHERE areaId = 0
OR areaId NOT IN (SELECT id FROM area);

ALTER TABLE presupuesto
ADD CONSTRAINT fk_area
FOREIGN KEY (areaId) REFERENCES area(id);

ALTER TABLE presupuesto
MODIFY COLUMN viapublicaId INT NULL;

UPDATE presupuesto
SET viapublicaId = NULL
WHERE viapublicaId = 0
OR viapublicaId NOT IN (SELECT viapublicaId FROM viapublica);

ALTER TABLE presupuesto
ADD CONSTRAINT fk_presupuesto_viapublica
FOREIGN KEY (viapublicaId) REFERENCES viapublica(viapublicaId);

ALTER TABLE presupuesto
MODIFY COLUMN estatusId INT UNSIGNED NULL;


UPDATE presupuesto
SET estatusId = NULL
WHERE estatusId = 0
OR estatusId NOT IN (SELECT id FROM estatus);

ALTER TABLE estatus
MODIFY COLUMN id INT UNSIGNED NOT NULL; /* TODO: Chequear esto, por que sin esto no me toma la foranea*/

ALTER TABLE presupuesto
ADD CONSTRAINT fk_presupuesto_estatus
FOREIGN KEY (estatusId) REFERENCES estatus(id);

ALTER TABLE presupuesto
MODIFY COLUMN procesoId INT UNSIGNED NULL;

UPDATE presupuesto
SET procesoId = NULL
WHERE procesoId NOT IN (SELECT id FROM proceso);

ALTER TABLE proceso
MODIFY COLUMN id INT UNSIGNED NOT NULL;

ALTER TABLE presupuesto
ADD CONSTRAINT fk_presupuesto_proceso
FOREIGN KEY (procesoId) REFERENCES proceso(id);

ALTER TABLE presupuesto
MODIFY COLUMN ordenId INT NULL;

UPDATE presupuesto
SET ordenId = NULL
WHERE ordenId NOT IN (SELECT ordenId FROM orden);

ALTER TABLE presupuesto
ADD CONSTRAINT fk_orden_presupuesto
FOREIGN KEY (ordenId) REFERENCES orden(ordenId); /* TODO: Ver por que esta la clave de ambos lados, debe ser para las busquedas, es decir esta en la tabla presupuesto*/

/* PRESUPUESTO_H */

ALTER TABLE presupuesto_h
MODIFY COLUMN presupuestoId INT NULL;

UPDATE presupuesto_h
SET presupuestoId = NULL
WHERE presupuestoId NOT IN (SELECT presupuestoId FROM presupuesto);

ALTER TABLE presupuesto_h
ADD CONSTRAINT fk_presupuesto_h_presupuesto
FOREIGN KEY (presupuestoId) REFERENCES presupuesto(presupuestoId);

/* PRESUPUESTO_H_ADICIONAL */

ALTER TABLE presupuesto_h_adicional
MODIFY COLUMN presupuesto_hId INT NULL;

UPDATE presupuesto_h_adicional
SET presupuesto_hId = NULL
WHERE presupuesto_hId NOT IN (SELECT presupuestohId FROM presupuesto_h);

ALTER TABLE presupuesto_h_adicional
ADD CONSTRAINT fk_presupuesto_h_adicional_presupuesto_h
FOREIGN KEY (presupuesto_hId) REFERENCES presupuesto_h(presupuestohId);

/* PRESUPUESTO_H_ARCHS */

ALTER TABLE presupuesto_h_archs
MODIFY COLUMN presupuestohId INT NULL;

UPDATE presupuesto_h_archs
SET presupuestohId = NULL
WHERE presupuestohId NOT IN (SELECT presupuestohId FROM presupuesto_h);

ALTER TABLE presupuesto_h_archs
ADD CONSTRAINT fk_presupuesto_h_archs_presupuesto_h
FOREIGN KEY (presupuestohId) REFERENCES presupuesto_h(presupuestohId);

/* PRESUPUESTO_H_CONCEPTOS */

ALTER TABLE presupuesto_h_conceptos
MODIFY COLUMN presupuestoId INT NULL,
MODIFY COLUMN presupuestohId INT NULL;

UPDATE presupuesto_h_conceptos
SET presupuestoId = NULL
WHERE presupuestoId NOT IN (SELECT presupuestoId FROM presupuesto);

UPDATE presupuesto_h_conceptos
SET presupuestohId = NULL
WHERE presupuestohId NOT IN (SELECT presupuestohId FROM presupuesto_h);

ALTER TABLE presupuesto_h_conceptos
ADD CONSTRAINT fk_presupuesto_h_conceptos_presupuesto
FOREIGN KEY (presupuestoId) REFERENCES presupuesto(presupuestoId);

ALTER TABLE presupuesto_h_conceptos
ADD CONSTRAINT fk_presupuesto_h_conceptos_presupuesto_h
FOREIGN KEY (presupuestohId) REFERENCES presupuesto_h(presupuestohId);

/* PRESUPUESTO_H_TRABAJOS */

ALTER TABLE presupuesto_h_trabajos
MODIFY COLUMN presupuestoId INT NULL,
MODIFY COLUMN presupuestohId INT NULL;

UPDATE presupuesto_h_trabajos
SET presupuestoId = NULL
WHERE presupuestoId NOT IN (SELECT presupuestoId FROM presupuesto);

UPDATE presupuesto_h_trabajos
SET presupuestohId = NULL
WHERE presupuestohId NOT IN (SELECT presupuestohId FROM presupuesto_h);

ALTER TABLE presupuesto_h_trabajos
ADD CONSTRAINT fk_presupuesto_h_trabajos_presupuesto
FOREIGN KEY (presupuestoId) REFERENCES presupuesto(presupuestoId);

ALTER TABLE presupuesto_h_trabajos
ADD CONSTRAINT fk_presupuesto_h_trabajos_presupuesto_h
FOREIGN KEY (presupuestohId) REFERENCES presupuesto_h(presupuestohId);

ALTER TABLE presupuesto_h_trabajos
MODIFY COLUMN trabajoId INT NULL;

UPDATE presupuesto_h_trabajos
SET trabajoId = NULL
WHERE trabajoId NOT IN (SELECT id FROM produccion_trabajos);

ALTER TABLE presupuesto_h_trabajos
ADD CONSTRAINT fk_presupuesto_h_trabajos_trabajo
FOREIGN KEY (trabajoId) REFERENCES produccion_trabajos(id);

/* PRESUPUESTO_H_TRABAJOS_IMAGEN */

ALTER TABLE presupuesto_h_trabajos_imagen
MODIFY COLUMN presupuesto_h_trabajos_id INT NULL;

UPDATE presupuesto_h_trabajos_imagen
SET presupuesto_h_trabajos_id = NULL
WHERE presupuesto_h_trabajos_id NOT IN (SELECT id FROM presupuesto_h_trabajos);

ALTER TABLE presupuesto_h_trabajos_imagen
ADD CONSTRAINT fk_presupuesto_h_trabajos_imagen
FOREIGN KEY (presupuesto_h_trabajos_id) REFERENCES presupuesto_h_trabajos(id);

/* PRESUPUESTO_MANODEOBRA*/

ALTER TABLE presupuesto_manodeobra
MODIFY COLUMN inventarioId INT NULL,
MODIFY COLUMN presupuestoId INT NULL,
MODIFY COLUMN presupuestohId INT NULL,
MODIFY COLUMN trabajoId INT NULL;

UPDATE presupuesto_manodeobra
SET inventarioId = NULL
WHERE inventarioId NOT IN (SELECT inventarioId FROM inventario);
UPDATE presupuesto_manodeobra
SET presupuestoId = NULL
WHERE presupuestoId NOT IN (SELECT presupuestoId FROM presupuesto);
UPDATE presupuesto_manodeobra
SET presupuestohId = NULL
WHERE presupuestohId NOT IN (SELECT presupuestohId FROM presupuesto_h);
UPDATE presupuesto_manodeobra
SET trabajoId = NULL
WHERE trabajoId NOT IN (SELECT id FROM produccion_trabajos);

ALTER TABLE presupuesto_manodeobra
ADD CONSTRAINT fk_presupuesto_manodeobra_inventario
FOREIGN KEY (inventarioId) REFERENCES inventario(inventarioId);
ALTER TABLE presupuesto_manodeobra
ADD CONSTRAINT fk_presupuesto_manodeobra_presupuesto
FOREIGN KEY (presupuestoId) REFERENCES presupuesto(presupuestoId);
ALTER TABLE presupuesto_manodeobra
ADD CONSTRAINT fk_presupuesto_manodeobra_presupuestoh
FOREIGN KEY (presupuestohId) REFERENCES presupuesto_h(presupuestohId);
ALTER TABLE presupuesto_manodeobra
ADD CONSTRAINT fk_presupuesto_manodeobra_trabajo
FOREIGN KEY (trabajoId) REFERENCES produccion_trabajos(id);

/* PRESUPUESTO_MATERIALES */
ALTER TABLE presupuesto_materiales
MODIFY COLUMN inventarioId INT NULL,
MODIFY COLUMN presupuestoId INT NULL,
MODIFY COLUMN presupuestohId INT NULL,
MODIFY COLUMN trabajoId INT NULL;

UPDATE presupuesto_materiales
SET inventarioId = NULL
WHERE inventarioId NOT IN (SELECT inventarioId FROM inventario);

UPDATE presupuesto_materiales
SET presupuestoId = NULL
WHERE presupuestoId NOT IN (SELECT presupuestoId FROM presupuesto);

UPDATE presupuesto_materiales
SET presupuestohId = NULL
WHERE presupuestohId NOT IN (SELECT presupuestohId FROM presupuesto_h);

UPDATE presupuesto_materiales
SET trabajoId = NULL
WHERE trabajoId NOT IN (SELECT id FROM produccion_trabajos);

ALTER TABLE presupuesto_materiales
ADD CONSTRAINT fk_presupuesto_materiales_inventario
FOREIGN KEY (inventarioId) REFERENCES inventario(inventarioId);

ALTER TABLE presupuesto_materiales
ADD CONSTRAINT fk_presupuesto_materiales_presupuesto
FOREIGN KEY (presupuestoId) REFERENCES presupuesto(presupuestoId);

ALTER TABLE presupuesto_materiales
ADD CONSTRAINT fk_presupuesto_materiales_presupuestoh
FOREIGN KEY (presupuestohId) REFERENCES presupuesto_h(presupuestohId);

ALTER TABLE presupuesto_materiales
ADD CONSTRAINT fk_presupuesto_materiales_trabajo
FOREIGN KEY (trabajoId) REFERENCES produccion_trabajos(id);

/* PRESUPUESTO_PRODUCCION */

ALTER TABLE presupuesto_produccion
MODIFY COLUMN presupuestoId INT NULL,
MODIFY COLUMN trabajoId INT NULL;

UPDATE presupuesto_produccion
SET presupuestoId = NULL
WHERE presupuestoId NOT IN (SELECT presupuestoId FROM presupuesto);

UPDATE presupuesto_produccion
SET trabajoId = NULL
WHERE trabajoId NOT IN (SELECT id FROM produccion_trabajos);

ALTER TABLE presupuesto_produccion
ADD CONSTRAINT fk_presupuesto_produccion_presupuesto
FOREIGN KEY (presupuestoId) REFERENCES presupuesto(presupuestoId);

ALTER TABLE presupuesto_produccion
ADD CONSTRAINT fk_presupuesto_produccion_trabajo
FOREIGN KEY (trabajoId) REFERENCES produccion_trabajos(id);

/* PRESUPUESTO_SUMINISTROS */

ALTER TABLE presupuesto_suministros
MODIFY COLUMN inventarioId INT NULL,
MODIFY COLUMN presupuestoId INT NULL,
MODIFY COLUMN presupuestohId INT NULL,
MODIFY COLUMN trabajoId INT NULL;

UPDATE presupuesto_suministros
SET inventarioId = NULL
WHERE inventarioId NOT IN (SELECT inventarioId FROM inventario);

UPDATE presupuesto_suministros
SET presupuestoId = NULL
WHERE presupuestoId NOT IN (SELECT presupuestoId FROM presupuesto);

UPDATE presupuesto_suministros
SET presupuestohId = NULL
WHERE presupuestohId NOT IN (SELECT presupuestohId FROM presupuesto_h);

UPDATE presupuesto_suministros
SET trabajoId = NULL
WHERE trabajoId NOT IN (SELECT id FROM produccion_trabajos);

ALTER TABLE presupuesto_suministros
ADD CONSTRAINT fk_presupuesto_suministros_inventario
FOREIGN KEY (inventarioId) REFERENCES inventario(inventarioId);

ALTER TABLE presupuesto_suministros
ADD CONSTRAINT fk_presupuesto_suministros_presupuesto
FOREIGN KEY (presupuestoId) REFERENCES presupuesto(presupuestoId);

ALTER TABLE presupuesto_suministros
ADD CONSTRAINT fk_presupuesto_suministros_presupuestoh
FOREIGN KEY (presupuestohId) REFERENCES presupuesto_h(presupuestohId);

ALTER TABLE presupuesto_suministros
ADD CONSTRAINT fk_presupuesto_suministros_trabajo
FOREIGN KEY (trabajoId) REFERENCES produccion_trabajos(id);

/* PRESUPUESTO_TRABAJOCAMPO */


ALTER TABLE presupuesto_trabajocampo
MODIFY COLUMN presupuestoId INT NULL,
MODIFY COLUMN presupuestohId INT NULL;

UPDATE presupuesto_trabajocampo
SET presupuestoId = NULL
WHERE presupuestoId NOT IN (SELECT presupuestoId FROM presupuesto);

UPDATE presupuesto_trabajocampo
SET presupuestohId = NULL
WHERE presupuestohId NOT IN (SELECT presupuestohId FROM presupuesto_h);

ALTER TABLE presupuesto_trabajocampo
ADD CONSTRAINT fk_presupuesto_trabajocampo_presupuesto
FOREIGN KEY (presupuestoId) REFERENCES presupuesto(presupuestoId);

ALTER TABLE presupuesto_trabajocampo
ADD CONSTRAINT fk_presupuesto_trabajocampo_presupuestoh
FOREIGN KEY (presupuestohId) REFERENCES presupuesto_h(presupuestohId);

/* USUARIO */
ALTER TABLE usuario
MODIFY COLUMN permisoId INT NULL;

UPDATE usuario
SET permisoId = NULL
WHERE permisoId NOT IN (SELECT id FROM permiso);

ALTER TABLE usuario
ADD CONSTRAINT fk_usuario_permiso
FOREIGN KEY (permisoId) REFERENCES permiso(id);
/* VIA PUBLICA */

/* TODO: Revisar las columnas presupuestoId y vendedorId  */
