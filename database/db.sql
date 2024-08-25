CREATE TABLE usuarios(
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    -- TODO: Agregar not null a email y password
    createdAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updatedAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
);

CREATE TABLE estudiantes(
    dni INT UNSIGNED PRIMARY KEY,
    id INT UNSIGNED,
    -- TODO: Agregar not null a id
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    fechaNac DATE NOT NULL,
    FOREIGN KEY id REFERENCES usuarios,
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

CREATE TABLE materias(
    id INT UNSIGNED PRIMARY KEY,
    asignatura VARCHAR(100) NOT NULL,
    nivel TINYINT UNSIGNED NOT NULL,
    dictado VARCHAR(5),
    plan SMALLINT UNSIGNED
);

CREATE TABLE regularizo(
    dni INT UNSIGNED,
    -- TODO: Traer id o dni de estudiantes?
    id INT UNSIGNED,
    PRIMARY KEY (dni, id),
    FOREIGN KEY (dni) REFERENCES estudiantes(dni),
    FOREIGN KEY (id) REFERENCES materias(id)
);

CREATE TABLE aprobo(
    dni INT UNSIGNED,
    -- TODO: Traer id o dni de estudiantes?
    id INT UNSIGNED,
    PRIMARY KEY (dni, id),
    FOREIGN KEY (dni) REFERENCES estudiantes(dni),
    FOREIGN KEY (id) REFERENCES materias(id)
);
