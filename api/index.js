const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
const Post = require('./models/Post');
const Comment = require('./models/Comment');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const app = express();
const uploadMiddleware = multer({ dest: 'upload/' });
const salt = bcrypt.genSaltSync(10);
const secret = 'adsdasndahc328497483?>lvsserdx>W@';

// Middleware
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(cookieParser());
app.use('/upload', express.static(path.join(__dirname, 'upload')));

// Database Connection
mongoose.connect('mongodb+srv://cooking:CtJUyXWI5nsBsPab@mano.bnnh1lk.mongodb.net/?retryWrites=true&w=majority&appName=mano')
    .then(() => console.log('Database connection successful'))
    .catch((err) => console.error('Database connection error:', err));

// User Registration
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
  } catch (e) {
    console.error(e);
    res.status(400).json(e);
  }
});

// User Login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.findOne({ username });
    if (userDoc && bcrypt.compareSync(password, userDoc.password)) {
      jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
        if (err) throw err;
        res.cookie('token', token).json({
          id: userDoc._id,
          username,
        });
      });
    } else {
      res.status(400).json('Wrong credentials');
    }
  } catch (e) {
    console.error(e);
    res.status(500).json('Internal server error');
  }
});

// Fetch Profile
app.get('/profile', (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, (err, info) => {
    if (err) {
      console.error(err);
      return res.status(401).json('Unauthorized');
    }
    res.json(info);
  });
});

// Logout
app.post('/logout', (req, res) => {
  res.cookie('token', '').json('OK');
});

// Create Post
app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
  const { originalname, path: tempPath } = req.file;
  const ext = path.extname(originalname);
  const newPath = `${tempPath}${ext}`;
  fs.rename(tempPath, newPath, async (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json('File upload error');
    }

    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) {
        console.error(err);
        return res.status(401).json('Unauthorized');
      }
      const { title, summary, content } = req.body;
      try {
        const postDoc = await Post.create({
          title,
          summary,
          content,
          cover: newPath,
          author: info.id,
        });
        res.json(postDoc);
      } catch (e) {
        console.error(e);
        res.status(500).json('Error creating post');
      }
    });
  });
});

// Fetch Posts
app.get('/post', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', ['username'])
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(posts);
  } catch (e) {
    console.error(e);
    res.status(500).json('Error fetching posts');
  }
});

// Fetch a Specific Post by ID
app.get('/post/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id).populate('author', ['username']);
    if (!post) {
      return res.status(404).json('Post not found');
    }
    res.json(post);
  } catch (e) {
    console.error(e);
    res.status(500).json('Error fetching post');
  }
});
// Update post endpoint
app.put('/post/:id', uploadMiddleware.single('file'), async (req, res) => {
  const { id } = req.params;
  const { title, summary, content } = req.body;

  try {
    // Find the post by ID
    let post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Update post fields
    post.title = title || post.title;
    post.summary = summary || post.summary;
    post.content = content || post.content;

    // If a file is uploaded, update the post's cover field
    if (req.file) {
      post.cover = req.file.path;
    }

    // Save the updated post to the database
    await post.save();

    res.status(200).json(post);
  } catch (err) {
    console.error('Error updating post:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});
app.get('/post', async (req, res) => {
  const { q } = req.query;
  const query = q ? { title: new RegExp(q, 'i') } : {};

  try {
    const posts = await Post.find(query)
      .populate('author', ['username'])
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(posts);
  } catch (e) {
    console.error(e);
    res.status(500).json('Error fetching posts');
  }
});
app.post('/comment', async (req, res) => {
  const { content, postId } = req.body;
  const { token } = req.cookies;

  try {
      const user = jwt.verify(token, secret);
      const comment = await Comment.create({
          content,
          author: user.id,
          post: postId,
      });

      await Post.findByIdAndUpdate(postId, { $push: { comments: comment._id } });
      
      res.json(comment);
  } catch (err) {
      console.error('Error creating comment:', err);
      res.status(500).json('Error creating comment');
  }
});

app.get('/comments/:postId', async (req, res) => {
  const { postId } = req.params;
  
  try {
      const comments = await Comment.find({ post: postId }).populate('author', 'username');
      res.json(comments);
  } catch (err) {
      console.error('Error fetching comments:', err);
      res.status(500).json('Error fetching comments');
  }
});

// Server Listening
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
