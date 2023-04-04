const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  gender: String,
  email: String,
  password: string,
});

module.exports = mongoose.model("User", userSchema);
