const Pool = require('pg').Pool
require('dotenv').config()

const psql_conection = new Pool({
  user: process.env.DB_USER || "boletia",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_DATABASE || "boletia",
  password: process.env.DB_PASSWORD || "password",
  port: process.env.DB_PORT || 5432
})

module.exports = {
    psql_conection
}