const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  register: (username, password) => ipcRenderer.invoke('register', username, password),
  login: (username, password) => ipcRenderer.invoke('login', username, password),
  createRoom: (roomName, userId) => ipcRenderer.invoke('create-room', roomName, userId),
  joinRoom: (roomId, userId) => ipcRenderer.invoke('join-room', roomId, userId),
  getRooms: () => ipcRenderer.invoke('get-rooms'),
  sendMessage: (roomId, userId, content) => ipcRenderer.invoke('send-message', roomId, userId, content),
  getMessages: (roomId) => ipcRenderer.invoke('get-messages', roomId),
});
