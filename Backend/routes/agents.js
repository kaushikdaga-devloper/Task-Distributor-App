// routes/agents.js
const express = require('express');
const router = express.Router();
const { createAgent, getAllAgents, getAgentById } = require('../controllers/agentController'); // Import all three functions
const authMiddleware = require('../middleware/authMiddleware');

// These routes now correctly point to your controller
router.post('/', authMiddleware, createAgent);
router.get('/', authMiddleware, getAllAgents);

// New route for getting a single agent by their ID
router.get('/:id', authMiddleware, getAgentById);

module.exports = router;