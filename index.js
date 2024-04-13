const WebSocket = require('ws');
const express = require('express');
const http = require('http');

// Set up a simple Express server
const app = express();
const server = http.createServer(app);

// Initialize WebSocket server
const wss = new WebSocket.Server({ server });

// Broadcast to all clients
const broadcast = (data) => {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data.toString());
        }
    });
};

// Handle WebSocket connections
wss.on('connection', (ws) => {
    console.log('A user has connected');
    broadcast('A new user has joined the chat.');

    ws.on('message', (message) => {
        console.log(`Received message: ${message}`);
        broadcast(message);
    });

    ws.on('close', () => {
        console.log('A user has disconnected');
        broadcast('A user has left the chat.');
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});