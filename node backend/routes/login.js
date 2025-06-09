var express = require('express');
var router = express.Router();
var pool = require('../db');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');

const JWT_SECRET = process.env.JWT_SECRET;

//process login and return a token for localStorage in webapp
router.post('/', async (req, res) => {
    const { climber_name, password } = req.body
    try {
      const result = await pool.query('SELECT * FROM climbers WHERE climber_name = $1', [climber_name])
      const user = result.rows[0]
      if (!user) return res.status(400).json({ message: 'Invalid credentials' })
  
      const match = await bcrypt.compare(password, user.password_hash)
      if (!match) return res.status(400).json({ message: 'Invalid credentials' })
  
      const token = jwt.sign({ userId: user.climber_id }, JWT_SECRET, { expiresIn: '1h' })
      res.json({ token })
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Login error' });
      }
  });

module.exports = router;