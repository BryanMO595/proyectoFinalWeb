require("dotenv").config();

const bcrypt = require("bcryptjs");
const pool = require("../config/db");

async function createVisor() {

    try {

        console.log("Conectando a PostgreSQL...");

        const passwordPlano = "123456";

        const hash = await bcrypt.hash(passwordPlano, 10);

        console.log("Hash generado:", hash);

        const query = `
            INSERT INTO usuarios
            (nombre, email, password, rol)
            VALUES ($1, $2, $3, $4)
            RETURNING id, nombre, email, rol
        `;

        const values = [
            "Usuario Visor",
            "visor@networkmonitor.com",
            hash,
            "visor"
        ];

        const result = await pool.query(query, values);

        console.log("Usuario creado correctamente:");
        console.log(result.rows[0]);

    } catch (error) {

        console.error("Error:", error.message);

    } finally {

        pool.end();

    }

}

createVisor();