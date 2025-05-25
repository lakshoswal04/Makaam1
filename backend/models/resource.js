const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
    trim: true,
  },
  imageUrl: {
    type: String,
    default: "",
  },
  domain: {
    type: String,
    required: true,
    enum: ["Data Science", "Design", "Web Development", "Mobile Development", "DevOps", "Machine Learning", "Blockchain", "Cybersecurity", "Other"],
  },
  type: {
    type: String,
    required: true,
    enum: ["Course", "Blog", "GitHub Repository", "Video", "Book", "Tool", "Other"],
  },
  isPremium: {
    type: Boolean,
    default: false,
  },
  tags: [{
    type: String,
    trim: true,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Resource = mongoose.model("resource", resourceSchema);

module.exports = { Resource };
