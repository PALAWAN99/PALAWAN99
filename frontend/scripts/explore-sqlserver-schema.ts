import '../load-root-env';
import sql from 'mssql';

const TABLES = [
  'gatestatement',
  'gatemaster',
  'gate_teansaction',
  'mbmembmaster',
  'mbmembtype',
  'branch',
  'accessdt_20240305',
];

async function main() {
  const pool = await sql.connect({
    server: process.env.SQLSERVER_HOST!,
    port: parseInt(process.env.SQLSERVER_PORT || '1433', 10),
    database: process.env.SQLSERVER_DATABASE!,
    user: process.env.SQLSERVER_USERNAME!,
    password: process.env.SQLSERVER_PASSWORD!,
    options: { encrypt: false, trustServerCertificate: true },
  });

  for (const table of TABLES) {
    const cols = await pool.request().query(`
      SELECT COLUMN_NAME, DATA_TYPE
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = '${table}'
      ORDER BY ORDINAL_POSITION
    `);
    console.log(`\n=== ${table} (${cols.recordset.length} cols) ===`);
    console.log(cols.recordset.map((c: { COLUMN_NAME: string; DATA_TYPE: string }) => `${c.COLUMN_NAME}:${c.DATA_TYPE}`).join(', '));

    const cnt = await pool.request().query(`SELECT COUNT(*) AS n FROM [${table}]`);
    console.log(`rows: ${cnt.recordset[0]?.n}`);

    const sample = await pool.request().query(`SELECT TOP 2 * FROM [${table}]`);
    if (sample.recordset[0]) {
      console.log('sample keys:', Object.keys(sample.recordset[0]).slice(0, 12).join(', '));
    }
  }

  // Recent gate activity
  const recent = await pool.request().query(`
    SELECT TOP 5 * FROM gatestatement ORDER BY 1 DESC
  `).catch(() => null);
  if (recent?.recordset[0]) {
    console.log('\n=== gatestatement sample row ===');
    console.log(JSON.stringify(recent.recordset[0], null, 2).slice(0, 800));
  }

  await pool.close();
}

main().catch(console.error);
