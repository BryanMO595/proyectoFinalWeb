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

async function getAllUsers() {
  const result = await pool.query(
    "SELECT id, nombre, email, rol, created_at FROM usuarios ORDER BY id ASC"
  );

  return result.rows;
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

async function updateUser(id, user) {
  const { nombre, email, rol } = user;

  const result = await pool.query(
    `UPDATE usuarios
     SET nombre = $1, email = $2, rol = $3
     WHERE id = $4
     RETURNING id, nombre, email, rol, created_at`,
    [nombre, email, rol, id]
  );

  return result.rows[0];
}

async function updateUserPassword(id, hashedPassword) {
  const result = await pool.query(
    `UPDATE usuarios
     SET password = $1
     WHERE id = $2
     RETURNING id, nombre, email, rol, created_at`,
    [hashedPassword, id]
  );

  return result.rows[0];
}

async function deleteUser(id) {
  const result = await pool.query(
    `DELETE FROM usuarios
     WHERE id = $1
     RETURNING id, nombre, email, rol, created_at`,
    [id]
  );

  return result.rows[0];
}

module.exports = {
  getUserByEmail,
  getUserById,
  getAllUsers,
  createUser,
  updateUser,
  updateUserPassword,
  deleteUser,
};