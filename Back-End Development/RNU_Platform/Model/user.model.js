const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  empNb: {
    type: Number,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  status: {
    type: String, //Inactive, Blocked, Active
    required: true,
  },

  credLevel: {
    type: Number, // 1-Administrative; 2-Management; 3-SuperUser
    required: true,
  },

  unity: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Users", userSchema);
