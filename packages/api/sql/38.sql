CREATE TABLE banco (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

CREATE TABLE banco_saldo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    monto DECIMAL(15,2) NOT NULL,
    fecha DATE NOT NULL,
    banco_id INT NOT NULL,
    FOREIGN KEY (banco_id) REFERENCES banco(id)
);