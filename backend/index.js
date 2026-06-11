import sequelize from "./config/db.js";
import express from "express";

import authRoutes from "./routes/auth.routes.js";
import equiposRoutes from "./routes/equipos.routes.js";
import solicitudesRoutes from "./routes/solicitudes.routes.js";


import { errorHandler } from "./middlewares/error.middleware.js";

import "./models/asociaciones.js"

const app = express();

app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/equipos", equiposRoutes);
app.use("/api/solicitudes", solicitudesRoutes);




app.get("/", (req, res) => {
  res.json({ mensaje: "API funcionando" });
});


app.use(errorHandler);

const PORT = 3000;

if (process.env.NODE_ENV !== 'test') {
  sequelize.sync()
    .then(() => {
      console.log("Base de datos sincronizada");

      app.listen(PORT, () => {
        console.log(`Servidor escuchando en puerto ${PORT}`);
      });
    })
    .catch((err) => {
      console.error("Error al sincronizar la BD:", err);
    });
}


export default app;