const dotenv = require('dotenv');
const { Pool } = require('pg')
const pool = new Pool({
    host: process.env.DB_host,
    user: process.env.DB_user,
    password: `${process.env.DB_passoword}`,
    database: process.env.DB_database,
    port: 5432
})

module.exports = pool