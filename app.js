require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const ticketRoutes = require("./routes/ticket.routes");
const notificationRoutes = require("./routes/notification.routes");

const app = express();
const PORT = 3000;

// Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Ruta raíz
app.get("/", (req, res) => {
  res.send("¡Bienvenido a la API RESTful!");
});

// Rutas
app.use("/tickets", ticketRoutes);
app.use("/notifications", notificationRoutes);

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({
      error: "JSON inválido en el cuerpo de la petición.",
    });
  }

  console.error(err);
  return res.status(500).json({ error: "Error interno del servidor." });
});

module.exports = app;

// Levantar el servidor solo cuando se ejecuta directamente
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
  });
}

