import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

import app from './app.js';
import pool from './config/db.js';
import chatSocket from './sockets/chatSocket.js';

dotenv.config();

// ======================================
// PORT
// ======================================
const PORT = process.env.PORT || 5000;

// ======================================
// CREATE HTTP SERVER
// ======================================
const server = http.createServer(app);

// ======================================
// SOCKET.IO SETUP
// ======================================
const io = new Server(server, {
    cors: {
        origin: [
            'http://localhost:5173',
            'http://localhost:5174'
        ],
        methods: ['GET', 'POST'],
        credentials: true
    }
});

// ======================================
// SOCKET LOGIC
// ======================================
chatSocket(io);

io.on('connection', (socket) => {

    console.log(
        'User connected:',
        socket.id
    );

    socket.on(
        'disconnect',
        () => console.log(
            'User disconnected'
        )
    );
});

// ======================================
// START SERVER
// ======================================
server.listen(PORT, () => {

    console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
    );
});

// ======================================
// HANDLE UNHANDLED PROMISE REJECTIONS
// ======================================
process.on(
    'unhandledRejection',
    (err) => {

        console.log(
            `Error: ${err.message}`
        );

        server.close(
            () => process.exit(1)
        );
    }
);