const db = require('./Database');

class Rooms {
  async createRoom(name, userId) {
    const result = await db.run(
      'INSERT INTO rooms (name, created_by) VALUES (?, ?)',
      [name, userId]
    );
    return { id: result.id, name };
  }

  async joinRoom(roomId, userId) {
    const room = await db.get('SELECT * FROM rooms WHERE id = ?', [roomId]);
    if (!room) {
      throw new Error('Room not found');
    }
    return room;
  }

  async getRooms() {
    return await db.all('SELECT * FROM rooms');
  }
}

module.exports = new Rooms();