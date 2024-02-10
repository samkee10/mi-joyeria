const { Pool } = require("pg")
const format = require("pg-format")

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  password: "25786224sam",
  database: "joyas",
  port: 5432,
  allowExitOnIdle: true,
})

const obtenerJoyas = async ({ limits = 5, page = 1, order_by = "id_asc" }) => {
  try {
    const [campo, orden] = order_by.split("_")
    const offset = (page - 1) * limits
    const formattedQuery = format(
      "SELECT * FROM inventario ORDER BY %s %s LIMIT %s OFFSET %s",
      campo,
      orden,
      limits,
      offset
    )
    const { rows: joyas } = await pool.query(formattedQuery)
    const result = joyas.map((joya) => ({
      nombre: joya.nombre,
      href: `joyas/joya/${joya.id}`,
    }))
    const stockTotal = joyas.reduce((total, joya) => total + joya.stock, 0)
    const totalJoyas = joyas.length
    const joyasHATEOAS = {
      "totalJoyas": totalJoyas,
      "stockTotal": stockTotal,
      result,
    }
    return joyasHATEOAS
  } catch (error) {
    return { codigo: 500, error: error.message }
  }
}
const obtenerJoyasFiltros = async ({
  precio_max,
  precio_min,
  categoria,
  metal,
}) => {
  try {
    let filters = []
    let values = []
    let query = "SELECT * FROM inventario"
    const addFilter = (field, comparator, value) => {
      values.push(value)
      const { length } = filters
      filters.push(` ${field} ${comparator} $${length + 1}`)
    }
    if (precio_min) addFilter("precio", ">=", precio_min)
    if (precio_max) addFilter("precio", "<=", precio_max)
    if (categoria) addFilter("categoria", "=", categoria.toLowerCase())
    if (metal) addFilter("metal", "=", metal.toLowerCase())
    if (filters.length > 0) {
      filters = filters.join(" AND ")
      query += ` WHERE ${filters}`
    }
    const { rows: joyas } = await pool.query(query, values)
    return joyas
  } catch (error) {
    return { codigo: 500, error: error.message }
  }
}

const obtenerJoyasId = async (id) => {
  try {
    const { rows: joyas } = await pool.query(
      "SELECT * FROM inventario WHERE id = $1",
      [id]
    )
    return joyas[0]
  } catch (error) {
    return { codigo: 500, error: error.message }
  }
}
module.exports = { obtenerJoyas, obtenerJoyasFiltros, obtenerJoyasId }
