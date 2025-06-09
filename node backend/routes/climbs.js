var express = require('express');
var router = express.Router();
var pool = require('../db');
var authenticateToken = require('../middleware/auth');

// Create a climb
router.post('/', authenticateToken, async (req, res) => {
  try {
    const climber_id = req.user.id;
    const { spot_id, wall_id, route_id } = req.body;
    const result = await pool.query(
      'INSERT INTO climbs (climber_id, spot_id, wall_id, route_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [climber_id, spot_id, wall_id, route_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Read single climbs
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const climber_id = req.user.id;
    const result = await pool.query('SELECT * FROM climbs WHERE climb_id = $1 AND climber_id = $2', [id, climber_id]);
    if (result.rows.length === 0) return res.status(404).send('climb not found');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

//Get single climbers climbs
router.get('/climber/me', authenticateToken, async (req, res) => {
  try {
    const climber_id = req.user.id;
    const result = await pool.query(
      'SELECT * FROM climbs WHERE climber_id = $1', [climber_id]);
    if (result.rows.length === 0) return res.status(404).send('No climbs found');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update climb
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const climber_id = req.user.id;
    const { spot_id, wall_id, route_id } = req.body;
    const result = await pool.query(
      'UPDATE climbs SET climber_id = $1, spot_id = $2, wall_id = $3, route_id = $4 WHERE climb_id = $5 AND climber_id = $1 RETURNING *',
      [climber_id, spot_id, wall_id, route_id, id]
    );
    if (result.rows.length === 0) return res.status(404).send('climb not found');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete climb
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const climber_id = req.user.id;
    const result = await pool.query('DELETE FROM climbs WHERE climb_id = $1 AND climber_id = $2 RETURNING *', [id, climber_id]);
    if (result.rows.length === 0) return res.status(404).send('climb not found');
    res.send('climb deleted');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;