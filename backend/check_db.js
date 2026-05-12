
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function checkSchema() {
  try {
    const tables = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
    console.log('Tables:', tables.rows.map(r => r.table_name));

    const assignmentColumns = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'assignments'");
    console.log('Assignment Columns:', assignmentColumns.rows);

    const submissionColumns = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'submissions'");
    console.log('Submission Columns:', submissionColumns.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

checkSchema();
