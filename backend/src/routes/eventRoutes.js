const express = require('express');
const { check } = require('express-validator');
const eventController = require('../controllers/eventController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/', [
  auth,
  upload.single('image'),
  [
    check('title', 'Title is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('category', 'Category is required').not().isEmpty(),
    check('date', 'Date is required').not().isEmpty(),
    check('time', 'Time is required').not().isEmpty(),
    check('location', 'Location is required').not().isEmpty(),
    check('maxAttendees', 'Maximum attendees is required').isNumeric()
  ]
], eventController.createEvent);

router.get('/', eventController.getEvents);
router.get('/:id', eventController.getEvent);

router.put('/:id', [
  auth,
  upload.single('image')
], eventController.updateEvent);

router.delete('/:id', auth, eventController.deleteEvent);
router.post('/:id/attend', auth, eventController.attendEvent);
router.delete('/:id/attend', auth, eventController.leaveEvent);

// Add this route for testing Socket.IO
router.post('/test-socket', auth, (req, res) => {
    const io = req.app.get('io');
    const { eventId } = req.body;
    
    io.to(`event_${eventId}`).emit('eventUpdated', {
        eventId,
        message: 'Test socket event',
        timestamp: new Date()
    });
    
    res.json({ message: 'Test event emitted' });
});

module.exports = router; 