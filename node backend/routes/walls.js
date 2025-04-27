var express = require('express');
var router = express.Router();
var pool = require('../db');

// Create a wall
router.post('/', async (req, res) => {
  try {
    const { wall_name, spot_id } = req.body;
    const result = await pool.query(
      'INSERT INTO walls (wall_name, spot_id) VALUES ($1, $2) RETURNING *',
      [wall_name, spot_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Read all walls
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM walls');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Read single wall
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM walls WHERE wall_id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).send('wall not found');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update wall
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { wall_name, spot_id } = req.body;
    const result = await pool.query(
      'UPDATE walls SET wall_name = $1, spot_id = $2 WHERE wall_id = $3 RETURNING *',
      [wall_name, spot_id, id]
    );
    if (result.rows.length === 0) return res.status(404).send('wall not found');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete wall
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM walls WHERE wall_id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).send('wall not found');
    res.send('walls deleted');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;