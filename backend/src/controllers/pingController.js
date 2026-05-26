const { execFile } = require("child_process");
const deviceModel = require("../models/deviceModel");

function isValidIp(ip) {
  const ipv4Regex =
    /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;

  return ipv4Regex.test(ip);
}

function extractLatency(output) {
  const match = output.match(/time=([\d.]+)\s*ms/);
  return match ? Number(match[1]) : null;
}

async function pingDevice(req, res) {
  try {
    const { id } = req.params;

    const device = await deviceModel.getDeviceById(id);

    if (!device) {
      return res.status(404).json({
        ok: false,
        message: "Dispositivo no encontrado",
      });
    }

    if (!isValidIp(device.ip)) {
      return res.status(400).json({
        ok: false,
        message: "La IP del dispositivo no es válida",
      });
    }

    execFile(
      "ping",
      ["-c", "1", "-W", "2", device.ip],
      { timeout: 4000 },
      (error, stdout, stderr) => {
        const output = stdout || stderr || "";
        const reachable = !error;
        const latencyMs = reachable ? extractLatency(output) : null;

        return res.status(200).json({
          ok: true,
          device: {
            id: device.id,
            nombre: device.nombre,
            ip: device.ip,
          },
          ping: {
            reachable,
            status: reachable ? "Online" : "Offline",
            latencyMs,
            checkedAt: new Date().toISOString(),
            output,
          },
        });
      }
    );
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Error al ejecutar ping",
      error: error.message,
    });
  }
}

module.exports = {
  pingDevice,
};