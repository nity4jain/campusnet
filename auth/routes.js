const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const verifyToken = require('../middleware/auth');

router.post('/register', async (req, res) => {
  try {
    const {
      email,
      username,
      password,
      full_name,
      student_id,
      phone,
      is_hosteller,
      hostel,
      degree,
      branch,
      department,
      year,
      consent_for_contact
    } = req.body;

    // Basic required fields
    if (!email || !username || !password || !student_id || !phone) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Please provide email, username, password, student_id and phone'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: 'Weak password',
        message: 'Password must be at least 6 characters'
      });
    }

    const existingUser = await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { username },
        { student_id },
        { phone }
      ]
    });

    if (existingUser) {
      return res.status(409).json({
        error: 'User already exists',
        message: 'Email, username, student ID or phone already registered'
      });
    }

    const newUser = new User({
      email: email.toLowerCase(),
      username,
      password,
      full_name,
      student_id,
      phone,
      is_hosteller: !!is_hosteller,
      hostel: is_hosteller ? hostel || null : null,
      degree,
      branch,
      department,
      year,
      consent_for_contact: !!consent_for_contact
    });

    await newUser.save();

    const token = jwt.sign(
      {
        user_id: newUser._id,
        email: newUser.email,
        username: newUser.username,
        student_id: newUser.student_id
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
        role: newUser.role,
        student_id: newUser.student_id,
        phone: newUser.phone,
        is_hosteller: newUser.is_hosteller,
        hostel: newUser.hostel,
        degree: newUser.degree,
        branch: newUser.branch,
        department: newUser.department,
        year: newUser.year,
        consent_for_contact: newUser.consent_for_contact
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
    const { email, password } = req.body; // email may be email/username/student_id/phone

    if (!email || !password) {
      return res.status(400).json({
        error: 'Missing credentials',
        message: 'Please provide identifier and password'
      });
    }

    const identifier = email;

    const user = await User.findOne({
      $or: [
        { email: identifier.toLowerCase() },
        { username: identifier },
        { student_id: identifier },
        { phone: identifier }
      ]
    });

    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Identifier or password is incorrect'
      });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Identifier or password is incorrect'
      });
    }

    const token = jwt.sign(
      {
        user_id: user._id,
        email: user.email,
        username: user.username,
        student_id: user.student_id
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
        student_id: user.student_id,
        phone: user.phone,
        is_hosteller: user.is_hosteller,
        hostel: user.hostel,
        degree: user.degree,
        branch: user.branch,
        department: user.department,
        year: user.year,
        consent_for_contact: user.consent_for_contact
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
    const {
      department,
      year,
      full_name,
      phone,
      student_id,
      is_hosteller,
      hostel,
      degree,
      branch,
      consent_for_contact
    } = req.body;

    const update = {
      department,
      year,
      full_name,
      phone,
      student_id,
      is_hosteller,
      hostel: is_hosteller ? hostel || null : null,
      degree,
      branch,
      consent_for_contact
    };

    const updatedUser = await User.findByIdAndUpdate(
      req.user_id,
      update,
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
