const pool = require("../config/db");

async function getUserByEmail(email) {
  const result = await pool.query(
    "SELECT * FROM usuarios WHERE email = $1",
    [email]
  );

  return result.rows[0];
}

async function getUserById(id) {
  const result = await pool.query(
    "SELECT id, nombre, email, rol, created_at FROM usuarios WHERE id = $1",
    [id]
  );

  return result.rows[0];
}

async function createUser(user) {
  const { nombre, email, password, rol } = user;

  const result = await pool.query(
    `INSERT INTO usuarios (nombre, email, password, rol)
     VALUES ($1, $2, $3, $4)
     RETURNING id, nombre, email, rol, created_at`,
    [nombre, email, password, rol]
  );

  return result.rows[0];
}

module.exports = {
  getUserByEmail,
  getUserById,
  createUser,
};