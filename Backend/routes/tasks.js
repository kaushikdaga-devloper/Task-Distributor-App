const express = require('express');
const multer = require('multer');
const {
  uploadTasks,
  getAllTasks,
  deleteTask, 
  createTask,
  getAllUploadedFiles,
} = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Multer configuration for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST /api/tasks/upload - upload a file (protected)
router.post('/upload', authMiddleware, upload.single('csvfile'), uploadTasks);

// POST /api/tasks/create - create a single task (protected)
router.post('/create', authMiddleware, createTask);

// GET /api/tasks - get all tasks (protected)
router.get('/', authMiddleware, getAllTasks);

// GET /api/tasks/files - get all uploaded file records (protected)
router.get('/files', authMiddleware, getAllUploadedFiles);

// DELETE /api/tasks/:id - delete a specific task (protected)
router.delete('/:id', authMiddleware, deleteTask);

module.exports = router;