const bcrypt = require("bcryptjs");
const userModel = require("../models/userModel");

const VALID_ROLES = ["admin", "tecnico", "visor"];

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function getUsers(req, res) {
  try {
    const users = await userModel.getAllUsers();

    res.status(200).json({
      ok: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Error al obtener usuarios",
      error: error.message,
    });
  }
}

async function getUser(req, res) {
  try {
    const { id } = req.params;
    const user = await userModel.getUserById(id);

    if (!user) {
      return res.status(404).json({
        ok: false,
        message: "Usuario no encontrado",
      });
    }

    res.status(200).json({
      ok: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Error al obtener usuario",
      error: error.message,
    });
  }
}

async function createUser(req, res) {
  try {
    const { nombre, email, password, rol } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({
        ok: false,
        message: "Nombre, email y contraseña son obligatorios",
      });
    }

    if (nombre.trim().length < 3) {
      return res.status(400).json({
        ok: false,
        message: "El nombre debe tener al menos 3 caracteres",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        ok: false,
        message: "Correo electrónico no válido",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        ok: false,
        message: "La contraseña debe tener al menos 6 caracteres",
      });
    }

    const existingUser = await userModel.getUserByEmail(email.trim());

    if (existingUser) {
      return res.status(409).json({
        ok: false,
        message: "El correo ya está registrado",
      });
    }

    const userRole = VALID_ROLES.includes(rol) ? rol : "visor";
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.createUser({
      nombre: nombre.trim(),
      email: email.trim(),
      password: hashedPassword,
      rol: userRole,
    });

    res.status(201).json({
      ok: true,
      message: "Usuario creado correctamente",
      data: newUser,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Error al crear usuario",
      error: error.message,
    });
  }
}

async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { nombre, email, rol } = req.body;

    const currentUser = await userModel.getUserById(id);

    if (!currentUser) {
      return res.status(404).json({
        ok: false,
        message: "Usuario no encontrado",
      });
    }

    if (!nombre || !email || !rol) {
      return res.status(400).json({
        ok: false,
        message: "Nombre, email y rol son obligatorios",
      });
    }

    if (nombre.trim().length < 3) {
      return res.status(400).json({
        ok: false,
        message: "El nombre debe tener al menos 3 caracteres",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        ok: false,
        message: "Correo electrónico no válido",
      });
    }

    if (!VALID_ROLES.includes(rol)) {
      return res.status(400).json({
        ok: false,
        message: "Rol no válido",
      });
    }

    const userWithEmail = await userModel.getUserByEmail(email.trim());

    if (userWithEmail && Number(userWithEmail.id) !== Number(id)) {
      return res.status(409).json({
        ok: false,
        message: "El correo ya está registrado por otro usuario",
      });
    }

    const updatedUser = await userModel.updateUser(id, {
      nombre: nombre.trim(),
      email: email.trim(),
      rol,
    });

    res.status(200).json({
      ok: true,
      message: "Usuario actualizado correctamente",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Error al actualizar usuario",
      error: error.message,
    });
  }
}

async function updatePassword(req, res) {
  try {
    const { id } = req.params;
    const { password } = req.body;

    const currentUser = await userModel.getUserById(id);

    if (!currentUser) {
      return res.status(404).json({
        ok: false,
        message: "Usuario no encontrado",
      });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({
        ok: false,
        message: "La contraseña debe tener al menos 6 caracteres",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedUser = await userModel.updateUserPassword(id, hashedPassword);

    res.status(200).json({
      ok: true,
      message: "Contraseña actualizada correctamente",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Error al actualizar contraseña",
      error: error.message,
    });
  }
}

async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    if (Number(req.user.id) === Number(id)) {
      return res.status(400).json({
        ok: false,
        message: "No puedes eliminar tu propio usuario autenticado",
      });
    }

    const deletedUser = await userModel.deleteUser(id);

    if (!deletedUser) {
      return res.status(404).json({
        ok: false,
        message: "Usuario no encontrado",
      });
    }

    res.status(200).json({
      ok: true,
      message: "Usuario eliminado correctamente",
      data: deletedUser,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Error al eliminar usuario",
      error: error.message,
    });
  }
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updatePassword,
  deleteUser,
};