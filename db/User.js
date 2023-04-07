const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  gender: String,
  email: String,
  password: String,
});

module.exports = mongoose.model("users", userSchema);
