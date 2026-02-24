const express = require('express');
const router = express.Router();
const { register, login, googleAuth, updateUserProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleAuth);
router.put('/profile', protect, updateUserProfile);

module.exports = router;

