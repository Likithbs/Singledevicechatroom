const bcrypt = require('bcrypt');
const db = require('./Database');

class Auth {
  async register(username, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const result = await db.run(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        [username, hashedPassword]
      );
      return { id: result.id, username };
    } catch (error) {
      if (error.message.includes('UNIQUE constraint failed')) {
        throw new Error('Username already exists');
      }
      throw error;
    }
  }

  async login(username, password) {
    const user = await db.get('SELECT * FROM users WHERE username = ?', [username]);
    if (!user) {
      throw new Error('User not found');
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new Error('Incorrect password');
    }
    return { id: user.id, username: user.username };
  }
}

module.exports = new Auth();