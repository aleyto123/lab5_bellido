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

// Levantar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

