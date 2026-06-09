import express from "express";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ mensaje: "API funcionando" });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});