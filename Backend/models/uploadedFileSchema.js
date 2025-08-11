const mongoose = require('mongoose');

const uploadedFileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now },
  taskCount: { type: Number, required: true },
});

const UploadedFile = mongoose.model('UploadedFile', uploadedFileSchema);
module.exports = UploadedFile;