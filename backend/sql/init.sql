DROP TABLE IF EXISTS mensajes_contacto CASCADE;
DROP TABLE IF EXISTS tickets CASCADE;
DROP TABLE IF EXISTS dispositivos CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(30) NOT NULL DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE dispositivos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    ip VARCHAR(50) NOT NULL,
    mac VARCHAR(50) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    estado VARCHAR(30) NOT NULL CHECK (estado IN ('Online', 'Offline', 'Degradación')),
    ubicacion VARCHAR(120) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tickets (
    id SERIAL PRIMARY KEY,
    ticket_code VARCHAR(50) UNIQUE NOT NULL,
    dispositivo VARCHAR(100) NOT NULL,
    correo VARCHAR(120) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    prioridad VARCHAR(20) NOT NULL CHECK (prioridad IN ('Alta', 'Media', 'Baja')),
    descripcion TEXT NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'Abierto' CHECK (estado IN ('Abierto', 'Cerrado')),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE mensajes_contacto (
    id SERIAL PRIMARY KEY,
    mensaje_code VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(120) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    mensaje TEXT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO usuarios (nombre, email, password, rol) VALUES
('Bryan Mendoza', 'admin@networkmonitor.com', '123456', 'admin');

INSERT INTO dispositivos (nombre, ip, mac, tipo, estado, ubicacion) VALUES
('Router-Core-01', '192.168.1.1', '00:1A:2B:3C:4D:5E', 'Router', 'Online', 'Cuarto de comunicaciones'),
('Switch-Piso1', '192.168.1.2', '00:F1:E2:D3:C4:B5', 'Switch L2', 'Offline', 'Laboratorio de Sistemas'),
('Server-DB', '192.168.1.10', 'AA:BB:CC:DD:EE:FF', 'Servidor', 'Online', 'Centro de datos'),
('PC-Lab-01', '192.168.1.20', '10:20:30:40:50:60', 'PC', 'Online', 'Laboratorio de Redes'),
('PC-Lab-02', '192.168.1.21', '11:22:33:44:55:66', 'PC', 'Online', 'Laboratorio de Redes'),
('AccessPoint-01', '192.168.1.30', 'AB:CD:EF:12:34:56', 'Access Point', 'Online', 'Edificio A');