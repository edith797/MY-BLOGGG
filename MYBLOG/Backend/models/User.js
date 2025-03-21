const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true }, // Email must be unique
    password: { type: String, required: true },
    // Remove or make username optional if you don't need it
    // username: { type: String, unique: true, required: false }, // Remove this line if you don't want a username
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
