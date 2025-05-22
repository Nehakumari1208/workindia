import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

export async function initializeDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
    });

    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`
    );

    const db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100) UNIQUE,
        password VARCHAR(255),
        role ENUM('admin', 'user') DEFAULT 'user'
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS trains (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100),
        source VARCHAR(100),
        destination VARCHAR(100),
        total_seats INT
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        train_id INT,
        source VARCHAR(100),
        destination VARCHAR(100),
        seat_number INT,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (train_id) REFERENCES trains(id),
        UNIQUE KEY unique_train_seat (train_id, seat_number)
      );
`);

    await db.end();
    await connection.end();
    console.log("Database and tables initialized!");
  } catch (err) {
    console.error("DB Initialization Error:", err.message);
    throw err;
  }
}
