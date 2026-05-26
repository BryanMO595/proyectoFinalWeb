const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      rol: user.rol,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "2h",
    }
  );
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        ok: false,
        message: "Email y contraseña son obligatorios",
      });
    }

    const user = await userModel.getUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        ok: false,
        message: "Credenciales inválidas",
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({
        ok: false,
        message: "Credenciales inválidas",
      });
    }

    const token = generateToken(user);

    res.status(200).json({
      ok: true,
      message: "Inicio de sesión correcto",
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
      },
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Error al iniciar sesión",
      error: error.message,
    });
  }
}

async function register(req, res) {
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

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
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

    const existingUser = await userModel.getUserByEmail(email);

    if (existingUser) {
      return res.status(409).json({
        ok: false,
        message: "El correo ya está registrado",
      });
    }

    const validRoles = ["admin", "tecnico", "visor"];
    const userRole = validRoles.includes(rol) ? rol : "visor";

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
      message: "Error al registrar usuario",
      error: error.message,
    });
  }
}

async function me(req, res) {
  try {
    const user = await userModel.getUserById(req.user.id);

    if (!user) {
      return res.status(404).json({
        ok: false,
        message: "Usuario no encontrado",
      });
    }

    res.status(200).json({
      ok: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Error al obtener usuario autenticado",
      error: error.message,
    });
  }
}

module.exports = {
  login,
  register,
  me,
};