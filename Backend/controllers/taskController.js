const xlsx = require('xlsx');
const Task = require('../models/fileSchema');
const Agent = require('../models/agentSchema');
const UploadedFile = require('../models/uploadedFileSchema');

// For uploading tasks from a file
exports.uploadTasks = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  try {
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const tasksData = xlsx.utils.sheet_to_json(sheet);

    const normalizedTasksData = tasksData.map(row => {
      const normalizedRow = {};
      for (const key in row) {
        const normalizedKey = key.toLowerCase().replace(/\s+/g, '');
        normalizedRow[normalizedKey] = row[key];
      }
      return normalizedRow;
    });

    if (normalizedTasksData.length > 0 && (!normalizedTasksData[0].firstname || !normalizedTasksData[0].phone)) {
      return res.status(400).json({ 
        error: 'Invalid file format. Please make sure your file has columns for a first name and a phone number.' 
      });
    }
    
    const agents = await Agent.find();
    if (agents.length === 0) {
      return res.status(400).json({ error: 'No agents available to assign tasks.' });
    }

    const tasksToSave = normalizedTasksData.map((task, index) => {
      const assignedAgent = agents[index % agents.length];
      return {
        firstName: task.firstname,
        phone: task.phone,
        notes: task.notes,
        assignedTo: assignedAgent._id,
      };
    });
    
    if (tasksToSave.length > 0) {
        await Task.insertMany(tasksTosave);
        const newFile = new UploadedFile({
            filename: req.file.originalname,
            taskCount: tasksToSave.length
        });
        await newFile.save();
    }
    
    res.status(201).json({ message: `${tasksToSave.length} tasks uploaded and distributed successfully!` });
  } catch (err) {
    console.error('Error uploading tasks:', err);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
};

// For getting all tasks (This is the function being used)
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate('assignedTo', 'name email');
    res.json(tasks);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
};

// For deleting a single task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await task.deleteOne();

    res.json({ message: 'Task removed successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// For creating a single task
exports.createTask = async (req, res) => {
  const { firstName, phone, notes, assignedTo } = req.body;

  if (!firstName || !phone || !notes || !assignedTo) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const newTask = new Task({
      firstName,
      phone,
      notes,
      assignedTo,
    });

    await newTask.save();
    res.status(201).json({ message: 'Task created successfully', task: newTask });
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(500).json({ error: 'Server error while creating task.' });
  }
};

// For getting all uploaded file records
exports.getAllUploadedFiles = async (req, res) => {
  try {
    const files = await UploadedFile.find().sort({ uploadDate: -1 });
    res.json(files);
  } catch (err) {
    console.error('Error fetching uploaded files:', err);
    res.status(500).json({ error: 'Server error.' });
  }
};