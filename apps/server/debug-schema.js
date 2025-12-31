const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgres://postgres:postgres@localhost:5432/machinemall'
});
async function checkSchema() {
  try {
    await client.connect();
    
    const tables = ['user', 'account', 'session'];
    
    for (const table of tables) {
        console.log(`\n--- Table: ${table} ---`);
        const res = await client.query(`
            SELECT column_name, data_type, column_default, is_nullable
            FROM information_schema.columns 
            WHERE table_name = '${table}'
        `);
        res.rows.forEach(r => {
            console.log(`${r.column_name}: ${r.data_type} (Default: ${r.column_default}, Nullable: ${r.is_nullable})`);
        });
    }

  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}
checkSchema();