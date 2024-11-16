const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

// Register user
router.post('/register', async (req, res) => {
    const { username, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword, role });
    try {
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
        console.log(user)
    }
    catch (error) {
        res.status(404).json({ message: 'User registration failed' });
    }
});

// Login user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !await bcrypt.compare(password, user.password)) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.send({ token });
})

// Get User Profile
router.get('/profile', authMiddleware, (req, res) => {
    if (req.user) {
        res.json(req.user);  // Return user profile if authenticated
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
});

router.get("/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Error during logout." });
      }
      res.status(200).json({ message: "Logout successful." });
    });
  });
module.exports = router;