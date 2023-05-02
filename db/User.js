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
});

// Use the middleware function to update the documents on the fly
// userSchema.pre("validate", async function (next) {
//   const user = this;

//   // Check if the document matches the old schema
//   if (!user.previousPasswords) {
//     // Add any missing fields to the document
//     user.previousPasswords = [];
//   }

//   next();
// });

// Define the pre-save hook to hash the password and save old password
// userSchema.pre("save", async function (next) {
//   const user = this;

//   if (user.isModified("password")) {
//     const salt = await bcrypt.genSalt();
//     user.password = await bcrypt.hash(user.password, salt);

//     //save old password
//     if (user.previousPasswords.length >= 5) {
//       user.previousPasswords.pop();
//     }
//     user.previousPasswords = [
//       { password: user.password, date: new Date() },
//       ...user.previousPasswords,
//     ];
//   }
//   next();
// });

// Define the method to compare the password
// userSchema.methods.comparePassword = async function (password) {
//   try {
//     const isMatch = await bcrypt.compare(password, this.password);
//     return isMatch;
//   } catch (error) {
//     throw new Error(error);
//   }
// };

module.exports = mongoose.model("users", userSchema);
