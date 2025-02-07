const express = require('express');
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/profile', auth, userController.getProfile);
router.get('/:id/events', userController.getUserEvents);
router.get('/:id/attending', userController.getAttendingEvents);
router.get('/:userId', userController.getUserProfile);

module.exports = router; 