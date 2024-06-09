const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const { isAuthenticated } = require('../middlewares/auth');

// Create a new comment
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { postId, content } = req.body;
    const comment = new Comment({
      postId,
      author: req.user._id,
      content
    });
    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: 'Unable to add comment' });
  }
});

// Get comments for a specific post
router.get('/:postId', async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).populate('author', 'username');
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch comments' });
  }
});

module.exports = router;