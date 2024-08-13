const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Replace 'your_jwt_secret' with your actual JWT secret
    const decoded = jwt.verify(token, 'SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c');
    
    req.user = { userId: decoded.id , role: decoded.role};
    next();
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

module.exports = authMiddleware;
