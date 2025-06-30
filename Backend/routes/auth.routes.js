// routes/auth.routes.js
const express = require('express');
const router = express.Router();
const { register, login, sendOtp, resetPassword} = require('../controllers/auth.controller');

// Register
router.post('/register', register);


router.post('/send-otp', sendOtp);
router.post('/reset-password', resetPassword);
// Login
router.post('/login', login);

module.exports = router;
