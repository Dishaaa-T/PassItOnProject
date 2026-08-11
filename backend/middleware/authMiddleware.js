import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export async function protect(req, res, next) {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        res.status(401);
        return next(new Error('Not authorized, user no longer exists'));
      }
      next();
    } catch (error) {
      res.status(401);
      return next(new Error('Not authorized, token failed'));
    }
  } else {
    res.status(401);
    return next(new Error('Not authorized, no token'));
  }
}
