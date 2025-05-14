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
    origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'x-auth-token']
}));

// routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

// Use port 3001 to match the frontend
const port = 3001;
app.listen(port, () => {
    console.log(`Server is running on port ${port}...`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${port} is already in use. Please try a different port.`);
    } else {
        console.error('Server error:', err);
    }
    process.exit(1);
});
