const mongoose = require('mongoose');
const Event = require('../models/Event');
const User = require('../models/User');
require('dotenv').config();

const fixCreatedEvents = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const events = await Event.find({});
    
    for (const event of events) {
      await User.findByIdAndUpdate(
        event.creator,
        { $addToSet: { createdEvents: event._id } }
      );
    }
    
    console.log('Successfully updated createdEvents for all users');
    process.exit(0);
  } catch (err) {
    console.error('Error fixing created events:', err);
    process.exit(1);
  }
};

fixCreatedEvents(); 