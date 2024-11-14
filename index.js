// index.js (Express + Socket.IO server)

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server);  // Socket.IO instance attached to the server

// Middleware for CORS
app.use(cors());

// In-memory storage for messages (this can be replaced with a database later)
let messages = [
  { id: 1, user: 'Admin', text: 'Welcome to the chat app!' }
];

// API endpoint to get messages
app.get('/api/messages', (req, res) => {
  res.json(messages);
});

// Listen for new messages from clients (WebSocket)
io.on('connection', (socket) => {
  console.log('A user connected');

  // Emit existing messages to new user
  socket.emit('initial_messages', messages);

  // Listen for new messages from clients and broadcast them
  socket.on('send_message', (newMessage) => {
    // Store the new message (In a real app, store it in a DB)
    newMessage.id = messages.length + 1;
    messages.unshift(newMessage);  // Add to the start of the array

    // Emit the new message to all clients
    io.emit('new_message', newMessage);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start the server on the desired port (5000 for local testing or Render.com environment)
const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
