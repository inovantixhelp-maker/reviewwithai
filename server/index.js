const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // In production, replace with client URL
        methods: ["GET", "POST"]
    }
});

// Mock Database (In-Memory)
let tickets = [];
let messages = [];

// Rooms mapping
// admin_room: 'admin_room'
// client_room: 'client_{clientId}'

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    const { userId, role } = socket.handshake.query;

    if (role === 'ADMIN') {
        socket.join('admin_room');
        console.log(`Admin ${userId} joined admin_room`);
    } else if (role === 'CUSTOMER') {
        socket.join(`client_${userId}`);
        console.log(`Customer ${userId} joined client_${userId}`);
    }

    // Handle Send Message
    socket.on('send_message', (data) => {
        // data: { ticketId?, senderId, senderName, text, timestamp, role }
        console.log('Message received:', data);

        // Save to DB
        messages.push(data);

        if (data.role === 'CUSTOMER') {
            // Send to Admin
            io.to('admin_room').emit('receive_message', data);
            // Also send back to sender (optional, if optimistic UI not used)
            // socket.emit('receive_message', data);
        } else if (data.role === 'ADMIN') {
            // Send to Specific Client
            // Need receiverId or derive from ticket/context. 
            // For now, assume client sends clientId as room
            if (data.receiverId) {
                io.to(`client_${data.receiverId}`).emit('receive_message', data);
            }
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// API Routes
app.get('/', (req, res) => {
    res.send('SmartReview Server Running');
});

// Ticket Routes
app.post('/api/tickets', (req, res) => {
    const ticket = req.body;
    tickets.push(ticket);
    // Notify Admins of new ticket
    io.to('admin_room').emit('new_ticket', ticket);
    res.status(201).json(ticket);
});

app.get('/api/tickets', (req, res) => {
    res.json(tickets);
});

// Start Server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
