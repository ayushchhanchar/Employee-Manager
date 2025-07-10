const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

const ALLOWED_ROLES = ['user', 'admin'];

// Register user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Normalize and validate role
    let assignedRole = role === 'employee' ? 'user' : role;
    if (!ALLOWED_ROLES.includes(assignedRole)) {
      assignedRole = 'user';
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save user
    const user = new User({ username, email, password: hashedPassword, role: assignedRole });
    await user.save();

    console.log('User registered:', user);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('User registration failed:', error);
    res.status(400).json({ message: 'User registration failed', error: error.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Return token and user info
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

// Get User Profile (Authenticated)
router.get('/profile', authMiddleware, (req, res) => {
  if (req.user) {
    const { _id, username, email, role } = req.user;
    res.json({ _id, username, email, role });
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
});

// Logout (optional, only for session-based)
router.get('/logout', (req, res) => {
  req.logout?.((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error during logout.' });
    }
    res.status(200).json({ message: 'Logout successful.' });
  });
});

module.exports = router;
