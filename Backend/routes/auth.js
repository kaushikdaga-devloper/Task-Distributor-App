// routes/auth.js
const express = require('express');
const router = express.Router();
const { loginAdmin } = require('../controllers/authController'); // Import the controller function

// This route now correctly points to your controller
router.post('/login', loginAdmin);

module.exports = router;