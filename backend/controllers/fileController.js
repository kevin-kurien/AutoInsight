const File = require('../models/File');
const fs = require('fs');
const path = require('path');

/**
 * Upload a file
 * @route POST /api/files/upload
 * @access Public
 */
const uploadFile = async (req, res) => {
  try {
    // Check if file exists in request
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No file was uploaded'
      });
    }

    const uploadedFile = req.files.file;
    
    // Validate file type
    const allowedTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/json'];
    
    if (!allowedTypes.includes(uploadedFile.mimetype)) {
      return res.status(400).json({
        success: false,
        message: 'File type not supported. Please upload CSV, Excel, or JSON files.'
      });
    }

    console.log(`File received: ${uploadedFile.name} (${uploadedFile.mimetype}), size: ${uploadedFile.size} bytes`);

    // Read file contents into buffer
    const fileBuffer = fs.readFileSync(uploadedFile.tempFilePath);
    
    // Create a new file document in MongoDB
    const newFile = new File({
      filename: Date.now() + '' + uploadedFile.name.replace(/\s+/g, ''),
      originalName: uploadedFile.name,
      contentType: uploadedFile.mimetype,
      fileSize: uploadedFile.size,
      uploadDate: new Date(),
      fileData: fileBuffer,
      path: uploadedFile.tempFilePath
    });

    // Extract basic metadata for CSV files
    if (uploadedFile.mimetype === 'text/csv') {
      // Read first line to get headers
      const fileContent = fileBuffer.toString('utf8');
      const lines = fileContent.split('\n');
      
      if (lines.length > 0) {
        const headers = lines[0].split(',').map(header => header.trim());
        newFile.metadata = {
          rows: lines.length - 1, // Subtract header row
          columns: headers.length,
          headers: headers
        };
      }
    }

    await newFile.save();
    
    // Clean up temp file
    fs.unlinkSync(uploadedFile.tempFilePath);

    // Return success response
    res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      file: {
        id: newFile._id,
        filename: newFile.originalName,
        size: newFile.fileSize,
        uploadDate: newFile.uploadDate
      }
    });
    
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during upload',
      error: error.message
    });
  }
};

/**
 * Get all files
 * @route GET /api/files
 * @access Public
 */
const getFiles = async (req, res) => {
  try {
    // Find all files but exclude the large fileData field
    const files = await File.find().select('-fileData');
    
    res.status(200).json({
      success: true,
      count: files.length,
      data: files
    });
  } catch (error) {
    console.error('Get files error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving files',
      error: error.message
    });
  }
};

/**
 * Get a single file by ID
 * @route GET /api/files/:id
 * @access Public
 */
const getFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id).select('-fileData');
    
    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: file
    });
  } catch (error) {
    console.error('Get file error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving file',
      error: error.message
    });
  }
};

/**
 * Download a file
 * @route GET /api/files/:id/download
 * @access Public
 */
const downloadFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    
    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }
    
    // Set appropriate headers
    res.setHeader('Content-Type', file.contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${file.originalName}"`);

    // Send the file data
    res.status(200).send(file.fileData);
    
  } catch (error) {
    console.error('Download file error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error downloading file',
      error: error.message
    });
  }
};

/**
 * Delete a file
 * @route DELETE /api/files/:id
 * @access Public
 */
const deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    
    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }
    
    await File.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting file',
      error: error.message
    });
  }
};

/**
 * Process a file
 * @route POST /api/files/:id/process
 * @access Public
 */
const processFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    
    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }
    
    // Update status to processing
    file.status = 'processing';
    await file.save();
    
    // In a real application, you would trigger an async process here
    // For demonstration, we'll just update the status after a delay
    setTimeout(async () => {
      try {
        file.status = 'processed';
        await file.save();
        console.log(`File ${file._id} processed successfully`);
      } catch (error) {
        console.error(`Error updating file status: ${error.message}`);
      }
    }, 5000);
    
    res.status(200).json({
      success: true,
      message: 'File processing started',
      fileId: file._id
    });
  } catch (error) {
    console.error('Process file error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error processing file',
      error: error.message
    });
  }
};

module.exports = {
  uploadFile,
  getFiles,
  getFile,
  downloadFile,
  deleteFile,
  processFile
};