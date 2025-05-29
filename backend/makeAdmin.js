require("dotenv").config();
const mongoose = require("mongoose");
const { User } = require("./models/user");
const connection = require("./db");

// Email of the user to make admin
const userEmail = process.argv[2];

if (!userEmail) {
  console.error("Please provide a user email as an argument");
  console.error("Usage: node makeAdmin.js user@example.com");
  process.exit(1);
}

// Connect to MongoDB
connection()
  .then(() => {
    console.log("Connected to MongoDB successfully");
    makeUserAdmin(userEmail);
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  });

// Make a user an admin
async function makeUserAdmin(email) {
  try {
    // Find the user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      console.error(`User with email ${email} not found`);
      mongoose.connection.close();
      process.exit(1);
    }
    
    // Update the user to be an admin
    user.isAdmin = true;
    await user.save();
    
    console.log(`User ${email} is now an admin`);
    
    // Close the connection
    mongoose.connection.close();
    console.log("Database connection closed");
  } catch (error) {
    console.error("Error making user admin:", error);
    mongoose.connection.close();
    process.exit(1);
  }
}
