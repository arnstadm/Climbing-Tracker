require('dotenv').config();
const fs = require('fs');
const { Pool } = require('pg');

const ssl = process.env.PGSSL === 'true'
    ? {
        rejectUnauthorized: true,
        ca: fs.readFileSync(process.env.PGSSLCA_PATH).toString(),
    }
    : false;

const pool = new Pool({
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST,
    port: parseInt(process.env.PGPORT, 10),
    database: process.env.PGDATABASE,
    ssl,
});

module.exports = pool;