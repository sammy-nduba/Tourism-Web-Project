import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

export const pool = mysql.createPool({
  uri: process.env.DATABASE_URL,
  waitForConnections: true,
  connectionLimit: 20,
  queueLimit: 0,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
});

// Utility: run a query with automatic client release
export async function query<T = any>(
  text: string,
  params?: any[]
): Promise<{ rows: T[]; fields: any }> {
  const start = Date.now();
  
  // Replace PostgreSQL $1, $2 with MySQL ? placeholders if needed
  // Note: For a true migration, all queries should be updated directly in services to use ?.
  const mysqlText = text.replace(/\$\d+/g, '?');
  
  const [rows, fields] = await pool.execute(mysqlText, params);
  const duration = Date.now() - start;

  if (process.env.NODE_ENV === 'development') {
    // Determine row count for logging
    const rowCount = Array.isArray(rows) ? rows.length : (rows as any).affectedRows;
    console.log(`[DB] query (${duration}ms) rows=${rowCount}`);
  }

  // To keep compatibility with pg's return shape: { rows }
  // MySQL returns arrays for SELECT and objects for INSERT/UPDATE
  return { rows: Array.isArray(rows) ? rows : ([rows] as any), fields };
}

// Utility: get a dedicated client for transactions
export async function getClient() {
  return pool.getConnection();
}

export default pool;
