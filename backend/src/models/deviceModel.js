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

async function getDeviceByName(nombre) {
  const result = await pool.query(
    "SELECT * FROM dispositivos WHERE LOWER(nombre) = LOWER($1)",
    [nombre]
  );
  return result.rows[0];
}

async function getDeviceByIp(ip) {
  const result = await pool.query(
    "SELECT * FROM dispositivos WHERE ip = $1",
    [ip]
  );
  return result.rows[0];
}

async function getDeviceByMac(mac) {
  const result = await pool.query(
    "SELECT * FROM dispositivos WHERE LOWER(mac) = LOWER($1)",
    [mac]
  );
  return result.rows[0];
}

async function createDevice(device) {
  const { nombre, ip, mac, tipo, estado, ubicacion } = device;

  const result = await pool.query(
    `INSERT INTO dispositivos (nombre, ip, mac, tipo, estado, ubicacion)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [nombre, ip, mac, tipo, estado, ubicacion]
  );

  return result.rows[0];
}

async function updateDevice(id, device) {
  const { nombre, ip, mac, tipo, estado, ubicacion } = device;

  const result = await pool.query(
    `UPDATE dispositivos
     SET nombre = $1,
         ip = $2,
         mac = $3,
         tipo = $4,
         estado = $5,
         ubicacion = $6
     WHERE id = $7
     RETURNING *`,
    [nombre, ip, mac, tipo, estado, ubicacion, id]
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

async function deleteDevice(id) {
  const result = await pool.query(
    "DELETE FROM dispositivos WHERE id = $1 RETURNING *",
    [id]
  );

  return result.rows[0];
}

module.exports = {
  getAllDevices,
  getDeviceById,
  getDeviceByName,
  getDeviceByIp,
  getDeviceByMac,
  createDevice,
  updateDevice,
  updateDeviceStatus,
  deleteDevice,
};