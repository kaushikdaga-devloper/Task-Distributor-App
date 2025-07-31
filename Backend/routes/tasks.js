const express = require('express');
const multer = require('multer');
const {
  uploadTasks,
  getAllTasks,
  deleteTask, 
} = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Allowed MIME types for CSV, XLS, XLSX
const allowedMimeTypes = [
  'text/csv',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

// Multer configuration with file filter
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error('Invalid file type. Only CSV, XLS, and XLSX files are allowed.'),
      false
    );
  }
};
const upload = multer({ storage, fileFilter });

// POST /upload - upload a file (protected)
router.post('/upload', authMiddleware, upload.single('csvfile'), uploadTasks);

// GET / - get all tasks (protected)
router.get('/', authMiddleware, getAllTasks);

// DELETE /:id - delete a specific task (protected)
router.delete('/:id', authMiddleware, deleteTask);

module.exports = router;