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
  const r = await pool.request().query(`
    SELECT member_status, COUNT(*) n FROM mbmembmaster GROUP BY member_status ORDER BY member_status
  `);
  console.log('status counts', r.recordset);
  const types = await pool.request().query(`SELECT TOP 15 member_type, description FROM mbmembtype`);
  console.log('types', types.recordset);
}

main().catch(console.error);
