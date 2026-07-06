-- Script para resetear contraseñas a valores simples para testing
-- IMPORTANTE: Solo usar en ambiente de desarrollo
-- Todas las contraseñas se establecen a "password123" hasheada con bcrypt

-- Hash bcrypt de "password123" con 12 rounds
-- Generado con: BCryptPasswordEncoder().encode("password123")
-- Hash: $2a$12$7EhYD.dLOPGPlPqVf5S5dO2iB9C8bXrKe5v.QvYLCvnRRXKV8LhLa

UPDATE usuarios SET password = '$2a$12$7EhYD.dLOPGPlPqVf5S5dO2iB9C8bXrKe5v.QvYLCvnRRXKV8LhLa';

-- Después de ejecutar este script:
-- Todos los usuarios tendrán contraseña: password123
--
-- Usuarios para testing:
-- - admin1 / password123 (ADMIN)
-- - biblio1 / password123 (BIBLIOTECARIO)
-- - est1 / password123 (ESTUDIANTE)
