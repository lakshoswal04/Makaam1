// Load environment variables or use config file
const { JWTPRIVATEKEY, PORT: CONFIG_PORT } = require("./config/keys");
// Use environment variable PORT if available, otherwise use config PORT
const PORT = process.env.PORT || CONFIG_PORT || 5000;
console.log("JWTPRIVATEKEY:", JWTPRIVATEKEY); // Debug print
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const resourceRoutes = require("./routes/resources");
const roadmapRoutes = require("./routes/roadmap");

// database connection
connection();

// middlewares
app.use(express.json());
app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://localhost:3001',
        process.env.FRONTEND_URL, // For production deployment
        'http://localhost:3002',
        'http://localhost:3003'
    ], // Multiple frontend ports
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'x-auth-token']
}));

// Root route for health check
app.use('/',(req,res)=>{
    res.send("Makaam API is running")
})

// routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/roadmap", roadmapRoutes);

// Use the hardcoded port from config
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Please free up this port.`);
        process.exit(1);
    } else {
        console.error('Server error:', err);
        process.exit(1);
    }
});
