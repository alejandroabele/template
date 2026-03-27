CREATE TABLE indice (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    notas TEXT NULL,
    porcentaje DECIMAL(10, 2) NOT NULL
);

CREATE TABLE archivo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NULL,
    nombre_archivo VARCHAR(255) NOT NULL,
    nombre_archivo_original VARCHAR(255) NOT NULL,
    url VARCHAR(255) NULL,
    extension VARCHAR(255) NOT NULL,
    modelo VARCHAR(255) NOT NULL,
    modelo_id INT NOT NULL,
    tipo VARCHAR(255) NULL
);