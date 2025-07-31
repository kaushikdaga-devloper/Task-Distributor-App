// routes/agents.js
const express = require('express');
const router = express.Router();
const { createAgent, getAllAgents } = require('../controllers/agentController'); // Import controller functions
const authMiddleware = require('../middleware/authMiddleware');

// These routes now correctly point to your controller
router.post('/', authMiddleware, createAgent);
router.get('/', authMiddleware, getAllAgents);

module.exports = router;