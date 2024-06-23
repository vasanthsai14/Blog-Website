// Import necessary modules and packages
const express = require("express");
const cors = require("cors");
const path = require('path');
const mongoose = require("mongoose");
const User = require("./models/User");
const Post = require("./models/Post");
const bcrypt = require("bcrypt");
const fs = require('fs');
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser')
const app = express();
const salt = bcrypt.genSaltSync(saltRounds);
const multer = require('multer');
const uploadMiddleware = multer({ dest: 'uploads/' });

// Enable CORS with credentials and specify the allowed origin
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(cookieParser());
app.use(express.json());
app.use('/uploads', express.static(__dirname + '/uploads'));

// Connect to MongoDB Atlas database
async function startServer() {
  try {
    await mongoose.connect("mongodb+srv://vasanthsai1412003:NXFAfIHHeSzLAzaL@cluster0.y9gnbzl.mongodb.net/", { useNewUrlParser: true, useUnifiedTopology: true, serverSelectionTimeoutMS: 10000 });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
  }
}

startServer();

// Function to hash a password using bcrypt
const hashPassword = async (password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    throw new Error('Error hashing password');
  }
};

// Middleware to check if the request has a valid token
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  console.log("Received Token:", token);
  if (!token) return res.status(401).json({ message: 'Unauthorized: Token missing' });

  jwt.verify(token, "yourSecretKeyHere", (err, user) => {
    if (err) return res.status(403).json({ message: 'Unauthorized: Invalid token' });
    req.user = user;
    console.log('Authenticated user:', user);
    next();
  });
};

// Route to handle user registration
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  console.log('Received registration data:', req.body);

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const userDoc = await User.create({
      username,
      password: await hashPassword(password),
    });
    res.json(userDoc);
  } catch (e) {
    console.error('Error during registration:', e.message);
    res.status(400).json({ message: e.message });
  }
});


//Route to get the user's profile information
app.get('/profile/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id).select('-password'); // Exclude password
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

//Route to update the user's profile information
app.put('/profile/:id', authenticateToken, uploadMiddleware.single('profilePicture'), async (req, res) => {
  const { id } = req.params;
  const { email, bio } = req.body;
  let profilePicture = null;

  if (req.file) {
    const { originalname } = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    profilePicture = `uploads/${req.file.filename}.${ext}`;
    fs.renameSync(req.file.path, profilePicture);
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.email = email || user.email;
    user.bio = bio || user.bio;
    user.profilePicture = profilePicture || user.profilePicture;

    await user.save();
    res.json(user);
  } catch (error) {
    console.error('Error updating user profile:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Route to handle user login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.findOne({ username });
    if (!userDoc) {
      console.log("User not found");
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const passOk = await bcrypt.compare(password, userDoc.password);
    if (passOk) {
      jwt.sign(
        { username, id: userDoc._id },
        "yourSecretKeyHere",
        {},
        (e, token) => {
          if (e) throw e;
          res.cookie('token', token).json({ id: userDoc._id, username });
          localStorage.setItem('token', token); // Add this line to store the token
          console.log("Login successful!");
        }
      );
    } else {
      console.log("Wrong Password");
      return res.status(401).json({ message: "Wrong Password" });
    }
  } catch (e) {
    res.status(400).json(e);
  }
});

// Route to get user profile information
app.get('/profile', authenticateToken, (req, res) => {
  res.json(req.user);
});

// Route to handle user logout
app.post('/logout', (req, res) => {
  res.clearCookie('token').json('ok');
});

// Route to handle post creation with file upload and creating a new post
app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
  let newPath = null;

  if (req.file) {
    const { originalname } = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    newPath = `uploads/${req.file.filename}.${ext}`;
    fs.renameSync(req.file.path, newPath);
  }

  const { token } = req.cookies;

  try {
    const decodedToken = jwt.verify(token, "yourSecretKeyHere");
    const { title, summary, content, category } = req.body;

    const newPost = await Post.create({
      title,
      summary,
      content,
      cover: newPath,
      author: decodedToken.id,
      category,
    });

    res.json(newPost);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// Route to handle post creation with file upload or updating a post
app.put('/post/:id', uploadMiddleware.single('file'), async (req, res) => {
  const postId = req.params.id;
  let newPath = null;

  if (req.file) {
    const { originalname } = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    newPath = `uploads/${req.file.filename}.${ext}`;
    fs.renameSync(req.file.path, newPath);
  }

  const { token } = req.cookies;

  try {
    const decodedToken = jwt.verify(token, "yourSecretKeyHere");
    const { title, summary, content, category } = req.body;
    const postDoc = await Post.findById(postId);
    if (!postDoc) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(decodedToken.id);

    if (!isAuthor) {
      return res.status(400).json({ message: 'You are not the author' });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { title, summary, content, cover: newPath || postDoc.cover, category },
      { new: true }
    );

    res.json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// Route to get all posts
app.get('/post', authenticateToken, async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate('author', 'username'); // Populate only the username field

    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/post/:id', async (req, res) => {
  const { id } = req.params;
  // res.json();
  const postDoc = await Post.findById(id).populate('author', ['username']);
  res.json(postDoc);
});

// Route to get all posts from the database
app.get('/all-posts', async (req, res) => {
  try {
    const allPosts = await Post.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .populate('author', 'username'); // Populate only the username field

    res.json(allPosts);
  } catch (error) {
    console.error('Error fetching all posts:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// Route to search posts by category
app.get('/search', async (req, res) => {
  const { term } = req.query;
  try {
    const posts = await Post.find({ category: { $regex: term, $options: "i" } })
      .sort({ createdAt: -1 })
      .populate('author', 'username'); // Populate only the username field

    res.json(posts);
  } catch (error) {
    console.error('Error searching posts:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Route to delete a post by ID
app.delete('/post/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const postDoc = await Post.findById(id);

    if (!postDoc) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if the user is the author of the post
    if (req.user.id.toString() !== postDoc.author.toString()) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // Convert postDoc to a Post model instance
    const postInstance = new Post(postDoc.toObject());

    // Delete the post
    await postInstance.deleteOne();
    return res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});