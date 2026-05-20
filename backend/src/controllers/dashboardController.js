const dashboardModel = require("../models/dashboardModel");

async function getSummary(req, res) {
  try {
    const summary = await dashboardModel.getDashboardSummary();

    const totalDevices = summary.devices.total;
    const onlineDevices = summary.devices.online;

    const availability =
      totalDevices === 0 ? 0 : ((onlineDevices / totalDevices) * 100).toFixed(1);

    res.status(200).json({
      ok: true,
      data: {
        devices: summary.devices,
        tickets: summary.tickets,
        availability: Number(availability),
        recentTickets: summary.recentTickets,
        devicesList: summary.devicesList,
      },
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Error al obtener resumen del dashboard",
      error: error.message,
    });
  }
}

module.exports = {
  getSummary,
};