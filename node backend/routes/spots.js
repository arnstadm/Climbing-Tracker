var express = require('express');
var router = express.Router();
var pool = require('../db');
var authenticateToken = require('../middleware/auth');

// Create a spot
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { spot_name, spot_location } = req.body;
    const result = await pool.query(
      'INSERT INTO spots (spot_name, spot_location) VALUES ($1, $2) RETURNING *',
      [spot_name, spot_location]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Read all spots
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM spots');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Read single spot
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM spots WHERE spot_id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).send('spot not found');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update spot
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { spot_name, spot_location } = req.body;
    const result = await pool.query(
      'UPDATE spots SET spot_name = $1, spot_location = $2 WHERE spot_id = $3 RETURNING *',
      [spot_name, spot_location, id]
    );
    if (result.rows.length === 0) return res.status(404).send('spot not found');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete spot
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM spots WHERE spot_id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).send('spot not found');
    res.send('spot deleted');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;