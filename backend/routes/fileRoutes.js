const express = require('express');
const router = express.Router();
const {
  uploadFile,
  getFiles,
  getFile,
  downloadFile,
  deleteFile,
  processFile
} = require('../controllers/fileController');

// Upload a file
router.post('/upload', uploadFile);

// Get all files
router.get('/', getFiles);

// Get a single file
router.get('/:id', getFile);

// Download a file
router.get('/:id/download', downloadFile);

// Delete a file
router.delete('/:id', deleteFile);

// Process a file
router.post('/:id/process', processFile);

module.exports = router;