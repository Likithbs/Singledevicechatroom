const path=require('path');
const sqlite3 = require('sqlite3').verbose();
class Database{
constructor() {
    this.db = new sqlite3.Database(path.join(__dirname, '../chat.db'));
    this.init();
  }

  init() {
    this.db.serialize(() => {
      this.db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
      )`);

      this.db.run(`CREATE TABLE IF NOT EXISTS rooms (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        created_by INTEGER,
        FOREIGN KEY(created_by) REFERENCES users(id)
      )`);

      this.db.run(`CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        room_id INTEGER,
        user_id INTEGER,
        content TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(room_id) REFERENCES rooms(id),
        FOREIGN KEY(user_id) REFERENCES users(id)
      )`);
    });
  }

  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, changes: this.changes });
      });
    });
  }

  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }
}

module.exports = new Database;
