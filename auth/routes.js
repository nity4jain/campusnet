const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const verifyToken = require('../middleware/auth');

router.post('/register', async (req, res) => {
  try {
    const { email, username, password, full_name } = req.body;

    if (!email || !username || !password) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Please provide email, username, and password'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: 'Weak password',
        message: 'Password must be at least 6 characters'
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(409).json({
        error: 'User already exists',
        message: 'Email or username already registered'
      });
    }

    const newUser = new User({
      email: email.toLowerCase(),
      username,
      password,
      full_name
    });

    await newUser.save();

    const token = jwt.sign(
      {
        user_id: newUser._id,
        email: newUser.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        user_id: newUser._id,
        email: newUser.email,
        username: newUser.username,
        role: newUser.role
      }
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      error: 'Server error',
      message: error.message
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Missing credentials',
        message: 'Please provide email and password'
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
    }

    const token = jwt.sign(
      {
        user_id: user._id,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        user_id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        department: user.department,
        year: user.year
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Server error',
      message: error.message
    });
  }
});
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user_id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User profile could not be retrieved'
      });
    }

    res.status(200).json({
      success: true,
      user
    });

  } catch (error) {
    res.status(500).json({
      error: 'Server error',
      message: error.message
    });
  }
});

router.put('/profile', verifyToken, async (req, res) => {
  try {
    const { department, year, full_name } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user_id,
      {
        department,
        year,
        full_name
      },
      { new: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });

  } catch (error) {
    res.status(500).json({
      error: 'Server error',
      message: error.message
    });
  }
});
router.post('/logout', verifyToken, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logout successful. Please clear the token on frontend.'
  });
});

module.exports = router;
