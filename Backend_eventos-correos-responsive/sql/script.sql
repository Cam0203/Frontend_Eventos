SET TIME ZONE 'America/Bogota';

CREATE TABLE ROL (
    ID SERIAL PRIMARY KEY,
    Nombre VARCHAR(50) NOT NULL UNIQUE,
    Descripcion TEXT,
    Estado VARCHAR(20) NOT NULL DEFAULT 'Activo' CHECK (Estado IN ('Activo', 'Inactivo')),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE PROGRAMA (
    ID SERIAL PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL UNIQUE,
    Estado VARCHAR(20) NOT NULL DEFAULT 'Activo' CHECK (Estado IN ('Activo', 'Inactivo')),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE LUGAR (
    ID SERIAL PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL UNIQUE,
    Bloque VARCHAR(50),
    Capacidad INT NOT NULL CHECK (Capacidad > 0),
    Tipo_Lugar VARCHAR(50) NOT NULL CHECK (Tipo_Lugar IN ('Auditorio', 'Salon', 'Laboratorio', 'Virtual')),
    Estado VARCHAR(20) NOT NULL DEFAULT 'Activo' CHECK (Estado IN ('Activo', 'Inactivo')),
    UNIQUE (Nombre, Bloque),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE CATEGORIA_EVENTO (
    ID SERIAL PRIMARY KEY,
    Nombre_Categoria VARCHAR(100) NOT NULL UNIQUE,
    Descripcion TEXT,
    Estado VARCHAR(20) NOT NULL DEFAULT 'Activo' CHECK (Estado IN ('Activo', 'Inactivo')),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE PONENTE (
    ID SERIAL PRIMARY KEY,
    Primer_Nombre VARCHAR(50) NOT NULL,
    Segundo_Nombre VARCHAR(50),
    Primer_Apellido VARCHAR(50) NOT NULL,
    Segundo_Apellido VARCHAR(50),
    Correo VARCHAR(120) NOT NULL UNIQUE,
    Telefono VARCHAR(20),
    Profesion VARCHAR(100),
    Institucion VARCHAR(150),
    Estado VARCHAR(20) NOT NULL DEFAULT 'Activo' CHECK (Estado IN ('Activo', 'Inactivo')),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE USUARIO (
    ID SERIAL PRIMARY KEY,
    Primer_Nombre VARCHAR(50) NOT NULL,
    Segundo_Nombre VARCHAR(50),
    Primer_Apellido VARCHAR(50) NOT NULL,
    Segundo_Apellido VARCHAR(50),
    Correo_Institucional VARCHAR(120) NOT NULL UNIQUE,
    Contraseña VARCHAR(100) NOT NULL,
    Telefono VARCHAR(20),
    Estado VARCHAR(20) NOT NULL DEFAULT 'Activo' CHECK (Estado IN ('Activo', 'Inactivo')),

    ID_Rol INT NOT NULL,
    ID_Programa INT NOT NULL,

    CONSTRAINT fk_usuario_rol
        FOREIGN KEY (ID_Rol)
        REFERENCES ROL(ID)
        ON DELETE RESTRICT,

    CONSTRAINT fk_usuario_programa
        FOREIGN KEY (ID_Programa)
        REFERENCES PROGRAMA(ID)
        ON DELETE RESTRICT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE EVENTO (
    ID SERIAL PRIMARY KEY,
    Nombre VARCHAR(150) NOT NULL,
    Descripcion TEXT NOT NULL,
    Fecha DATE NOT NULL,
    Hora TIME NOT NULL,
    Cupo_Max INT NOT NULL CHECK (Cupo_Max > 0),
    Modalidad VARCHAR(50) NOT NULL CHECK (Modalidad IN ('Presencial', 'Virtual')),
    Estado VARCHAR(50) NOT NULL CHECK (Estado IN ('Programado', 'En curso', 'Finalizado', 'Cancelado')),

    ID_Lugar INT,
    ID_Categoria_Evento INT NOT NULL,

    CONSTRAINT fk_evento_lugar
        FOREIGN KEY (ID_Lugar)
        REFERENCES LUGAR(ID)
        ON DELETE SET NULL,

    CONSTRAINT fk_evento_categoria
        FOREIGN KEY (ID_Categoria_Evento)
        REFERENCES CATEGORIA_EVENTO(ID)
        ON DELETE RESTRICT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE INSCRIBE (
    ID SERIAL PRIMARY KEY,
    ID_Usuario INT NOT NULL,
    ID_Evento INT NOT NULL,
    Fecha DATE NOT NULL DEFAULT CURRENT_DATE,
    Estado VARCHAR(50) NOT NULL CHECK (Estado IN ('Inscrito', 'Cancelado')),

    CONSTRAINT fk_inscribe_usuario
        FOREIGN KEY (ID_Usuario)
        REFERENCES USUARIO(ID)
        ON DELETE CASCADE,

    CONSTRAINT fk_inscribe_evento
        FOREIGN KEY (ID_Evento)
        REFERENCES EVENTO(ID)
        ON DELETE CASCADE,

    CONSTRAINT unique_inscripcion
        UNIQUE (ID_Usuario, ID_Evento),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE PARTICIPA (
    ID SERIAL PRIMARY KEY,
    ID_Evento INT NOT NULL,
    ID_Ponente INT NOT NULL,
    Rol_Evento VARCHAR(100) NOT NULL,
    Estado VARCHAR(20) NOT NULL DEFAULT 'Activo' CHECK (Estado IN ('Activo', 'Inactivo')),

    CONSTRAINT fk_participa_evento
        FOREIGN KEY (ID_Evento)
        REFERENCES EVENTO(ID)
        ON DELETE CASCADE,

    CONSTRAINT fk_participa_ponente
        FOREIGN KEY (ID_Ponente)
        REFERENCES PONENTE(ID)
        ON DELETE CASCADE,

    CONSTRAINT unique_participacion
        UNIQUE (ID_Evento, ID_Ponente),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE ASISTENCIA (
    ID SERIAL PRIMARY KEY,
    ID_Inscribe INT NOT NULL UNIQUE,
    Fecha DATE NOT NULL DEFAULT CURRENT_DATE,
    Estado VARCHAR(50) NOT NULL CHECK (Estado IN ('Asistio', 'No asistio')),

    CONSTRAINT fk_asistencia_inscripcion
        FOREIGN KEY (ID_Inscribe)
        REFERENCES INSCRIBE(ID)
        ON DELETE CASCADE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE ENCUESTA (
    ID SERIAL PRIMARY KEY,
    Titulo VARCHAR(150) NOT NULL,
    Descripcion TEXT,
    ID_Evento INT NOT NULL UNIQUE,
    Estado VARCHAR(20) NOT NULL DEFAULT 'Activo' CHECK (Estado IN ('Activo', 'Inactivo')),

    CONSTRAINT fk_encuesta_evento
        FOREIGN KEY (ID_Evento)
        REFERENCES EVENTO(ID)
        ON DELETE CASCADE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE PREGUNTA (
    ID SERIAL PRIMARY KEY,
    Enunciado TEXT NOT NULL,
    ID_Encuesta INT NOT NULL,
    Estado VARCHAR(20) NOT NULL DEFAULT 'Activo' CHECK (Estado IN ('Activo', 'Inactivo')),

    CONSTRAINT fk_pregunta_encuesta
        FOREIGN KEY (ID_Encuesta)
        REFERENCES ENCUESTA(ID)
        ON DELETE CASCADE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE OPC_RESPUESTA (
    ID SERIAL PRIMARY KEY,
    Descripcion TEXT NOT NULL,
    ID_Pregunta INT NOT NULL,
    Estado VARCHAR(20) NOT NULL DEFAULT 'Activo' CHECK (Estado IN ('Activo', 'Inactivo')),

    CONSTRAINT fk_opc_pregunta
        FOREIGN KEY (ID_Pregunta)
        REFERENCES PREGUNTA(ID)
        ON DELETE CASCADE,

    CONSTRAINT unique_opcion
        UNIQUE (Descripcion, ID_Pregunta),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE RESPUESTA_USUARIO (
    ID SERIAL PRIMARY KEY,
    ID_Usuario INT NOT NULL,
    ID_Pregunta INT NOT NULL,
    ID_Opcion INT NOT NULL,
    Estado VARCHAR(20) NOT NULL DEFAULT 'Activo' CHECK (Estado IN ('Activo', 'Inactivo')),

    CONSTRAINT fk_respuesta_usuario
        FOREIGN KEY (ID_Usuario)
        REFERENCES USUARIO(ID)
        ON DELETE CASCADE,

    CONSTRAINT fk_respuesta_pregunta
        FOREIGN KEY (ID_Pregunta)
        REFERENCES PREGUNTA(ID)
        ON DELETE CASCADE,

    CONSTRAINT fk_respuesta_opcion
        FOREIGN KEY (ID_Opcion)
        REFERENCES OPC_RESPUESTA(ID)
        ON DELETE CASCADE,

    CONSTRAINT unique_respuesta
        UNIQUE (ID_Usuario, ID_Pregunta),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

    CREATE OR REPLACE FUNCTION actualizar_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    DO $$
    DECLARE
        t RECORD;
    BEGIN
        FOR t IN
            SELECT table_name
            FROM information_schema.columns
            WHERE column_name = 'updated_at'
            AND table_schema = 'public'
        LOOP
            EXECUTE format(
                'CREATE TRIGGER trigger_%I_updated_at
                BEFORE UPDATE ON %I
                FOR EACH ROW
                EXECUTE FUNCTION actualizar_updated_at();',
                t.table_name,
                t.table_name
            );
        END LOOP;
    END $$;

INSERT INTO ROL (Nombre, Descripcion) VALUES
('Estudiante', 'Usuario estudiante del programa'),
('Docente', 'Profesor de la institucion'),
('Administrador', 'Gestiona el sistema'),
('Invitado', 'Usuario externo'),
('Coordinador', 'Coordina eventos');

INSERT INTO PROGRAMA (Nombre) VALUES
('Ingenieria de Sistemas'),
('Ingenieria de Industrial'),
('Lincenciatura en pedagogía infantil'),
('Lincenciatura en educacion fisica'),
('Administracion financiera'),
('Contaduria publica'),
('Administración Integral De Riesgos De Seguridad Y Salud En El Trabajo');

INSERT INTO LUGAR (Nombre, Bloque, Capacidad, Tipo_Lugar) VALUES
('Auditorio Central', 'A', 200, 'Auditorio'),
('Salon 101', 'B', 40, 'Salon'),
('Laboratorio Redes', 'C', 30, 'Laboratorio'),
('Aula Virtual 1', NULL, 500, 'Virtual'),
('Salon 202', 'B', 35, 'Salon');

INSERT INTO CATEGORIA_EVENTO (Nombre_Categoria, Descripcion) VALUES
('Academico', 'Eventos academicos'),
('Cultural', 'Eventos culturales'),
('Investigacion', 'Semilleros y proyectos'),
('Tecnologico', 'Eventos de tecnologia'),
('Bienestar', 'Actividades recreativas');

INSERT INTO PONENTE 
(Primer_Nombre, Segundo_Nombre, Primer_Apellido, Segundo_Apellido, Correo, Telefono, Profesion, Institucion)
VALUES
('Carlos', 'Andres', 'Perez', 'Lopez', 'carlos.perez1@gmail.com', '3001000001', 'Ingeniero de Sistemas', 'Universidad del Norte'),
('Maria', NULL, 'Gomez', 'Ruiz', 'maria.gomez2@gmail.com', '3001000002', 'Psicologa', 'Universidad Libre'),
('Luis', 'Fernando', 'Martinez', 'Diaz', 'luis.martinez3@gmail.com', '3001000003', 'Contador Publico', 'Universidad del Atlantico'),
('Ana', NULL, 'Torres', 'Mejia', 'ana.torres4@gmail.com', '3001000004', 'Abogada', 'Universidad Simon Bolivar'),
('Jorge', 'Ivan', 'Ramirez', 'Soto', 'jorge.ramirez5@gmail.com', '3001000005', 'Administrador', 'Universidad del Norte'),
('Daniel', NULL, 'Castro', 'Lozano', 'daniel.castro6@gmail.com', '3001000006', 'Ingeniero Industrial', 'Universidad Libre'),
('Laura', 'Sofia', 'Mendez', 'Garcia', 'laura.mendez7@gmail.com', '3001000007', 'Comunicadora Social', 'Universidad del Atlantico'),
('Pedro', NULL, 'Vargas', 'Morales', 'pedro.vargas8@gmail.com', '3001000008', 'Ingeniero Civil', 'Universidad del Norte'),
('Camila', NULL, 'Suarez', 'Perez', 'camila.suarez9@gmail.com', '3001000009', 'Psicologa Clinica', 'Universidad Simon Bolivar'),
('Andres', 'Felipe', 'Rojas', 'Diaz', 'andres.rojas10@gmail.com', '3001000010', 'Desarrollador Backend', 'Universidad del Norte'),
('Sofia', NULL, 'Herrera', 'Lopez', 'sofia.herrera11@gmail.com', '3001000011', 'Investigadora', 'Universidad Libre'),
('Miguel', NULL, 'Navarro', 'Reyes', 'miguel.navarro12@gmail.com', '3001000012', 'Analista de Datos', 'Universidad del Atlantico'),
('Valentina', NULL, 'Pardo', 'Silva', 'valentina.pardo13@gmail.com', '3001000013', 'Docente Universitaria', 'Universidad Simon Bolivar'),
('David', NULL, 'Moreno', 'Gil', 'david.moreno14@gmail.com', '3001000014', 'Especialista en Redes', 'Universidad del Norte'),
('Paula', 'Andrea', 'Cortes', 'Rios', 'paula.cortes15@gmail.com', '3001000015', 'Abogada Penalista', 'Universidad Libre'),
('Julian', NULL, 'Campos', 'Ortiz', 'julian.campos16@gmail.com', '3001000016', 'Economista', 'Universidad del Atlantico'),
('Natalia', NULL, 'Vega', 'Lara', 'natalia.vega17@gmail.com', '3001000017', 'Psicologa Organizacional', 'Universidad Simon Bolivar'),
('Kevin', NULL, 'Duran', 'Quintero', 'kevin.duran18@gmail.com', '3001000018', 'Ingeniero de Software', 'Universidad del Norte'),
('Daniela', NULL, 'Mora', 'Sanchez', 'daniela.mora19@gmail.com', '3001000019', 'Contadora', 'Universidad Libre'),
('Sebastian', 'Alejandro', 'Ortega', 'Nieto', 'sebastian.ortega20@gmail.com', '3001000020', 'Administrador Publico', 'Universidad del Atlantico');


INSERT INTO USUARIO 
(Primer_Nombre, Segundo_Nombre, Primer_Apellido, Segundo_Apellido, Correo_Institucional, contraseña, Telefono, ID_Rol, ID_Programa)
VALUES
('Juan', NULL, 'Rodriguez', 'Lopez', 'juan@uni.edu.co', '123456', '3011111111', 3, 1),
('Laura', 'Sofia', 'Mendez', 'Garcia', 'laura@uni.edu.co', '123456', '3011111112', 1, 2),
('Pedro', NULL, 'Castro', 'Diaz', 'pedro@uni.edu.co', '123456', '3011111113', 1, 1),
('Camila', 'Andrea', 'Suarez', 'Perez', 'camila@uni.edu.co', '123456', '3011111114', 1, 3),
('Andres', NULL, 'Vargas', 'Torres', 'andres@uni.edu.co', '123456', '3011111115', 1, 4),
('Sofia', NULL, 'Rojas', 'Mejia', 'sofia@uni.edu.co', '123456', '3011111116', 1, 5),
('Miguel', NULL, 'Herrera', 'Lozano', 'miguel@uni.edu.co', '123456', '3011111117', 1, 1),
('Valentina', NULL, 'Pardo', 'Silva', 'valen@uni.edu.co', '123456', '3011111118', 1, 2),
('Daniel', 'Alberto', 'Moreno', 'Gil', 'daniel@uni.edu.co', '123456', '3011111119', 2, 3),
('Paula', NULL, 'Cortes', 'Reyes', 'paula@uni.edu.co', '123456', '3011111120', 1, 4),
('David', NULL, 'Navarro', 'Rios', 'david@uni.edu.co', '123456', '3011111121', 3, 5),
('Sara', 'Maria', 'Leal', 'Sanchez', 'sara@uni.edu.co', '123456', '3011111122', 1, 1),
('Julian', NULL, 'Campos', 'Ortiz', 'julian@uni.edu.co', '123456', '3011111123', 1, 2),
('Natalia', NULL, 'Vega', 'Lara', 'natalia@uni.edu.co', '123456', '3011111124', 1, 3),
('Kevin', NULL, 'Duran', 'Quintero', 'kevin@uni.edu.co', '123456', '3011111125', 1, 4),
('Daniela', 'Andrea', 'Mora', 'Rueda', 'daniela@uni.edu.co', '123456', '3011111126', 1, 5),
('Sebastian', NULL, 'Ortega', 'Nieto', 'sebastian@uni.edu.co', '123456', '3011111127', 1, 1),
('Isabella', NULL, 'Cabrera', 'Pineda', 'isa@uni.edu.co', '123456', '3011111128', 1, 2),
('Tomas', 'Enrique', 'Guerra', 'Ochoa', 'tomas@uni.edu.co', '123456', '3011111129', 3, 3),
('Lucia', NULL, 'Alvarez', 'Bermudez', 'lucia@uni.edu.co', '123456', '3011111130', 1, 4);

INSERT INTO EVENTO 
(Nombre, Descripcion, Fecha, Hora, Cupo_Max, Modalidad, Estado, ID_Lugar, ID_Categoria_Evento)
VALUES
('Congreso de Tecnologia 2026', 'Evento sobre innovacion tecnologica', '2026-04-17', '08:00:00', 200, 'Presencial', 'Finalizado', 1, 4),
('Foro Psicologia Moderna', 'Actualizaciones en psicologia', '2026-03-05', '09:00:00', 100, 'Presencial', 'Finalizado', 2, 1),
('Seminario Contable', 'Nuevas normas contables', '2026-05-07', '10:00:00', 80, 'Presencial', 'Programado', 5, 1),
('Taller de Redes', 'Configuracion avanzada de redes', '2026-08-09', '14:00:00', 30, 'Presencial', 'Programado', 3, 4),
('Charla Bienestar Estudiantil', 'Salud mental universitaria', '2026-08-11', '11:00:00', 150, 'Presencial', 'Programado', 1, 5),
('Webinar Derecho Digital', 'Aspectos legales de internet', '2026-08-13', '16:00:00', 500, 'Virtual', 'Programado', 4, 1),
('Encuentro Cultural', 'Presentaciones artisticas', '2026-05-15', '17:00:00', 180, 'Presencial', 'Programado', 1, 2),
('Hackathon 2026', 'Competencia de programacion', '2026-08-17', '08:30:00', 120, 'Presencial', 'Programado', 1, 4),
('Conferencia Liderazgo', 'Habilidades gerenciales', '2026-08-19', '09:30:00', 100, 'Presencial', 'Programado', 2, 1),
('Semillero Investigacion IA', 'Avances en inteligencia artificial', '2026-08-20', '10:00:00', 60, 'Presencial', 'Programado', 3, 3),
('Jornada Ambiental', 'Conciencia ecologica', '2026-06-21', '08:00:00', 90, 'Presencial', 'Programado', 5, 5),
('Foro Emprendimiento', 'Creacion de startups', '2026-08-22', '14:00:00', 150, 'Presencial', 'Programado', 1, 1),
('Taller Programacion Web', 'Desarrollo fullstack', '2026-08-24', '09:00:00', 40, 'Presencial', 'Programado', 3, 4),
('Simposio Derecho Penal', 'Casos practicos', '2026-08-25', '10:00:00', 110, 'Presencial', 'Programado', 1, 1),
('Conferencia Finanzas', 'Educacion financiera', '2026-06-26', '15:00:00', 130, 'Presencial', 'Programado', 2, 1),
('Webinar Marketing Digital', 'Estrategias digitales', '2026-06-27', '18:00:00', 500, 'Virtual', 'Programado', 4, 2),
('Encuentro Investigadores', 'Presentacion de proyectos', '2026-08-28', '09:00:00', 70, 'Presencial', 'Programado', 5, 3),
('Charla Seguridad Informatica', 'Proteccion de datos', '2026-07-29', '11:00:00', 100, 'Presencial', 'Programado', 1, 4),
('Taller Habilidades Blandas', 'Comunicacion efectiva', '2026-07-30', '14:00:00', 60, 'Presencial', 'Programado', 2, 5),
('Clausura Academica', 'Cierre de actividades', '2026-08-31', '16:00:00', 200, 'Presencial', 'Programado', 1, 1);

INSERT INTO PARTICIPA (ID_Evento, ID_Ponente, Rol_Evento) VALUES
(1, 1, 'Conferencista'),
(2, 2, 'Conferencista'),
(3, 3, 'Conferencista'),
(4, 4, 'Tallerista'),
(5, 5, 'Conferencista'),
(6, 6, 'Conferencista'),
(7, 7, 'Moderador'),
(8, 8, 'Conferencista'),
(9, 9, 'Conferencista'),
(10, 10, 'Investigador'),
(11, 11, 'Conferencista'),
(12, 12, 'Moderador'),
(13, 13, 'Tallerista'),
(14, 14, 'Conferencista'),
(15, 15, 'Conferencista'),
(16, 16, 'Conferencista'),
(17, 17, 'Investigador'),
(18, 18, 'Conferencista'),
(19, 19, 'Tallerista'),
(20, 20, 'Conferencista');

INSERT INTO INSCRIBE (ID_Usuario, ID_Evento, Fecha, Estado) VALUES
(1, 1, '2026-04-10', 'Inscrito'),
(3, 1, '2026-04-12', 'Inscrito'),
(4, 2, '2026-03-01', 'Inscrito'),
(16, 3, '2026-05-01', 'Inscrito'),
(1, 4, '2026-08-05', 'Inscrito'),
(4, 5, '2026-08-06', 'Inscrito'),
(5, 6, '2026-08-07', 'Inscrito'),
(8, 7, '2026-05-10', 'Inscrito'),
(1, 8, '2026-08-09', 'Inscrito'),
(2, 9, '2026-08-10', 'Inscrito'),
(1, 10, '2026-08-11', 'Inscrito'),
(12, 11, '2026-06-15', 'Inscrito'),
(5, 12, '2026-08-13', 'Inscrito'),
(3, 13, '2026-08-14', 'Inscrito'),
(5, 14, '2026-08-15', 'Cancelado'),
(16, 15, '2026-06-20', 'Inscrito'),
(5, 16, '2026-06-25', 'Inscrito'),
(3, 17, '2026-08-18', 'Inscrito'),
(1, 18, '2026-07-20', 'Inscrito'),
(4, 19, '2026-07-25', 'Inscrito'),
(8, 20, '2026-08-20', 'Inscrito');

INSERT INTO ASISTENCIA (ID_Inscribe, Fecha, Estado) VALUES
(1, '2026-04-17', 'Asistio'),
(2, '2026-04-17', 'Asistio'),
(3, '2026-03-05', 'No asistio');

INSERT INTO ENCUESTA (Titulo, Descripcion, ID_Evento) VALUES
('Encuesta Tecnologia', 'Evaluacion del congreso tecnologico', 1),
('Encuesta Psicologia', 'Opinion del foro psicologia', 2),
('Encuesta Contable', 'Evaluacion del seminario contable', 3),
('Encuesta Redes', 'Opinion taller de redes', 4),
('Encuesta Bienestar', 'Evaluacion bienestar estudiantil', 5),
('Encuesta Derecho Digital', 'Opinion webinar derecho', 6),
('Encuesta Cultural', 'Evaluacion evento cultural', 7),
('Encuesta Hackathon', 'Opinion hackathon 2026', 8),
('Encuesta Liderazgo', 'Evaluacion conferencia liderazgo', 9),
('Encuesta IA', 'Opinion semillero IA', 10),
('Encuesta Ambiental', 'Evaluacion jornada ambiental', 11),
('Encuesta Emprendimiento', 'Opinion foro emprendimiento', 12),
('Encuesta Programacion Web', 'Evaluacion taller web', 13),
('Encuesta Derecho Penal', 'Opinion simposio penal', 14),
('Encuesta Finanzas', 'Evaluacion conferencia finanzas', 15),
('Encuesta Marketing', 'Opinion marketing digital', 16),
('Encuesta Investigadores', 'Evaluacion encuentro investigadores', 17),
('Encuesta Seguridad', 'Opinion seguridad informatica', 18),
('Encuesta Habilidades Blandas', 'Evaluacion habilidades blandas', 19),
('Encuesta Clausura', 'Opinion evento clausura', 20);

INSERT INTO PREGUNTA (Enunciado, ID_Encuesta) VALUES
('¿Como califica la organizacion del evento?',1),
('¿Recomendaria este evento?',1),

('¿El contenido fue claro?',2),
('¿El ponente domino el tema?',2),

('¿La informacion fue util?',3),
('¿Asistiria nuevamente?',3),

('¿El taller fue practico?',4),
('¿El tiempo fue suficiente?',4),

('¿El evento cumplio sus expectativas?',5),
('¿La tematica fue interesante?',5),

('¿El webinar tuvo buena calidad?',6),
('¿Fue facil conectarse?',6),

('¿Disfruto el evento cultural?',7),
('¿La organizacion fue adecuada?',7),

('¿El hackathon fue desafiante?',8),
('¿Participaria otra vez?',8),

('¿Aprendio nuevas habilidades?',9),
('¿El contenido fue dinamico?',9),

('¿La investigacion presentada fue innovadora?',10),
('¿Se entendio la exposicion?',10),

('¿El evento ambiental fue interesante?',11),
('¿La informacion fue clara?',11),

('¿El foro fue motivador?',12),
('¿Fue util para emprender?',12),

('¿El taller fue comprensible?',13),
('¿Aplicaria lo aprendido?',13),

('¿El simposio fue enriquecedor?',14),
('¿El caso practico fue claro?',14),

('¿La conferencia fue interesante?',15),
('¿Aprendio algo nuevo?',15),

('¿Las estrategias fueron claras?',16),
('¿Aplicaria el marketing digital?',16),

('¿Los proyectos fueron interesantes?',17),
('¿Hubo buena organizacion?',17),

('¿La charla fue util?',18),
('¿La informacion fue actual?',18),

('¿Mejoro sus habilidades blandas?',19),
('¿Recomendaria este taller?',19),

('¿El evento de clausura fue satisfactorio?',20),
('¿Volveria a participar?',20);

INSERT INTO OPC_RESPUESTA (Descripcion, ID_Pregunta)
SELECT opcion, pregunta
FROM generate_series(1,40) AS pregunta,
LATERAL (VALUES 
('Excelente'),
('Bueno'),
('Regular'),
('Malo')
) AS opciones(opcion);

INSERT INTO RESPUESTA_USUARIO (ID_Usuario, ID_Pregunta, ID_Opcion) VALUES
(1,1,1),(1,2,6),
(2,3,10),(2,4,14),
(3,5,19),(3,6,22),
(4,7,27),(4,8,30),
(5,9,34),(5,10,38),
(6,11,41),(6,12,46),
(7,13,50),(7,14,54),
(8,15,59),(8,16,62),
(9,17,66),(9,18,70),
(10,19,75),(10,20,78),
(11,21,82),(11,22,86),
(12,23,90),(12,24,94),
(13,25,99),(13,26,102),
(14,27,106),(14,28,110),
(15,29,115),(15,30,118),
(16,31,122),(16,32,126),
(17,33,131),(17,34,134),
(18,35,138),(18,36,142),
(19,37,147),(19,38,150),
(20,39,154),(20,40,158);