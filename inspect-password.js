const { Pool } = require('pg');
require('dotenv').config({ path: 'apps/client/.env' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function inspect() {
  try {
    const res = await pool.query(`SELECT id, email, password FROM "user" ORDER BY created_at DESC LIMIT 5`);
    console.log('Recent users:', res.rows);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
}

inspect();