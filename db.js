import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT || 5432, 
  max: 20, 
  idleTimeoutMillis: 30000, 
  connectionTimeoutMillis: 2000, 
});


pool.on('connect', () => {
  console.log('Database Status: PostgreSQL connection established successfully! 🚀');
});

pool.on('error', (err) => {
  console.error('Database Status: Unexpected error on idle client', err.message);
  process.exit(-1); 
});

export { pool };