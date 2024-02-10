const generarInforme = (req, res, next) => {
  const fecha = new Date().toISOString()
  const metodo = req.method
  const ruta = req.originalUrl
  const estado = res.statusCode
  console.log(`[${fecha}] ${metodo} ${ruta} - Estado: ${estado}`)
  next()
}

module.exports = { generarInforme }
