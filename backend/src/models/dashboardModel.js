const pool = require("../config/db");

async function getDashboardSummary() {
  const devicesResult = await pool.query(`
    SELECT
      COUNT(*)::int AS total,
      COUNT(*) FILTER (WHERE estado = 'Online')::int AS online,
      COUNT(*) FILTER (WHERE estado = 'Offline')::int AS offline,
      COUNT(*) FILTER (WHERE estado = 'Degradación')::int AS degradacion
    FROM dispositivos
  `);

  const ticketsResult = await pool.query(`
    SELECT
      COUNT(*)::int AS total,
      COUNT(*) FILTER (WHERE estado = 'Abierto')::int AS abiertos,
      COUNT(*) FILTER (WHERE estado = 'Cerrado')::int AS cerrados,
      COUNT(*) FILTER (WHERE prioridad = 'Alta' AND estado = 'Abierto')::int AS criticos
    FROM tickets
  `);

  const recentTicketsResult = await pool.query(`
    SELECT *
    FROM tickets
    ORDER BY fecha DESC
    LIMIT 5
  `);

  const recentDevicesResult = await pool.query(`
    SELECT *
    FROM dispositivos
    ORDER BY id ASC
  `);

  return {
    devices: devicesResult.rows[0],
    tickets: ticketsResult.rows[0],
    recentTickets: recentTicketsResult.rows,
    devicesList: recentDevicesResult.rows,
  };
}

module.exports = {
  getDashboardSummary,
};