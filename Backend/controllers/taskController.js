const xlsx = require('xlsx');
const fs = require('fs');
const Task = require('../models/fileSchema');
const Agent = require('../models/agentSchema');

// 1. uploadTasks Function
exports.uploadTasks = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  try {
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const tasksData = xlsx.utils.sheet_to_json(sheet);

    // --- Normalization Step ---
    // This creates a new array where all header keys are standardized
    const normalizedTasksData = tasksData.map(row => {
      const normalizedRow = {};
      for (const key in row) {
        // Convert key to lowercase and remove all spaces/non-alphanumeric characters
        const normalizedKey = key.toLowerCase().replace(/\s+/g, '');
        normalizedRow[normalizedKey] = row[key];
      }
      return normalizedRow;
    });

    // --- Validation Step (using normalized keys) ---
    if (normalizedTasksData.length > 0 && (!normalizedTasksData[0].firstname || !normalizedTasksData[0].phone)) {
      return res.status(400).json({ 
        error: 'Invalid file format. Please make sure your file has columns for a first name and a phone number.' 
      });
    }
    
    const agents = await Agent.find();
    if (agents.length === 0) {
      return res.status(400).json({ error: 'No agents available to assign tasks.' });
    }

    //Distribution Step (using normalized keys)
    const tasksToSave = normalizedTasksData.map((task, index) => {
      const assignedAgent = agents[index % agents.length];
      return {
        // Now we use the predictable, normalized keys
        firstName: task.firstname,
        phone: task.phone,
        notes: task.notes,
        assignedTo: assignedAgent._id,
      };
    });
    
    await Task.insertMany(tasksToSave);
    
    res.status(201).json({ message: `${tasksToSave.length} tasks uploaded and distributed successfully!` });
  } catch (err) {
    console.error('Error uploading tasks:', err);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
};

// 2. getAllTasks Function
exports.getAllTasks = async (req, res) => {
  try {
    // Populate agent details using the correct field name 'assignedTo'
    const tasks = await Task.find().populate('assignedTo', 'name email'); // Select which agent fields to include
    res.json(tasks);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
};
//for deleting 

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await task.deleteOne(); // Or Task.findByIdAndDelete(req.params.id)

    res.json({ message: 'Task removed successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};