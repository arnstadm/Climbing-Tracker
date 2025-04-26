var express = require('express');
var router = express.Router();
var pool = require('../db');

// Create an route
router.post('/', async (req, res) => {
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
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM spots');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Read single route
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM spots WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).send('route not found');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update route
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { spot_name, spot_location } = req.body;
    const result = await pool.query(
      'UPDATE spots SET spot_name = $1, spot_location = $2 WHERE id = $3 RETURNING *',
      [spot_name, spot_location, id]
    );
    if (result.rows.length === 0) return res.status(404).send('route not found');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete route
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM spots WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).send('route not found');
    res.send('route deleted');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;