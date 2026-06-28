const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");

async function connectDB() {
    const db = await open({
        filename: "./database.db",
        driver: sqlite3.Database
    });

    await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    `);

    console.log("Connected to SQLite!");

    return db;
}

module.exports = connectDB;