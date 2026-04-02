const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  port: process.env.PGPORT ? parseInt(process.env.PGPORT, 10) : 5432,
  database: process.env.PGDATABASE || 'nicecoffee',
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || '',
});

module.exports = pool;
