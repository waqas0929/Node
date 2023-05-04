const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Define the old schema for the user document
const oldUserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  gender: String,
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Define a middleware function to update the old schema documents
oldUserSchema.pre("validate", async function (next) {
  const user = this;

  // Check if the document matches the old schema
  if (!user.previousPasswords) {
    // Add any missing fields to the document
    user.previousPasswords = [];
  }

  next();
});

// Define the new schema for the user document
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  gender: String,
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  previousPasswords: [
    {
      password: {
        type: String,
        required: true,
      },

      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  passwordChangeAttempts: {
    type: Number,
    default: 0,
  },
  lastPasswordChangeAttempt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("users", userSchema);
