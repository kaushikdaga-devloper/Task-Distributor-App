// routes/auth.js
const express = require('express');
const router = express.Router();
const { loginAdmin, registerAdmin } = require('../controllers/authController'); // Import both controller functions

// POST /api/auth/register - for admin registration
router.post('/register', registerAdmin);

// POST /api/auth/login - for admin login
router.post('/login', loginAdmin);

module.exports = router;