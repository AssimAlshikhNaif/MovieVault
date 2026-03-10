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
  // Default PostgreSQL port
  // Add some production-ready settings
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 2000, // How long to wait before timing out when connecting a new client
});

// Database connection event listeners
pool.on('connect', () => {
  console.log('Database Status: PostgreSQL connection established successfully! 🚀');
});

pool.on('error', (err) => {
  console.error('Database Status: Unexpected error on idle client', err.message);
  process.exit(-1); // Exit process if database connection fails critically
});

export { pool };