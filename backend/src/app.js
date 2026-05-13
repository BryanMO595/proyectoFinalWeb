const express = require("express");
const cors = require("cors");
const pool = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const deviceRoutes = require("./routes/deviceRoutes");
const ticketRoutes = require("./routes/ticketRoutes");
const contactMessageRoutes = require("./routes/contactMessageRoutes");
const userRoutes = require("./routes/userRoutes");

const { verifyToken } = require("./middleware/authMiddleware");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    ok: true,
    message: "Backend del sistema de monitoreo funcionando",
  });
});

app.get("/api/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW() AS fecha");
    res.status(200).json({
      ok: true,
      message: "Conexion a PostgreSQL exitosa",
      data: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Error al conectar a PostgreSQL",
      error: error.message,
    });
  }
});

app.use("/api/auth", authRoutes);

app.use("/api/devices", verifyToken, deviceRoutes);
app.use("/api/tickets", verifyToken, ticketRoutes);
app.use("/api/contact-messages", verifyToken, contactMessageRoutes);
app.use("/api/users", userRoutes);

module.exports = app;