const mongoose = require("mongoose");

const acesSchema = new mongoose.Schema({
  code: {
    type: Number,
    required: true,
  },

  name: {
    type: String,
    required: true,
  },

  cp: {
    type: String,
    required: true,
  },

  localization: {
    type: Object,
  },

  status: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Aces", acesSchema);
