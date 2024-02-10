const express = require("express")
const {
  obtenerJoyas,
  obtenerJoyasFiltros,
  obtenerJoyasId,
} = require("../utils/pg")
const { generarInforme } = require("../middleware/middleware.js")
const app = express()

app.use(express.json())
app.use(generarInforme)

app.listen(3000, () => {
  console.log("Server ON")
})

app.get("/joyas", async (req, res) => {
  const data = await obtenerJoyas(req.query)
  res.json(data)
})

app.get("/joyas/filtros", async (req, res) => {
  const joyas = await obtenerJoyasFiltros(req.query)
  res.json(joyas)
})

app.get("/joyas/joya/:id", async (req, res) => {
  const joya = await obtenerJoyasId(req.params.id)
  res.json(joya)
})

app.get("*", (req, res) => {
  res.status(404).send("Esta ruta no existe")
})
