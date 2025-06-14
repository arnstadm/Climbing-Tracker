const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
var pool = require('../db');
var authenticateToken = require('../middleware/auth');

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post('/upload', authenticateToken, upload.single('photo'), async (req, res) => {
  console.log('File received:', req.file); // Debug log
  console.log('Body received:', req.body); // Debug log
  
  // Check if file was uploaded
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Get wall_id from form data
  const wall_id = req.body.wall_id;
  if (!wall_id) {
    return res.status(400).json({ error: 'Wall ID is missing' });
  }

  try {
    const imageUrl = `/uploads/${req.file.filename}`;
    const result = await pool.query(
      'INSERT INTO images (image_url, wall_id) VALUES ($1, $2) RETURNING *',
      [imageUrl, wall_id]
    );
    
    console.log('Database result:', result.rows[0]); // Debug log
    res.status(201).json({
      success: true,
      message: 'Photo uploaded successfully'
    });
  } catch (err) {
    console.error('Database error:', err.message);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

module.exports = router;