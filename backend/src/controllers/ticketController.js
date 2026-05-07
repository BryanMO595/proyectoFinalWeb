const ticketModel = require("../models/ticketModel");

function generateTicketCode() {
  const random = Math.floor(Math.random() * 9000) + 1000;
  return `TCK-${Date.now()}-${random}`;
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
    const { dispositivo, correo, tipo, prioridad, descripcion } = req.body;

    if (!dispositivo || !correo || !tipo || !prioridad || !descripcion) {
      return res.status(400).json({
        ok: false,
        message: "Todos los campos son obligatorios",
      });
    }

    const validPriorities = ["Alta", "Media", "Baja"];
    if (!validPriorities.includes(prioridad)) {
      return res.status(400).json({
        ok: false,
        message: "Prioridad no válida",
      });
    }

    const newTicket = await ticketModel.createTicket({
      ticket_code: generateTicketCode(),
      dispositivo,
      correo,
      tipo,
      prioridad,
      descripcion,
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

module.exports = {
  getTickets,
  getTicket,
  createTicket,
  closeTicket,
};