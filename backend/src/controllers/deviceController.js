const deviceModel = require("../models/deviceModel");

const VALID_STATES = ["Online", "Offline", "Degradación"];

function isValidIp(ip) {
  const regex =
    /^(25[0-5]|2[0-4][0-9]|1?[0-9]{1,2})(\.(25[0-5]|2[0-4][0-9]|1?[0-9]{1,2})){3}$/;

  return regex.test(ip);
}

function isValidMac(mac) {
  const regex = /^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/;
  return regex.test(mac);
}

function validateDevicePayload(payload) {
  const { nombre, ip, mac, tipo, estado, ubicacion } = payload;

  if (!nombre || !ip || !mac || !tipo || !estado || !ubicacion) {
    return "Todos los campos son obligatorios";
  }

  if (nombre.trim().length < 3 || nombre.trim().length > 100) {
    return "El nombre debe tener entre 3 y 100 caracteres";
  }

  if (!isValidIp(ip.trim())) {
    return "La dirección IP no tiene un formato válido";
  }

  if (!isValidMac(mac.trim())) {
    return "La dirección MAC no tiene un formato válido. Ejemplo: AA:BB:CC:DD:EE:FF";
  }

  if (tipo.trim().length < 2 || tipo.trim().length > 50) {
    return "El tipo debe tener entre 2 y 50 caracteres";
  }

  if (!VALID_STATES.includes(estado)) {
    return "Estado no válido";
  }

  if (ubicacion.trim().length < 3 || ubicacion.trim().length > 120) {
    return "La ubicación debe tener entre 3 y 120 caracteres";
  }

  return null;
}

function sanitizeDevicePayload(payload) {
  return {
    nombre: payload.nombre.trim(),
    ip: payload.ip.trim(),
    mac: payload.mac.trim().toUpperCase(),
    tipo: payload.tipo.trim(),
    estado: payload.estado,
    ubicacion: payload.ubicacion.trim(),
  };
}

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

async function createDevice(req, res) {
  try {
    const validationError = validateDevicePayload(req.body);

    if (validationError) {
      return res.status(400).json({
        ok: false,
        message: validationError,
      });
    }

    const deviceData = sanitizeDevicePayload(req.body);

    const existingName = await deviceModel.getDeviceByName(deviceData.nombre);
    if (existingName) {
      return res.status(409).json({
        ok: false,
        message: "Ya existe un dispositivo con ese nombre",
      });
    }

    const existingIp = await deviceModel.getDeviceByIp(deviceData.ip);
    if (existingIp) {
      return res.status(409).json({
        ok: false,
        message: "Ya existe un dispositivo con esa IP",
      });
    }

    const existingMac = await deviceModel.getDeviceByMac(deviceData.mac);
    if (existingMac) {
      return res.status(409).json({
        ok: false,
        message: "Ya existe un dispositivo con esa MAC",
      });
    }

    const newDevice = await deviceModel.createDevice(deviceData);

    res.status(201).json({
      ok: true,
      message: "Dispositivo creado correctamente",
      data: newDevice,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Error al crear dispositivo",
      error: error.message,
    });
  }
}

async function updateDevice(req, res) {
  try {
    const { id } = req.params;

    const currentDevice = await deviceModel.getDeviceById(id);

    if (!currentDevice) {
      return res.status(404).json({
        ok: false,
        message: "Dispositivo no encontrado",
      });
    }

    const validationError = validateDevicePayload(req.body);

    if (validationError) {
      return res.status(400).json({
        ok: false,
        message: validationError,
      });
    }

    const deviceData = sanitizeDevicePayload(req.body);

    const existingName = await deviceModel.getDeviceByName(deviceData.nombre);
    if (existingName && Number(existingName.id) !== Number(id)) {
      return res.status(409).json({
        ok: false,
        message: "Ya existe otro dispositivo con ese nombre",
      });
    }

    const existingIp = await deviceModel.getDeviceByIp(deviceData.ip);
    if (existingIp && Number(existingIp.id) !== Number(id)) {
      return res.status(409).json({
        ok: false,
        message: "Ya existe otro dispositivo con esa IP",
      });
    }

    const existingMac = await deviceModel.getDeviceByMac(deviceData.mac);
    if (existingMac && Number(existingMac.id) !== Number(id)) {
      return res.status(409).json({
        ok: false,
        message: "Ya existe otro dispositivo con esa MAC",
      });
    }

    const updatedDevice = await deviceModel.updateDevice(id, deviceData);

    res.status(200).json({
      ok: true,
      message: "Dispositivo actualizado correctamente",
      data: updatedDevice,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Error al actualizar dispositivo",
      error: error.message,
    });
  }
}

async function updateStatus(req, res) {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (!VALID_STATES.includes(estado)) {
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

async function deleteDevice(req, res) {
  try {
    const { id } = req.params;

    const deletedDevice = await deviceModel.deleteDevice(id);

    if (!deletedDevice) {
      return res.status(404).json({
        ok: false,
        message: "Dispositivo no encontrado",
      });
    }

    res.status(200).json({
      ok: true,
      message: "Dispositivo eliminado correctamente",
      data: deletedDevice,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Error al eliminar dispositivo",
      error: error.message,
    });
  }
}

module.exports = {
  getDevices,
  getDevice,
  createDevice,
  updateDevice,
  updateStatus,
  deleteDevice,
};