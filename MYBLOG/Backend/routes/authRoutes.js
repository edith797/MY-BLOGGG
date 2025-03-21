const express = require("express");
const User = require("../models/User"); // Import user model
const bcrypt = require("bcrypt");
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Email validation regex

const router = express.Router();

// Register User
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  // Validate email format
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  try {
    // Check if the email already exists in the database
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: "User with this email already exists" });
    }

    // Hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user without the username field
    const newUser = new User({
      email,
      password: hashedPassword,
    });

    await newUser.save(); // Save new user

    // Send success response
    res.status(201).json({
      message: "User successfully registered",
      user: {
        id: newUser._id,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Server error during registration" });
  }
});

// Login User
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Validate email format
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    req.session.user = { id: user._id, email: user.email };
    res.json({ message: "Logged in", user: req.session.user });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});

// Check session
router.get("/me", (req, res) => {
  if (req.session.user) return res.json(req.session.user);
  res.status(401).json({ error: "Not authenticated" });
});

// Logout
router.post("/logout", (req, res) => {
  req.session.destroy(() => res.json({ message: "Logged out" }));
});

module.exports = router;
