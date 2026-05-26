const ticketModel = require("../models/ticketModel");

const VALID_PRIORITIES = ["Alta", "Media", "Baja"];
const VALID_TYPES = ["hardware", "software"];
const VALID_STATUS = ["Abierto", "Cerrado"];

function generateTicketCode() {
  const random = Math.floor(Math.random() * 9000) + 1000;
  return `TCK-${Date.now()}-${random}`;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateTicketPayload(payload) {
  const { dispositivo, correo, tipo, prioridad, descripcion } = payload;

  if (!dispositivo || !correo || !tipo || !prioridad || !descripcion) {
    return "Todos los campos son obligatorios";
  }

  if (dispositivo.trim().length < 3 || dispositivo.trim().length > 100) {
    return "El dispositivo debe tener entre 3 y 100 caracteres";
  }

  if (!isValidEmail(correo.trim())) {
    return "Correo electrónico no válido";
  }

  if (!VALID_TYPES.includes(tipo)) {
    return "Tipo de incidencia no válido";
  }

  if (!VALID_PRIORITIES.includes(prioridad)) {
    return "Prioridad no válida";
  }

  if (descripcion.trim().length < 10) {
    return "La descripción debe tener al menos 10 caracteres";
  }

  return null;
}

function sanitizeTicketPayload(payload) {
  return {
    dispositivo: payload.dispositivo.trim(),
    correo: payload.correo.trim(),
    tipo: payload.tipo,
    prioridad: payload.prioridad,
    descripcion: payload.descripcion.trim(),
    estado: payload.estado || "Abierto",
  };
}

async function getTickets(req, res) {
  try {
    const tickets = await ticketModel.getAllTickets();

    res.status(200).json({
      ok: true,
      data: tickets,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Error al obtener tickets",
      error: error.message,
    });
  }
}

async function getTicket(req, res) {
  try {
    const { id } = req.params;
    const ticket = await ticketModel.getTicketById(id);

    if (!ticket) {
      return res.status(404).json({
        ok: false,
        message: "Ticket no encontrado",
      });
    }

    res.status(200).json({
      ok: true,
      data: ticket,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Error al obtener ticket",
      error: error.message,
    });
  }
}

async function createTicket(req, res) {
  try {
    const validationError = validateTicketPayload(req.body);

    if (validationError) {
      return res.status(400).json({
        ok: false,
        message: validationError,
      });
    }

    const ticketData = sanitizeTicketPayload(req.body);

    const newTicket = await ticketModel.createTicket({
      ticket_code: generateTicketCode(),
      dispositivo: ticketData.dispositivo,
      correo: ticketData.correo,
      tipo: ticketData.tipo,
      prioridad: ticketData.prioridad,
      descripcion: ticketData.descripcion,
    });

    res.status(201).json({
      ok: true,
      message: "Ticket creado correctamente",
      data: newTicket,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Error al crear ticket",
      error: error.message,
    });
  }
}

async function updateTicket(req, res) {
  try {
    const { id } = req.params;

    const currentTicket = await ticketModel.getTicketById(id);

    if (!currentTicket) {
      return res.status(404).json({
        ok: false,
        message: "Ticket no encontrado",
      });
    }

    const validationError = validateTicketPayload(req.body);

    if (validationError) {
      return res.status(400).json({
        ok: false,
        message: validationError,
      });
    }

    const ticketData = sanitizeTicketPayload(req.body);

    if (!VALID_STATUS.includes(ticketData.estado)) {
      return res.status(400).json({
        ok: false,
        message: "Estado no válido",
      });
    }

    const updatedTicket = await ticketModel.updateTicket(id, ticketData);

    res.status(200).json({
      ok: true,
      message: "Ticket actualizado correctamente",
      data: updatedTicket,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Error al actualizar ticket",
      error: error.message,
    });
  }
}

async function updateStatus(req, res) {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (!VALID_STATUS.includes(estado)) {
      return res.status(400).json({
        ok: false,
        message: "Estado no válido",
      });
    }

    const updated = await ticketModel.updateTicketStatus(id, estado);

    if (!updated) {
      return res.status(404).json({
        ok: false,
        message: "Ticket no encontrado",
      });
    }

    res.status(200).json({
      ok: true,
      message: "Estado del ticket actualizado correctamente",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Error al actualizar estado del ticket",
      error: error.message,
    });
  }
}

async function closeTicket(req, res) {
  try {
    const { id } = req.params;

    const closed = await ticketModel.closeTicket(id);

    if (!closed) {
      return res.status(404).json({
        ok: false,
        message: "Ticket no encontrado",
      });
    }

    res.status(200).json({
      ok: true,
      message: "Ticket cerrado correctamente",
      data: closed,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Error al cerrar ticket",
      error: error.message,
    });
  }
}

async function deleteTicket(req, res) {
  try {
    const { id } = req.params;

    const deleted = await ticketModel.deleteTicket(id);

    if (!deleted) {
      return res.status(404).json({
        ok: false,
        message: "Ticket no encontrado",
      });
    }

    res.status(200).json({
      ok: true,
      message: "Ticket eliminado correctamente",
      data: deleted,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Error al eliminar ticket",
      error: error.message,
    });
  }
}

module.exports = {
  getTickets,
  getTicket,
  createTicket,
  updateTicket,
  updateStatus,
  closeTicket,
  deleteTicket,
};