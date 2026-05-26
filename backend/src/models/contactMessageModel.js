const pool = require("../config/db");

async function getAllMessages() {
  const result = await pool.query(
    "SELECT * FROM mensajes_contacto ORDER BY fecha DESC"
  );
  return result.rows;
}

async function getMessageById(id) {
  const result = await pool.query(
    "SELECT * FROM mensajes_contacto WHERE id = $1",
    [id]
  );
  return result.rows[0];
}

async function createMessage(message) {
  const { mensaje_code, nombre, correo, tipo, mensaje } = message;

  const result = await pool.query(
    `INSERT INTO mensajes_contacto
      (mensaje_code, nombre, correo, tipo, mensaje)
     VALUES
      ($1, $2, $3, $4, $5)
     RETURNING *`,
    [mensaje_code, nombre, correo, tipo, mensaje]
  );

  return result.rows[0];
}

async function deleteMessage(id) {
  const result = await pool.query(
    "DELETE FROM mensajes_contacto WHERE id = $1 RETURNING *",
    [id]
  );

  return result.rows[0];
}

module.exports = {
  getAllMessages,
  getMessageById,
  createMessage,
  deleteMessage,
};