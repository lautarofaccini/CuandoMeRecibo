CREATE TABLE estudiantes(
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    dni INT UNSIGNED UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    fechaNac DATE NOT NULL,
    email VARCHAR(100) UNIQUE,
    password VARCHAR(100)
    --TODO: Agregar not null a email y password
);

CREATE TABLE materias(
    id INT UNSIGNED PRIMARY KEY,
    asignatura VARCHAR(100) NOT NULL,
    nivel TINYINT UNSIGNED NOT NULL,
    dictado VARCHAR(5),
    plan SMALLINT UNSIGNED
);

CREATE TABLE aprobada(
    idAnteces INT UNSIGNED,
    idSuces INT UNSIGNED,
    PRIMARY KEY (idAnteces, idSuces),
    FOREIGN KEY (idAnteces) REFERENCES materias(id),
    FOREIGN KEY (idSuces) REFERENCES materias(id)
);

CREATE TABLE regularizada(
    idAnteces INT UNSIGNED,
    idSuces INT UNSIGNED,
    PRIMARY KEY (idAnteces, idSuces),
    FOREIGN KEY (idAnteces) REFERENCES materias(id),
    FOREIGN KEY (idSuces) REFERENCES materias(id)
)