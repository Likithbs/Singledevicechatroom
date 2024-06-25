const db = require('./Database');

class Messages {
  async sendMessage(roomId, userId, content) {
    const result = await db.run(
      'INSERT INTO messages (room_id, user_id, content) VALUES (?, ?, ?)',
      [roomId, userId, content]
    );
    return { id: result.id, roomId, userId, content };
  }

  async getMessages(roomId) {
    return await db.all(
      `SELECT messages.*, users.username 
       FROM messages 
       JOIN users ON messages.user_id = users.id 
       WHERE room_id = ? 
       ORDER BY timestamp ASC`,
      [roomId]
    );
  }
}

module.exports = new Messages();
