import '../load-root-env';
import sql from 'mssql';

async function main() {
  const pool = await sql.connect({
    server: process.env.SQLSERVER_HOST!,
    port: parseInt(process.env.SQLSERVER_PORT || '1433', 10),
    database: process.env.SQLSERVER_DATABASE!,
    user: process.env.SQLSERVER_USERNAME!,
    password: process.env.SQLSERVER_PASSWORD!,
    options: { encrypt: false, trustServerCertificate: true },
  });

  const tables = await pool.request().query<{ TABLE_NAME: string }>(`
    SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES
    WHERE TABLE_TYPE = 'BASE TABLE' ORDER BY TABLE_NAME
  `);
  console.log('TABLES:', tables.recordset.map((r) => r.TABLE_NAME).join(', '));

  const keywords = ['loan', 'borrow', 'member', 'book', 'circ', 'visit', 'gate', 'access', 'user', 'patron', 'transaction', 'log'];
  for (const kw of keywords) {
    const hits = tables.recordset.filter((r) => r.TABLE_NAME.toLowerCase().includes(kw));
    if (hits.length) console.log(`\n[${kw}]`, hits.map((h) => h.TABLE_NAME).join(', '));
  }

  await pool.close();
}

main().catch(console.error);
