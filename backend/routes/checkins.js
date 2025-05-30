const router = require('express').Router();
const Checkin = require('../models/checkin');
const auth = require('../middleware/auth');

// Create a new weekly check-in
router.post('/', auth, async (req, res) => {
  try {
    const { reflections, progress, completedRoadmapItems } = req.body;
    const checkin = new Checkin({
      userId: req.user._id,
      reflections,
      progress,
      completedRoadmapItems,
    });
    await checkin.save();
    res.status(201).json({ success: true, checkin });
  } catch (error) {
    console.error('Error creating check-in:', error);
    res.status(500).json({ success: false, message: 'Failed to create check-in.' });
  }
});

// Get all check-ins for the current user
router.get('/', auth, async (req, res) => {
  try {
    const checkins = await Checkin.find({ userId: req.user._id }).sort({ date: -1 });
    res.status(200).json({ success: true, checkins });
  } catch (error) {
    console.error('Error fetching check-ins:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch check-ins.' });
  }
});

module.exports = router; 