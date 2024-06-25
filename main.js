const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const auth = require('./src/auth');
const rooms = require('./src/rooms');
const messages = require('./src/messages');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile('index.html');

  // Uncomment the following line to open DevTools by default
  // mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();

  // Set up IPC listeners
  ipcMain.handle('register', async (event, username, password) => {
    try {
      return await auth.register(username, password);
    } catch (error) {
      throw error.message;
    }
  });

  ipcMain.handle('login', async (event, username, password) => {
    try {
      return await auth.login(username, password);
    } catch (error) {
      throw error.message;
    }
  });

  ipcMain.handle('create-room', async (event, roomName, userId) => {
    try {
      return await rooms.createRoom(roomName, userId);
    } catch (error) {
      throw error.message;
    }
  });

  ipcMain.handle('join-room', async (event, roomId, userId) => {
    try {
      return await rooms.joinRoom(roomId, userId);
    } catch (error) {
      throw error.message;
    }
  });

  ipcMain.handle('get-rooms', async () => {
    try {
      return await rooms.getRooms();
    } catch (error) {
      throw error.message;
    }
  });

  ipcMain.handle('send-message', async (event, roomId, userId, content) => {
    try {
      return await messages.sendMessage(roomId, userId, content);
    } catch (error) {
      throw error.message;
    }
  });

  ipcMain.handle('get-messages', async (event, roomId) => {
    try {
      return await messages.getMessages(roomId);
    } catch (error) {
      throw error.message;
    }
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
