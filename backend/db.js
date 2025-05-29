const mongoose = require("mongoose");
const { MONGO_URI } = require("./config/keys");

// Use hardcoded connection string from config

const connectDB = async () => {
    try {
        console.log("Attempting to connect to MongoDB at:", MONGO_URI);
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error.message);
        console.log("Make sure MongoDB is running on your system");
        // Don't exit the process, just log the error
        // process.exit(1);
    }
};

module.exports = connectDB;



