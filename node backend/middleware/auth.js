const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.sendStatus(401); // Unauthorized

  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) return res.sendStatus(403); // Forbidden
  
    const userId = parseInt(payload.userId, 10);
  
    if (isNaN(userId)) return res.status(400).send('Invalid user ID in token');
  
    req.user = { id: userId }; // Attach parsed ID
    next();
  });
}

module.exports = authenticateToken;