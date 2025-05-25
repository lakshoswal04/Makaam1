require("dotenv").config();
const mongoose = require("mongoose");
const { User } = require("./models/user");
const connection = require("./db");

// Connect to MongoDB
connection()
  .then(() => {
    console.log("Connected to MongoDB successfully");
    checkUsers();
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  });

// Check users in the database
async function checkUsers() {
  try {
    // Get all users
    const users = await User.find({});
    
    console.log(`Total users in database: ${users.length}`);
    
    if (users.length === 0) {
      console.log("No users found in the database.");
    } else {
      console.log("\nUser details:");
      users.forEach((user, index) => {
        console.log(`\nUser ${index + 1}:`);
        console.log(`  Email: ${user.email}`);
        console.log(`  Name: ${user.firstName} ${user.lastName}`);
        console.log(`  Admin: ${user.isAdmin ? "Yes" : "No"}`);
        console.log(`  Onboarding Completed: ${user.onboardingCompleted ? "Yes" : "No"}`);
        console.log(`  ID: ${user._id}`);
      });
    }
    
    // Check for admin users specifically
    const adminUsers = await User.find({ isAdmin: true });
    
    console.log(`\nTotal admin users: ${adminUsers.length}`);
    
    if (adminUsers.length === 0) {
      console.log("No admin users found in the database.");
    } else {
      console.log("\nAdmin user details:");
      adminUsers.forEach((user, index) => {
        console.log(`\nAdmin ${index + 1}:`);
        console.log(`  Email: ${user.email}`);
        console.log(`  Name: ${user.firstName} ${user.lastName}`);
        console.log(`  ID: ${user._id}`);
      });
    }
    
    // Close the connection
    mongoose.connection.close();
    console.log("\nDatabase connection closed");
  } catch (error) {
    console.error("Error checking users:", error);
    mongoose.connection.close();
    process.exit(1);
  }
}
