const bcrypt = require("bcryptjs");
const pool = require("../config/db");

async function main() {
  try {
    const email = "admin@networkmonitor.com";
    const plainPassword = "123456";

    const hash = await bcrypt.hash(plainPassword, 10);

    const result = await pool.query(
      "UPDATE usuarios SET password = $1 WHERE email = $2 RETURNING id, nombre, email, rol",
      [hash, email]
    );

    if (result.rows.length === 0) {
      console.log("No se encontró el usuario:", email);
      process.exit(1);
    }

    console.log("Password actualizado correctamente:");
    console.log(result.rows[0]);
    console.log("Hash generado:", hash);

    process.exit(0);
  } catch (error) {
    console.error("Error actualizando password:", error.message);
    process.exit(1);
  }
}

main();