const Event = require('../models/Event');
const User = require('../models/User');
const cloudinary = require('../config/cloudinary');
const { validationResult } = require('express-validator');
const fs = require('fs');
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);

exports.createEvent = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let imageUrl = '';
    
    // Check if file exists in request
    if (req.file) {
      try {
        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'events', // Optional: organize uploads in folders
          resource_type: 'auto'
        });
        imageUrl = result.secure_url;
        
        // Delete the local file after upload
        await unlinkAsync(req.file.path);
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        return res.status(500).json({ message: 'Error uploading image' });
      }
    }

    const { 
      title, 
      description, 
      category, 
      date, 
      time, 
      location, 
      maxAttendees, 
      isPrivate 
    } = req.body;

    const event = new Event({
      title,
      description,
      category,
      date,
      time,
      location,
      maxAttendees: parseInt(maxAttendees),
      isPrivate: req.body.isPrivate === 'true',
      imageUrl,
      creator: req.user.id
    });

    await event.save();

    // Update user's createdEvents array
    await User.findByIdAndUpdate(
      req.user.id,
      { $push: { createdEvents: event._id } }
    );

    res.status(201).json(event);
  } catch (err) {
    console.error('Event creation error:', err);
    res.status(500).json({ message: 'Error creating event' });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const { search, category, date, status } = req.query;
    let query = {};

    // Search filter
    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ];
    }

    // Category filter
    if (category) {
      if (category === 'Other') {
        // List of main categories
        const mainCategories = [
          'Sports', 'Music', 'Technology', 'Art', 'Food',
          'Business', 'Education', 'Entertainment', 'Health', 'Social'
        ];
        // Find events NOT in main categories
        query.category = { $nin: mainCategories };
      } else {
        query.category = new RegExp(category, 'i');
      }
    }

    // Date filter
    if (date) {
      const selectedDate = new Date(date);
      const nextDay = new Date(selectedDate);
      nextDay.setDate(nextDay.getDate() + 1);
      
      query.date = {
        $gte: selectedDate,
        $lt: nextDay
      };
    }

    // Status filter
    if (status) {
      const now = new Date();
      switch (status) {
        case 'upcoming':
          query.date = { $gt: now };
          break;
        case 'ongoing':
          query.date = { $eq: now };
          break;
        case 'past':
          query.date = { $lt: now };
          break;
      }
    }

    const events = await Event.find(query)
      .populate('creator', 'username')
      .populate('attendees', 'username')
      .sort({ date: 1 });

    res.json(events);
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).json({ message: 'Error fetching events' });
  }
};

exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('creator', 'username _id')
      .populate('attendees', 'username _id');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching event' });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.creator.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Only update fields that were sent in the request
    const updates = {};
    Object.keys(req.body).forEach(key => {
      // Only include fields that have a value
      if (req.body[key] !== undefined && req.body[key] !== '') {
        updates[key] = req.body[key];
      }
    });

    // Handle image upload if there's a new image
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      updates.imageUrl = result.secure_url;
      // Clean up the uploaded file
      await unlinkAsync(req.file.path);
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true }
    ).populate('creator', 'username _id');

    res.json(updatedEvent);
  } catch (err) {
    console.error('Update event error:', err);
    res.status(500).json({ message: 'Error updating event' });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.creator.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await event.deleteOne();

    // Remove event from user's createdEvents array
    await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { createdEvents: event._id } }
    );

    res.json({ message: 'Event removed' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting event' });
  }
};

exports.attendEvent = async (req, res) => {
  try {
    console.log('User attempting to attend event:', req.params.id);
    const event = await Event.findById(req.params.id)
      .populate('attendees', 'username _id')
      .populate('creator', 'username _id');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user is already attending
    const isAttending = event.attendees.some(
      attendee => attendee._id.toString() === req.user.id
    );

    if (isAttending) {
      return res.status(400).json({ message: 'Already attending' });
    }

    if (event.attendees.length >= event.maxAttendees) {
      return res.status(400).json({ message: 'Event is full' });
    }

    event.attendees.push(req.user.id);
    await event.save();

    // Fetch the updated event with populated fields
    const updatedEvent = await Event.findById(event._id)
      .populate('creator', 'username _id')
      .populate('attendees', 'username _id');

    // Emit socket event for real-time update
    const io = req.app.get('io');
    const roomId = `event_${event._id}`;
    console.log('Emitting eventUpdated to room:', roomId);
    console.log('Event data being sent:', {
      type: 'ATTENDEE_JOINED',
      event: updatedEvent
    });
    io.to(roomId).emit('eventUpdated', {
      type: 'ATTENDEE_JOINED',
      event: updatedEvent
    });
    console.log('Event emitted successfully');

    res.json(updatedEvent);
  } catch (err) {
    console.error('Error attending event:', err);
    res.status(500).json({ message: 'Error attending event' });
  }
};

exports.leaveEvent = async (req, res) => {
  try {
    console.log('User attempting to leave event:', req.params.id);
    const event = await Event.findById(req.params.id)
      .populate('attendees', 'username _id')
      .populate('creator', 'username _id');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    event.attendees = event.attendees.filter(
      attendee => attendee._id.toString() !== req.user.id
    );
    await event.save();

    // Fetch the updated event with populated fields
    const updatedEvent = await Event.findById(event._id)
      .populate('creator', 'username _id')
      .populate('attendees', 'username _id');

    // Emit socket event for real-time update
    const io = req.app.get('io');
    const roomId = `event_${event._id}`;
    console.log('Emitting eventUpdated to room:', roomId);
    console.log('Event data being sent:', {
      type: 'ATTENDEE_LEFT',
      event: updatedEvent
    });
    io.to(roomId).emit('eventUpdated', {
      type: 'ATTENDEE_LEFT',
      event: updatedEvent
    });
    console.log('Event emitted successfully');

    res.json(updatedEvent);
  } catch (err) {
    console.error('Error leaving event:', err);
    res.status(500).json({ message: 'Error leaving event' });
  }
}; 