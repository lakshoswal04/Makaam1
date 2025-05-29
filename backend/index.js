// Load environment variables or use config file
const { JWTPRIVATEKEY, PORT: CONFIG_PORT, MONGO_URI, FALLBACK_PORTS } = require("./config/keys");
// Use environment variable PORT if available, otherwise use config PORT
const PORT = process.env.PORT || CONFIG_PORT || 5000;
console.log("JWTPRIVATEKEY:", JWTPRIVATEKEY); // Debug print
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const connection = require("./db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const resourceRoutes = require("./routes/resources");
const roadmapRoutes = require("./routes/roadmap");

// database connection
connection();

// middlewares
const app = express();
app.use(express.json());
app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:3002',
        'http://localhost:3003',
        'http://localhost:5173', // Vite dev server
        'https://makaam11.netlify.app', // Production frontend
        process.env.FRONTEND_URL // For additional frontend URLs
    ].filter(Boolean), // Remove any undefined values
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'x-auth-token', 'Authorization']
}));

// API routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/roadmap", roadmapRoutes);

// Health check route - must be after API routes
app.get('/health', (req, res) => {
    res.send("Makaam API is running");
});

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Function to try starting the server on a specific port
const startServer = (port) => {
  return new Promise((resolve, reject) => {
    const server = app.listen(port)
      .on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          console.log(`Port ${port} is in use, trying next port...`);
          reject(err);
        } else {
          reject(err);
        }
      })
      .on('listening', () => {
        console.log(`Server is running on port ${port}`);
        resolve(server);
      });
  });
};

// Try to start the server with fallback ports
const startServerWithFallback = async () => {
  const ports = [PORT, ...FALLBACK_PORTS];
  
  for (const port of ports) {
    try {
      await startServer(port);
      return; // Server started successfully
    } catch (err) {
      if (err.code === 'EADDRINUSE') {
        continue; // Try next port
      }
      console.error('Server error:', err);
      process.exit(1);
    }
  }
  
  console.error('All ports are in use. Please free up a port and try again.');
  process.exit(1);
};

startServerWithFallback();
