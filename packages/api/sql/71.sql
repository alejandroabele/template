ALTER TABLE cashflow_transaccion
ADD COLUMN banco_id INT NULL AFTER modelo_id,
ADD COLUMN conciliado TINYINT(1) NOT NULL DEFAULT 0 AFTER banco_id,
ADD CONSTRAINT fk_cashflow_transaccion_banco FOREIGN KEY (banco_id) REFERENCES banco(id);

INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('CASHFLOW_CONCILIAR', 'Conciliar transacciones de cashflow con banco', 'cashflow');
