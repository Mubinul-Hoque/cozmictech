import mariadb from 'mariadb';

async function run() {
  console.log('Connecting to MariaDB...');
  const pool = mariadb.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'cozmictech_v2',
    connectionLimit: 5
  });

  try {
    const conn = await pool.getConnection();
    console.log('Connected!');
    const res = await conn.query('SELECT count(*) as c FROM projects');
    console.log('Projects count:', res[0].c);
    conn.release();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    pool.end();
  }
}
run();
