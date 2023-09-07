const express = require('express');
const router = express.Router();
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const File = require('../models/File');

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname);
    cb(null, `${uuidv4()}${fileExtension}`);
  },
});

const upload = multer({ storage });

// API endpoint to upload a file
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { filename, path: filePath } = req.file;
    const file = new File({
      filename,
      filePath,
    });
    await file.save();
    res.status(201).json({ message: 'File uploaded successfully' });
  } catch (err) {
    console.error('Error uploading file:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Other API routes for listing, retrieving, and deleting files will be added here.

module.exports = router;
// API endpoint to get all files
router.get('/files', async (req, res) => {
    try {
      const files = await File.find();
      res.status(200).json(files);
    } catch (err) {
      console.error('Error fetching files:', err);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  // API endpoint to get one file by ID
  router.get('/files/:id', async (req, res) => {
    try {
      const file = await File.findById(req.params.id);
      if (!file) {
        return res.status(404).json({ error: 'File not found' });
      }
      res.status(200).json(file);
    } catch (err) {
      console.error('Error fetching file:', err);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  // API endpoint to delete a file by ID
  router.delete('/files/:id', async (req, res) => {
    try {
      const file = await File.findByIdAndDelete(req.params.id);
      if (!file) {
        return res.status(404).json({ error: 'File not found' });
      }
      res.status(200).json({ message: 'File deleted successfully' });
    } catch (err) {
      console.error('Error deleting file:', err);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  module.exports = router;
  