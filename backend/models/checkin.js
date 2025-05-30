const mongoose = require('mongoose');

const checkinSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  date: { type: Date, default: Date.now },
  reflections: { type: String, default: '' },
  progress: { type: Number, default: 0 }, // percentage
  completedRoadmapItems: [{ type: String }], // e.g., ['learn.topic1', 'practice.project2']
});

const Checkin = mongoose.model('checkin', checkinSchema);

module.exports = Checkin; 