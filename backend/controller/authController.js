import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

export async function registerUser(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please provide name, email, and password');
  }

  const existing = await User.findOne({ email });
  if (existing) {
    res.status(409);
    throw new Error('An account with that email already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    avatar: req.body.avatar || '',
    location: req.body.location || '',
  });

  const token = generateToken(user._id);
  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    location: user.location,
    bio: user.bio,
    token,
  });
}

export async function loginUser(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  const token = generateToken(user._id);
  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    location: user.location,
    bio: user.bio,
    token,
  });
}

export async function getMe(req, res) {
  res.json(req.user);
}
