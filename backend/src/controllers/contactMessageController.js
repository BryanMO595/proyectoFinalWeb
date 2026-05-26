const contactMessageModel = require("../models/contactMessageModel");

function generateMessageCode() {
  const random = Math.floor(Math.random() * 9000) + 1000;
  return `MSG-${Date.now()}-${random}`;
}

async function getMessages(req, res) {
  try {
    const messages = await contactMessageModel.getAllMessages();

    res.status(200).json({
      ok: true,
      data: messages,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Error al obtener mensajes de contacto",
      error: error.message,
    });
  }
}

async function getMessage(req, res) {
  try {
    const { id } = req.params;
    const message = await contactMessageModel.getMessageById(id);

    if (!message) {
      return res.status(404).json({
        ok: false,
        message: "Mensaje no encontrado",
      });
    }

    res.status(200).json({
      ok: true,
      data: message,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Error al obtener mensaje",
      error: error.message,
    });
  }
}

async function createMessage(req, res) {
  try {
    const { nombre, correo, tipo, mensaje } = req.body;

    if (!nombre || !correo || !tipo || !mensaje) {
      return res.status(400).json({
        ok: false,
        message: "Todos los campos son obligatorios",
      });
    }

    if (nombre.trim().length < 3) {
      return res.status(400).json({
        ok: false,
        message: "El nombre debe tener al menos 3 caracteres",
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      return res.status(400).json({
        ok: false,
        message: "Correo electrónico no válido",
      });
    }

    if (mensaje.trim().length < 10) {
      return res.status(400).json({
        ok: false,
        message: "El mensaje debe tener al menos 10 caracteres",
      });
    }

    const newMessage = await contactMessageModel.createMessage({
      mensaje_code: generateMessageCode(),
      nombre: nombre.trim(),
      correo: correo.trim(),
      tipo,
      mensaje: mensaje.trim(),
    });

    res.status(201).json({
      ok: true,
      message: "Mensaje creado correctamente",
      data: newMessage,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Error al crear mensaje",
      error: error.message,
    });
  }
}

async function deleteMessage(req, res) {
  try {
    const { id } = req.params;
    const deleted = await contactMessageModel.deleteMessage(id);

    if (!deleted) {
      return res.status(404).json({
        ok: false,
        message: "Mensaje no encontrado",
      });
    }

    res.status(200).json({
      ok: true,
      message: "Mensaje eliminado correctamente",
      data: deleted,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Error al eliminar mensaje",
      error: error.message,
    });
  }
}

module.exports = {
  getMessages,
  getMessage,
  createMessage,
  deleteMessage,
};