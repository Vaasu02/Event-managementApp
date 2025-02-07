const User = require('../models/User');
const Event = require('../models/Event');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
};

exports.getUserEvents = async (req, res) => {
  try {
    const events = await Event.find({ creator: req.params.id })
      .populate('creator', 'username')
      .sort({ date: -1 });

    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user events' });
  }
};

exports.getAttendingEvents = async (req, res) => {
  try {
    const events = await Event.find({
      attendees: req.params.id
    })
      .populate('creator', 'username')
      .sort({ date: -1 });

    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching attending events' });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('username createdEvents');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user profile' });
  }
}; 