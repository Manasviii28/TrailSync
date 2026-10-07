import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  // Read token from HTTP-only cookie or Authorization header
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'trailsync_secret_key_2026_fitness_app');
    req.user = await User.findById(decoded.id).select('-password');
    
    if (!req.user) {
      return res.status(401).json({ message: 'User no longer exists' });
    }

    next();
  } catch (error) {
    console.error('JWT Verification error:', error.message);
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};
