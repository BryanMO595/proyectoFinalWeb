# Network Monitoring System

Sistema web para monitoreo y gestión básica de infraestructura de red LAN.  
El proyecto integra frontend, backend, base de datos, autenticación JWT, control de roles, dashboard dinámico, inventario de dispositivos, tickets de soporte, contacto y topología interactiva.

Proyecto desarrollado para la materia de **Programación Web**.

---

## Tecnologías utilizadas

### Frontend
- HTML5
- CSS3
- JavaScript
- Tailwind CSS
- Live Server

### Backend
- Node.js
- Express.js
- PostgreSQL
- JWT
- bcryptjs
- Docker
- Docker Compose
- pgAdmin

---

## Arquitectura general

```text
Frontend
HTML / CSS / JS
        |
        | fetch() + Bearer Token
        v
Backend API REST
Node.js + Express
        |
        | pg
        v
PostgreSQL
Docker