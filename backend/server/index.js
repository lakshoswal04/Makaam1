require("dotenv").config();
console.log("JWTPRIVATEKEY:", process.env.JWTPRIVATEKEY); // Debug print
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");

// database connection
connection();

// middlewares
app.use(express.json());
app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:3002',
        'http://localhost:3003'
    ], // Multiple frontend ports
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'x-auth-token']
}));

// routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

// Try multiple ports for the backend server
const ports = [5000, 5001, 5002, 5003];

// Function to try starting the server on different ports
function startServer(portIndex = 0) {
    if (portIndex >= ports.length) {
        console.error('All ports are in use. Please free up one of these ports:', ports);
        process.exit(1);
        return;
    }
    
    const port = ports[portIndex];
    
    const server = app.listen(port, () => {
        console.log(`Server is running on port ${port}...`);
    }).on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`Port ${port} is already in use, trying next port...`);
            server.close();
            startServer(portIndex + 1);
        } else {
            console.error('Server error:', err);
            process.exit(1);
        }
    });
}

// Start the server
startServer();
