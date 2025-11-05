// resources/routes.js
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const verifyToken = require('../middleware/auth');
const Resource = require('../models/Resource');
const Comment = require('../models/Comment');
const User = require('../models/User');

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// ========== ENDPOINT 1: UPLOAD RESOURCE ==========
router.post('/upload', verifyToken, async (req, res) => {
  try {
    const { title, subject, year, description, file_url, tags } = req.body;

    // Validate input
    if (!title || !subject || !year || !file_url) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Please provide title, subject, year, and file_url'
      });
    }

    // Create new resource
    const newResource = new Resource({
      title,
      subject,
      year,
      description,
      file_url,
      tags: tags || [],
      uploaded_by: req.user_id
    });

    await newResource.save();

    // Populate uploader info
    await newResource.populate('uploaded_by', 'username email full_name');

    res.status(201).json({
      success: true,
      message: 'Resource uploaded successfully',
      resource: newResource
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      error: 'Server error',
      message: error.message
    });
  }
});

// ========== ENDPOINT 2: GET ALL RESOURCES ==========
router.get('/', async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const resources = await Resource.find()
      .populate('uploaded_by', 'username email full_name')
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Resource.countDocuments();

    res.status(200).json({
      success: true,
      resources,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Server error',
      message: error.message
    });
  }
});

// ========== ENDPOINT 3: GET SINGLE RESOURCE ==========
router.get('/:id', async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id)
      .populate('uploaded_by', 'username email full_name');

    if (!resource) {
      return res.status(404).json({
        error: 'Resource not found',
        message: 'The resource you are looking for does not exist'
      });
    }

    res.status(200).json({
      success: true,
      resource
    });
  } catch (error) {
    res.status(500).json({
      error: 'Server error',
      message: error.message
    });
  }
});

// ========== ENDPOINT 4: SEARCH RESOURCES ==========
router.get('/search/query', async (req, res) => {
  try {
    const { q, subject, year } = req.query;

    let filter = {};

    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { subject: { $regex: q, $options: 'i' } }
      ];
    }

    if (subject) {
      filter.subject = subject;
    }

    if (year) {
      filter.year = parseInt(year);
    }

    const resources = await Resource.find(filter)
      .populate('uploaded_by', 'username email full_name')
      .sort({ created_at: -1 });

    res.status(200).json({
      success: true,
      count: resources.length,
      resources
    });
  } catch (error) {
    res.status(500).json({
      error: 'Server error',
      message: error.message
    });
  }
});

// ========== ENDPOINT 5: DOWNLOAD RESOURCE ==========
router.get('/:id/download', async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        error: 'Resource not found'
      });
    }

    // Increment download count
    resource.downloads += 1;
    await resource.save();

    // Redirect to file URL (or send file if local)
    res.status(200).json({
      success: true,
      message: 'Download started',
      file_url: resource.file_url,
      downloads: resource.downloads
    });
  } catch (error) {
    res.status(500).json({
      error: 'Server error',
      message: error.message
    });
  }
});

// ========== ENDPOINT 6: ADD COMMENT ==========
router.post('/:id/comments', verifyToken, async (req, res) => {
  try {
    const { comment } = req.body;

    if (!comment || comment.trim() === '') {
      return res.status(400).json({
        error: 'Comment cannot be empty'
      });
    }

    // Verify resource exists
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({
        error: 'Resource not found'
      });
    }

    // Create comment
    const newComment = new Comment({
      resource_id: req.params.id,
      user_id: req.user_id,
      comment
    });

    await newComment.save();
    await newComment.populate('user_id', 'username email full_name');

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      comment: newComment
    });
  } catch (error) {
    res.status(500).json({
      error: 'Server error',
      message: error.message
    });
  }
});

// ========== ENDPOINT 7: GET COMMENTS ==========
router.get('/:id/comments', async (req, res) => {
  try {
    // Verify resource exists
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({
        error: 'Resource not found'
      });
    }

    const comments = await Comment.find({ resource_id: req.params.id })
      .populate('user_id', 'username email full_name')
      .sort({ created_at: -1 });

    res.status(200).json({
      success: true,
      count: comments.length,
      comments
    });
  } catch (error) {
    res.status(500).json({
      error: 'Server error',
      message: error.message
    });
  }
});

// ========== ENDPOINT 8: UPDATE RESOURCE ==========
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        error: 'Resource not found'
      });
    }

    // Only uploader can update
    if (resource.uploaded_by.toString() !== req.user_id) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You can only update your own resources'
      });
    }

    // Update fields
    if (req.body.title) resource.title = req.body.title;
    if (req.body.description) resource.description = req.body.description;
    if (req.body.subject) resource.subject = req.body.subject;
    if (req.body.year) resource.year = req.body.year;
    if (req.body.tags) resource.tags = req.body.tags;

    await resource.save();
    await resource.populate('uploaded_by', 'username email full_name');

    res.status(200).json({
      success: true,
      message: 'Resource updated successfully',
      resource
    });
  } catch (error) {
    res.status(500).json({
      error: 'Server error',
      message: error.message
    });
  }
});

// ========== ENDPOINT 9: DELETE RESOURCE ==========
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        error: 'Resource not found'
      });
    }

    // Only uploader can delete
    if (resource.uploaded_by.toString() !== req.user_id) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You can only delete your own resources'
      });
    }

    await Resource.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Resource deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      error: 'Server error',
      message: error.message
    });
  }
});

// ========== ENDPOINT 10: GET MY UPLOADS ==========
router.get('/my-uploads/all', verifyToken, async (req, res) => {
  try {
    const resources = await Resource.find({ uploaded_by: req.user_id })
      .populate('uploaded_by', 'username email full_name')
      .sort({ created_at: -1 });

    res.status(200).json({
      success: true,
      count: resources.length,
      resources
    });
  } catch (error) {
    res.status(500).json({
      error: 'Server error',
      message: error.message
    });
  }
});

module.exports = router;
