CREATE TABLE contrato_marco (
    id INT PRIMARY KEY AUTO_INCREMENT,
    cliente_id INT,
    fecha_inicio DATE,
    fecha_fin DATE,
    nro_contrato VARCHAR(255),
    monto VARCHAR(255),
    observaciones TEXT,
    periodicidad_actualizacion VARCHAR(255),
    term_de_pago VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by INT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    updated_by INT NULL,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    deleted_by INT NULL,
    CONSTRAINT fk_contrato_marco_cliente
        FOREIGN KEY (cliente_id)
        REFERENCES cliente(clienteId)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);



CREATE TABLE contrato_marco_talonario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    contrato_marco_id INT NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE  NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by INT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    updated_by INT NULL,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    deleted_by INT NULL,
    FOREIGN KEY (contrato_marco_id) REFERENCES contrato_marco(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE contrato_marco_talonario_item (
    id INT AUTO_INCREMENT PRIMARY KEY,
    contrato_marco_talonario_id INT NULL,
    precio VARCHAR(255) NOT NULL,
    unidad_medida VARCHAR(255) NULL,
    descripcion TEXT NOT NULL,
    codigo VARCHAR(255) NOT NULL,
    receta_id INT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by INT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    updated_by INT NULL,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    deleted_by INT NULL,
    FOREIGN KEY (contrato_marco_talonario_id) REFERENCES contrato_marco_talonario(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
    FOREIGN KEY (receta_id) REFERENCES receta(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
);

CREATE TABLE contrato_marco_presupuesto (
    id INT PRIMARY KEY AUTO_INCREMENT,
    contrato_marco_id INT NULL,
    estado VARCHAR(255) NOT NULL,
    tipo VARCHAR(255) NOT NULL,
    presupuesto_id INT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by INT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    updated_by INT NULL,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    deleted_by INT NULL,
    CONSTRAINT fk_contrato_marco
        FOREIGN KEY (contrato_marco_id)
        REFERENCES contrato_marco(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    CONSTRAINT fk_contrato_marco_presupuesto
        FOREIGN KEY (presupuesto_id)
        REFERENCES presupuesto(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);
CREATE TABLE contrato_marco_presupuesto_item (
    id INT PRIMARY KEY AUTO_INCREMENT,
    contrato_marco_presupuesto_id INT NULL,
    contrato_marco_talonario_item_id INT NULL,
    presupuesto_item_id INT NULL,
    cantidad VARCHAR(255) NULL,
    alto VARCHAR(255) NULL,
    ancho VARCHAR(255) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by INT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    updated_by INT NULL,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    deleted_by INT NULL,
    CONSTRAINT fk_contrato_marco_presupuesto_item
        FOREIGN KEY (contrato_marco_presupuesto_id)
        REFERENCES contrato_marco_presupuesto(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    CONSTRAINT fk_contrato_marco_talonario_item
        FOREIGN KEY (contrato_marco_talonario_item_id)
        REFERENCES contrato_marco_talonario_item(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    CONSTRAINT fk_contrato_marco_presupuesto_item_presupuesto_item
        FOREIGN KEY (presupuesto_item_id)
        REFERENCES presupuesto_h(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

