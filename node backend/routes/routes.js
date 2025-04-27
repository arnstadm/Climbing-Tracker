var express = require('express');
var router = express.Router();
var pool = require('../db');

// Create a route
router.post('/', async (req, res) => {
  try {
    const { route_name, route_grade, spot_id, wall_id } = req.body;
    const result = await pool.query(
      'INSERT INTO routes (route_name, route_grade, spot_id, wall_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [route_name, route_grade, spot_id, wall_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Read all routes
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM routes');
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
    const result = await pool.query('SELECT * FROM routes WHERE route_id = $1', [id]);
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
    const { route_name, route_grade, spot_id, wall_id } = req.body;
    const result = await pool.query(
      'UPDATE routes SET route_name = $1, route_grade = $2, spot_id = $3, wall_id = $4 WHERE spot_id = $5 RETURNING *',
      [route_name, route_grade, spot_id, wall_id, id]
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
    const result = await pool.query('DELETE FROM routes WHERE route_id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).send('route not found');
    res.send('route deleted');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;