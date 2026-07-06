-- Script para insertar usuarios con contraseñas bcrypt
-- Ejecutar después de que Hibernate cree las tablas

-- Administradores
INSERT INTO usuarios (username, password, codigo, dni, nombre, email, telefono, rol, estado)
VALUES
  ('admin1', '$2a$12$7/8spXDjcdh3xUJxlxZSGuJoa/Zge2lKKuTr7vwWLfYmjfir0lpkq', 'ADM001', '12345678', 'Administrador Uno', 'admin1@untels.edu.pe', '123456789', 'ADMIN', 'ACTIVO'),
  ('admin2', '$2a$12$N5TS/vYxKvAo2Lptwsqr7uZ7Yh7MSaTUmcMlC/PgE0p6nU0FiYHIK', 'ADM002', '87654321', 'Administrador Dos', 'admin2@untels.edu.pe', '987654321', 'ADMIN', 'ACTIVO');

-- Bibliotecarios
INSERT INTO usuarios (username, password, codigo, dni, nombre, email, telefono, rol, carrera, estado)
VALUES
  ('biblio1', '$2a$12$/eOx79LC6F./Aje8cMhvheQ8vJjMW0zzKHgC.SImqa4zxh1j4KFya', 'BIB001', '11111111', 'Bibliotecario Uno', 'biblio1@untels.edu.pe', '111111111', 'BIBLIOTECARIO', 'Biblioteconomía', 'ACTIVO'),
  ('biblio2', '$2a$12$6KTwcqvZJyWUzyvzukP05eA7ER2VTcCj2pw9dOiYktz/2Ikcp0rf6', 'BIB002', '22222222', 'Bibliotecario Dos', 'biblio2@untels.edu.pe', '222222222', 'BIBLIOTECARIO', 'Biblioteconomía', 'ACTIVO'),
  ('biblio3', '$2a$12$HUg9YA1UNfMQz3Gqea7beuf2vlWT1nnAzwSH5vePrGsM5v/6L.GHC', 'BIB003', '33333333', 'Bibliotecario Tres', 'biblio3@untels.edu.pe', '333333333', 'BIBLIOTECARIO', 'Biblioteconomía', 'ACTIVO'),
  ('biblio4', '$2a$12$9dmF1R8pbEKWjTQzQFCzv.0iiJIqd1.9GSEUjzyTBYg1IVtraYovS', 'BIB004', '44444444', 'Bibliotecario Cuatro', 'biblio4@untels.edu.pe', '444444444', 'BIBLIOTECARIO', 'Biblioteconomía', 'ACTIVO'),
  ('biblio5', '$2a$12$3KMT/.pg//tWuWIkNQP/p.yHQvDGEo/oXz0ecI2yzogfRm96ufTE.', 'BIB005', '55555555', 'Bibliotecario Cinco', 'biblio5@untels.edu.pe', '555555555', 'BIBLIOTECARIO', 'Biblioteconomía', 'ACTIVO');

-- Estudiantes
INSERT INTO usuarios (username, password, codigo, carnet, dni, nombre, email, telefono, rol, carrera, ciclo, estado)
VALUES
  ('est1', '$2a$12$xg3ti4wnuJJOzYE.FBIKq.XnbZdjv2Go3NgBe0infIh0JZFeuVD7y', 'EST001', 'CAR001', '66666666', 'Estudiante Uno', 'est1@untels.edu.pe', '666666666', 'ESTUDIANTE', 'Ingeniería en Sistemas', 5, 'ACTIVO'),
  ('est2', '$2a$12$Fw2BU.LbNftVkVWZiCASuuuF2FkSp5ou.qDcL4BuEscUWB9So76D2', 'EST002', 'CAR002', '77777777', 'Estudiante Dos', 'est2@untels.edu.pe', '777777777', 'ESTUDIANTE', 'Ingeniería en Sistemas', 3, 'ACTIVO'),
  ('est3', '$2a$12$0qXUfFfdaYr5rwEF1nahvuuNpvl7XkliApzkg.vF4pCR5kK2wJIJ2', 'EST003', 'CAR003', '88888888', 'Estudiante Tres', 'est3@untels.edu.pe', '888888888', 'ESTUDIANTE', 'Ingeniería en Sistemas', 6, 'ACTIVO'),
  ('est4', '$2a$12$1rmPJ9/9ZR2Mc6D44aj39.1aup3lLpGV7Py7itZydJOYzKp2Bti/q', 'EST004', 'CAR004', '99999999', 'Estudiante Cuatro', 'est4@untels.edu.pe', '999999999', 'ESTUDIANTE', 'Ingeniería en Sistemas', 4, 'ACTIVO'),
  ('est5', '$2a$12$uOWtnUzTaR.d1T.ximul8.MQUoyNGMYLfHsoKgP3EzqSkOQqb8VR2', 'EST005', 'CAR005', '10101010', 'Estudiante Cinco', 'est5@untels.edu.pe', '101010101', 'ESTUDIANTE', 'Ingeniería en Sistemas', 2, 'ACTIVO');
