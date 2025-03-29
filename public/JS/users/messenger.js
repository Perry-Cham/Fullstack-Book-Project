// Connect to the Socket.IO server

const socket = io();
// Log when connection is established
socket.on('connect', () => {
  console.log('Connected to server');
});

// Get form and input elements
const form = document.querySelector('form');
const input = document.querySelector('input');

// Handle message sending
form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (input.value) {
    socket.emit('chat message', input.value);
    input.value = '';
  }
});

// Listen for messages
socket.on('chat message', (msg) => {
  const messageHistory = document.querySelector('.message-history');
  const messageElement = document.createElement('div');
  messageElement.textContent = msg;
  messageHistory.appendChild(messageElement);
});
