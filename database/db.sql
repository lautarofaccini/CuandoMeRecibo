CREATE TABLE estudiantes(
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    dni DECIMAL(8),
    nombre varchar(100) NOT NULL,
    apellido varchar(100) NOT NULL,
    fechaNac DATE NOT NULL
);