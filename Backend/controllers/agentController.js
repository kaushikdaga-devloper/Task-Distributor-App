const bcrypt = require('bcryptjs');
const Agent = require('../models/agentSchema');

// @desc    Create a new agent
// @route   POST /api/agents
exports.createAgent = async (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !phone || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    // Check if agent exists
    let agent = await Agent.findOne({ email });
    if (agent) {
      return res.status(409).json({ error: 'Agent with this email already exists.' });
    }

    // Create new agent instance
    agent = new Agent({ name, email, phone, password });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    agent.password = await bcrypt.hash(password, salt);

    await agent.save();

    // Remove password from the returned object
    const agentToReturn = agent.toObject();
    delete agentToReturn.password;

    res.status(201).json({ message: 'Agent created successfully!', agent: agentToReturn });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get all agents
// @route   GET /api/agents
exports.getAllAgents = async (req, res) => {
  try {
    const agents = await Agent.find().select('-password');
    res.json(agents);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get a single agent by ID
// @route   GET /api/agents/:id
exports.getAgentById = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id).select('-password');
    if (!agent) {
      return res.status(404).json({ msg: 'Agent not found' });
    }
    res.json(agent);
  } catch (err) {
    console.error(err.message);
    // If the ID format is invalid, also return a 404
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Agent not found' });
    }
    res.status(500).send('Server Error');
  }
};