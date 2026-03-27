ALTER TABLE cobro
ADD COLUMN banco_id INT NULL AFTER metodo_pago_id,
ADD CONSTRAINT fk_cobro_banco FOREIGN KEY (banco_id) REFERENCES banco(id);
