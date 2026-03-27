ALTER TABLE persona
ADD COLUMN telefono VARCHAR(50) NULL AFTER fecha_nacimiento,
ADD COLUMN direccion VARCHAR(255) NULL AFTER telefono,
ADD COLUMN email VARCHAR(100) NULL AFTER direccion;
