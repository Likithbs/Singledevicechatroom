// DOM Elements
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const chatInterface = document.getElementById('chat-interface');
const messageForm = document.getElementById('message-form');
const messageList = document.getElementById('message-list');
const roomList = document.getElementById('room-list');
const createRoomForm = document.getElementById('create-room-form');
const roomNameDisplay = document.getElementById('room-name-display');
const messageInput = document.getElementById('message-input');
const switchToRegisterBtn = document.getElementById('switch-to-register');
const switchToLoginBtn = document.getElementById('switch-to-login');

// Global variables
let currentUser = null;
let currentRoom = null;

// Event Listeners
loginForm.addEventListener('submit', handleLogin);
registerForm.addEventListener('submit', handleRegister);
messageForm.addEventListener('submit', handleSendMessage);
createRoomForm.addEventListener('submit', handleCreateRoom);
switchToRegisterBtn.addEventListener('click', () => {
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
});
switchToLoginBtn.addEventListener('click', () => {
    registerForm.style.display = 'none';
    loginForm.style.display = 'block';
});

// Authentication functions
async function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    try {
        currentUser = await window.api.login(username, password);
        console.log('Logged in:', currentUser);
        showChatInterface();
    } catch (error) {
        console.error('Login failed:', error);
        alert('Login failed: ' + error.message);
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    try {
        currentUser = await window.api.register(username, password);
        console.log('Registered:', currentUser);
        showChatInterface();
    } catch (error) {
        console.error('Registration failed:', error);
        alert('Registration failed: ' + error.message);
    }
}

// Chat functions
async function handleSendMessage(e) {
    e.preventDefault();
    const content = messageInput.value.trim();
    if (currentRoom && content) {
        try {
            await window.api.sendMessage(currentRoom.id, currentUser.id, content);
            messageInput.value = '';
            await refreshMessages();
        } catch (error) {
            console.error('Failed to send message:', error);
            alert('Failed to send message: ' + error.message);
        }
    }
}

async function refreshMessages() {
    if (currentRoom) {
        try {
            const messages = await window.api.getMessages(currentRoom.id);
            messageList.innerHTML = '';
            messages.forEach(msg => {
                const msgElement = document.createElement('div');
                msgElement.textContent = `${msg.username}: ${msg.content}`;
                msgElement.classList.add('message');
                messageList.appendChild(msgElement);
            });
            messageList.scrollTop = messageList.scrollHeight;
        } catch (error) {
            console.error('Failed to refresh messages:', error);
        }
    }
}

// Room functions
async function handleCreateRoom(e) {
    e.preventDefault();
    const roomName = document.getElementById('room-name').value.trim();
    if (roomName) {
        try {
            const room = await window.api.createRoom(roomName, currentUser.id);
            console.log('Room created:', room);
            await refreshRooms();
            joinRoom(room);
        } catch (error) {
            console.error('Failed to create room:', error);
            alert('Failed to create room: ' + error.message);
        }
    }
}

async function refreshRooms() {
    try {
        const rooms = await window.api.getRooms();
        roomList.innerHTML = '';
        rooms.forEach(room => {
            const roomElement = document.createElement('div');
            roomElement.textContent = room.name;
            roomElement.classList.add('room-item');
            roomElement.addEventListener('click', () => joinRoom(room));
            roomList.appendChild(roomElement);
        });
    } catch (error) {
        console.error('Failed to refresh rooms:', error);
    }
}

async function joinRoom(room) {
    try {
        currentRoom = await window.api.joinRoom(room.id, currentUser.id);
        console.log('Joined room:', currentRoom);
        roomNameDisplay.textContent = currentRoom.name;
        await refreshMessages();
    } catch (error) {
        console.error('Failed to join room:', error);
        alert('Failed to join room: ' + error.message);
    }
}

// UI functions
function showChatInterface() {
    loginForm.style.display = 'none';
    registerForm.style.display = 'none';
    chatInterface.style.display = 'flex';
    refreshRooms();
}

// Initialize the application
function initApp() {
    console.log('Initializing app...');
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
    chatInterface.style.display = 'none';
}

// Call initApp when the window loads
window.addEventListener('load', initApp);

console.log('renderer.js loaded');
