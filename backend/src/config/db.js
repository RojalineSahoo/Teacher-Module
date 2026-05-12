import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

pool.connect()
  .then(() => console.log('✅ PostgreSQL Connected Successfully'))
  .catch(err => console.error('❌ PostgreSQL Connection Failed:', err));

pool.on('error', (err) => {
  console.error('PostgreSQL Connection Error:', err);
  process.exit(-1);
});

export const query = (text, params) => pool.query(text, params);
export default pool;