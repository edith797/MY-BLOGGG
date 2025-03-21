const express = require("express");
const multer = require("multer");
const path = require("path");
const Post = require("../models/Post");

const router = express.Router();

// ✅ Multer Setup for File Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // ✅ Ensure the folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// ✅ Create Post (with File Upload)
router.post("/", upload.single("file"), async (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: "Unauthorized" });

  try {
    const { title, summary, content } = req.body;
    if (!title || !summary || !content) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newPost = new Post({
      title,
      summary,
      content,
      filePath: req.file ? `/uploads/${req.file.filename}` : null, // ✅ Store relative path
      author: req.session.user.id, // ✅ Save author ID
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating post" });
  }
});

// ✅ Get All Posts (Include Author Email)
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().populate("author", "email"); // ✅ Fetch author's email

    // ✅ Convert filePath to full URL before sending response
    const updatedPosts = posts.map((post) => ({
      ...post._doc,
      filePath: post.filePath ? `http://localhost:5000${post.filePath}` : null,
    }));

    res.json(updatedPosts);
  } catch (error) {
    res.status(500).json({ error: "Error fetching posts" });
  }
});

// ✅ Get Single Post by ID (Include Author Email)
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("author", "email");
    if (!post) return res.status(404).json({ error: "Post not found" });

    res.json({
      ...post._doc,
      filePath: post.filePath ? `http://localhost:5000${post.filePath}` : null,
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching post" });
  }
});

module.exports = router;
