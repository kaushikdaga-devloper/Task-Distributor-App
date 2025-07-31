// Load environment variables
require('dotenv').config();

// Imports
const express = require('express');
const mongoose = require('mongoose'); // Import Mongoose
const cors = require('cors');

// --- Database Connection ---
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

// Connect to the Database
connectDB();

// --- Initialization ---
const app = express();

// --- Core Middlewares ---
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Allow app to accept and parse JSON

// --- API Routes ---
const authRoutes = require('./routes/auth');
const agentRoutes = require('./routes/agents');
const taskRoutes = require('./routes/tasks');

app.use('/auth', authRoutes);
app.use('/agents', agentRoutes);
app.use('/tasks', taskRoutes);

// --- Server Setup ---
const PORT = process.env.PORT || 5000;
app.listen(5000, () => console.log(`Server started on port ${PORT}`));