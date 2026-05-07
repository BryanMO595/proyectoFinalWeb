const deviceModel = require("../models/deviceModel");

async function getDevices(req, res) {
  try {
    const devices = await deviceModel.getAllDevices();
    res.status(200).json({
      ok: true,
      data: devices,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Error al obtener dispositivos",
      error: error.message,
    });
  }
}

async function getDevice(req, res) {
  try {
    const { id } = req.params;
    const device = await deviceModel.getDeviceById(id);

    if (!device) {
      return res.status(404).json({
        ok: false,
        message: "Dispositivo no encontrado",
      });
    }

    res.status(200).json({
      ok: true,
      data: device,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Error al obtener dispositivo",
      error: error.message,
    });
  }
}

async function updateStatus(req, res) {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const validStates = ["Online", "Offline", "Degradación"];
    if (!validStates.includes(estado)) {
      return res.status(400).json({
        ok: false,
        message: "Estado no válido",
      });
    }

    const updated = await deviceModel.updateDeviceStatus(id, estado);

    if (!updated) {
      return res.status(404).json({
        ok: false,
        message: "Dispositivo no encontrado",
      });
    }

    res.status(200).json({
      ok: true,
      message: "Estado actualizado correctamente",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Error al actualizar estado del dispositivo",
      error: error.message,
    });
  }
}

module.exports = {
  getDevices,
  getDevice,
  updateStatus,
};