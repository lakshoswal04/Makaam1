require("dotenv").config();
const mongoose = require("mongoose");
const { User } = require("./models/user");
const bcrypt = require("bcrypt");
const connection = require("./db");

// Admin user details
const adminUser = {
  firstName: process.argv[2] || "Admin",
  lastName: process.argv[3] || "User",
  email: process.argv[4] || "admin@example.com",
  password: process.argv[5] || "Admin123!",
  isAdmin: true,
  onboardingCompleted: true
};

if (!adminUser.email.includes('@')) {
  console.error("Please provide a valid email address");
  console.error("Usage: node createAdmin.js [firstName] [lastName] [email] [password]");
  process.exit(1);
}

// Connect to MongoDB
connection()
  .then(() => {
    console.log("Connected to MongoDB successfully");
    createAdminUser();
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  });

// Create an admin user
async function createAdminUser() {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email: adminUser.email });
    
    if (existingUser) {
      console.log(`User with email ${adminUser.email} already exists`);
      
      // Update existing user to be an admin if not already
      if (!existingUser.isAdmin) {
        existingUser.isAdmin = true;
        await existingUser.save();
        console.log(`Updated user ${adminUser.email} to have admin privileges`);
      } else {
        console.log(`User ${adminUser.email} is already an admin`);
      }
      
      mongoose.connection.close();
      return;
    }
    
    // Hash the password
    const salt = await bcrypt.genSalt(Number(process.env.SALT || 10));
    const hashPassword = await bcrypt.hash(adminUser.password, salt);
    
    // Create the admin user
    const user = new User({
      firstName: adminUser.firstName,
      lastName: adminUser.lastName,
      email: adminUser.email,
      password: hashPassword,
      isAdmin: true,
      onboardingCompleted: true
    });
    
    await user.save();
    
    console.log(`Admin user created successfully: ${adminUser.email}`);
    
    // Close the connection
    mongoose.connection.close();
    console.log("Database connection closed");
  } catch (error) {
    console.error("Error creating admin user:", error);
    mongoose.connection.close();
    process.exit(1);
  }
}
