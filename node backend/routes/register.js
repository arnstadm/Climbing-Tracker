var express = require('express');
var router = express.Router();
var pool = require('../db');
var bcrypt = require('bcrypt');

//create a new user. hash password and store in db
router.post('/', async (req, res) => {
    const { climber_name, password } = req.body
    try {
      const hash = await bcrypt.hash(password, 10)
      await pool.query('INSERT INTO climbers (climber_name, password_hash) VALUES ($1, $2)', [climber_name, hash])
      res.status(201).json({ message: 'User registered' })
    } catch (err) {
      if (err.code === '23505') return res.status(400).json({ message: 'Username already exists' })
      res.status(500).json({ message: 'Registration error' })
    }
  });

module.exports = router;