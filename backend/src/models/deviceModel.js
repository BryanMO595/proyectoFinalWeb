const pool = require("../config/db");

async function getAllDevices() {
  const result = await pool.query(
    "SELECT * FROM dispositivos ORDER BY id ASC"
  );
  return result.rows;
}

async function getDeviceById(id) {
  const result = await pool.query(
    "SELECT * FROM dispositivos WHERE id = $1",
    [id]
  );
  return result.rows[0];
}

async function updateDeviceStatus(id, estado) {
  const result = await pool.query(
    "UPDATE dispositivos SET estado = $1 WHERE id = $2 RETURNING *",
    [estado, id]
  );
  return result.rows[0];
}

module.exports = {
  getAllDevices,
  getDeviceById,
  updateDeviceStatus,
};