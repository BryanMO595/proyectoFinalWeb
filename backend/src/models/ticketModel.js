const pool = require("../config/db");

async function getAllTickets() {
  const result = await pool.query(
    "SELECT * FROM tickets ORDER BY fecha DESC"
  );
  return result.rows;
}

async function getTicketById(id) {
  const result = await pool.query(
    "SELECT * FROM tickets WHERE id = $1",
    [id]
  );
  return result.rows[0];
}

async function createTicket(ticket) {
  const { ticket_code, dispositivo, correo, tipo, prioridad, descripcion } = ticket;

  const result = await pool.query(
    `INSERT INTO tickets 
      (ticket_code, dispositivo, correo, tipo, prioridad, descripcion, estado)
     VALUES 
      ($1, $2, $3, $4, $5, $6, 'Abierto')
     RETURNING *`,
    [ticket_code, dispositivo, correo, tipo, prioridad, descripcion]
  );

  return result.rows[0];
}

async function updateTicket(id, ticket) {
  const { dispositivo, correo, tipo, prioridad, descripcion, estado } = ticket;

  const result = await pool.query(
    `UPDATE tickets
     SET dispositivo = $1,
         correo = $2,
         tipo = $3,
         prioridad = $4,
         descripcion = $5,
         estado = $6
     WHERE id = $7
     RETURNING *`,
    [dispositivo, correo, tipo, prioridad, descripcion, estado, id]
  );

  return result.rows[0];
}

async function updateTicketStatus(id, estado) {
  const result = await pool.query(
    `UPDATE tickets
     SET estado = $1
     WHERE id = $2
     RETURNING *`,
    [estado, id]
  );

  return result.rows[0];
}

async function closeTicket(id) {
  const result = await pool.query(
    "UPDATE tickets SET estado = 'Cerrado' WHERE id = $1 RETURNING *",
    [id]
  );

  return result.rows[0];
}

async function deleteTicket(id) {
  const result = await pool.query(
    "DELETE FROM tickets WHERE id = $1 RETURNING *",
    [id]
  );

  return result.rows[0];
}

module.exports = {
  getAllTickets,
  getTicketById,
  createTicket,
  updateTicket,
  updateTicketStatus,
  closeTicket,
  deleteTicket,
};