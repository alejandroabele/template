CREATE TABLE alquiler_recurso (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(255) NOT NULL,
    localidad VARCHAR(255) NULL,
    zona VARCHAR(255) NULL,
    coordenadas POINT NULL,
    proveedor VARCHAR(255) NULL,
    precio INT NULL,
    alto VARCHAR(255) NULL,
    ancho VARCHAR(255) NULL,
    largo VARCHAR(255) NULL,
    modelo VARCHAR(255) NULL,
    tipo VARCHAR(255) NULL,
    formato VARCHAR(255) NULL
);

CREATE TABLE alquiler (
    id INT AUTO_INCREMENT PRIMARY KEY,
    alquiler_recurso_id INT NOT NULL,
    localidad VARCHAR(255) NOT NULL,
    zona VARCHAR(255) NOT NULL,
    coordenadas POINT NULL,
    inicio_contrato DATE NULL,
    precio INT NULL,
    cliente_id INT NULL DEFAULT NULL,
    vencimiento_contrato DATE NULL,
    estado VARCHAR(255) NULL,
    fecha_limite_negociacion DATE NULL,
    notas TEXT NULL,
    tipo VARCHAR(255) NULL, /* Cambiar estos string enum a string*/
    FOREIGN KEY (alquiler_recurso_id) REFERENCES alquiler_recurso(id) ON DELETE CASCADE,
    FOREIGN KEY (cliente_id) REFERENCES cliente(clienteId)
);

CREATE TABLE alquiler_precio (
    id INT AUTO_INCREMENT PRIMARY KEY,
    alquiler_recurso_id INT NOT NULL,
    cliente_id INT NULL DEFAULT NULL,
    precio INT NOT NULL,
    fecha_desde DATE NOT NULL,
    fecha_fin DATE,    
    localidad VARCHAR(255) NOT NULL,
    zona VARCHAR(255) NOT NULL,
    FOREIGN KEY (alquiler_recurso_id) REFERENCES alquiler_recurso(id) ON DELETE CASCADE,
    FOREIGN KEY (cliente_id) REFERENCES cliente(clienteId) ON DELETE CASCADE
);

CREATE TABLE alquiler_facturacion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    alquiler_id INT NOT NULL,
    inicio_periodo DATE NOT NULL,
    fin_periodo DATE NOT NULL,
    fecha_facturacion DATETIME NULL,
    cliente_id INT NULL DEFAULT NULL,
    monto INT NOT NULL,
    FOREIGN KEY (alquiler_id) REFERENCES alquiler(id)
);

CREATE TABLE alquiler_cobranzas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    alquiler_id INT NOT NULL,
    inicio_periodo DATE NOT NULL,
    fin_periodo DATE NOT NULL,
    fecha_cobro DATETIME NULL,
    cliente_id INT NULL DEFAULT NULL,
    monto INT NOT NULL,
    FOREIGN KEY (alquiler_id) REFERENCES alquiler(id)
);

CREATE TABLE alquiler_mantenimiento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    alquiler_recurso_id INT NOT NULL,
    fecha DATE NOT NULL,
    detalle TEXT NOT NULL,
    costo INT NULL,
    FOREIGN KEY (alquiler_recurso_id) REFERENCES alquiler_recurso(id) ON DELETE CASCADE
);
