ALTER TABLE mensaje
DROP FOREIGN KEY fk_usuario_destino;

ALTER TABLE mensaje
ADD CONSTRAINT fk_usuario_destino
FOREIGN KEY (usuario_destino)
REFERENCES usuario(id)
ON DELETE SET NULL;

ALTER TABLE mensaje_viapublica
DROP FOREIGN KEY fk_usuario_destino_mensaje_viapublica;

ALTER TABLE mensaje_viapublica
ADD CONSTRAINT fk_usuario_destino_mensaje_viapublica
FOREIGN KEY (usuario_destino)
REFERENCES usuario(id)
ON DELETE SET NULL;

ALTER TABLE notificacion
DROP FOREIGN KEY fk_usuario_destino_notificacion;

ALTER TABLE notificacion
ADD CONSTRAINT fk_usuario_destino_notificacion
FOREIGN KEY (usuario_destino)
REFERENCES usuario(id)
ON DELETE SET NULL;

ALTER TABLE mensaje_viapublica
DROP FOREIGN KEY fk_usuario_origen_mensaje_viapublica;

ALTER TABLE mensaje_viapublica
ADD CONSTRAINT fk_usuario_origen_mensaje_viapublica
FOREIGN KEY (usuario_origen)
REFERENCES usuario(id)
ON DELETE SET NULL;

ALTER TABLE notificacion
DROP FOREIGN KEY fk_usuario_origen_notificacion;

ALTER TABLE notificacion
ADD CONSTRAINT fk_usuario_origen_notificacion
FOREIGN KEY (usuario_origen)
REFERENCES usuario(id)
ON DELETE SET NULL;

ALTER TABLE presupuesto
DROP FOREIGN KEY fk_vendedor;

ALTER TABLE presupuesto
ADD CONSTRAINT fk_vendedor
FOREIGN KEY (vendedorId)
REFERENCES usuario(id)
ON DELETE SET NULL;


