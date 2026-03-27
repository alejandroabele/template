INSERT INTO cashflow_categoria (nombre, tipo, protegida, codigo) VALUES
('INVERSIONES', 'ingreso', 1, 'INVERS_INGRESO'),
('INVERSIONES', 'egreso', 1, 'INVERS_EGRESO');

INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('BANCOS_TRANSFERIR', 'Transferir fondos entre cuentas bancarias', 'banco_saldo');
