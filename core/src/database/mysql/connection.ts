import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';

const connection = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  port: Number(process.env.MYSQL_PORT) || 3306,
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'mile_app',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const mysqlDb = drizzle(connection, { schema, mode: 'default' });

export const testMySQLConnection = async (): Promise<boolean> => {
  try {
    const conn = await connection.getConnection();
    console.log('✅ MySQL connected successfully');
    conn.release();
    return true;
  } catch (error) {
    console.error('❌ MySQL connection failed:', error);
    return false;
  }
};
