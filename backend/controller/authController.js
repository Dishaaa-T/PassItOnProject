import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'fallback_secret',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    }
  );
};

export async function registerUser(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Please provide name, email, and password',
      });
    }

    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(409).json({
        message: 'An account with that email already exists',
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      avatar: req.body.avatar || '',
      location: req.body.location || '',
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      location: user.location,
      bio: user.bio,
      token,
    });
  } catch (error) {
    console.error('Register error:', error);

    return res.status(500).json({
      message: 'Failed to create account',
    });
  }
}

export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Please provide email and password',
      });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    const token = generateToken(user._id);

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      location: user.location,
      bio: user.bio,
      token,
    });
  } catch (error) {
    console.error('Login error:', error);

    return res.status(500).json({
      message: 'Failed to login',
    });
  }
}

export async function getMe(req, res) {
  try {
    return res.json(req.user);
  } catch (error) {
    console.error('Get user error:', error);

    return res.status(500).json({
      message: 'Failed to get user',
    });
  }
}