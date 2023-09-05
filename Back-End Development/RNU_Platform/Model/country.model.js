const mongoose = require("mongoose");

const countrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  name_abrev: {
    type: String,
    required: true,
  },

  countryCode: {
    type: Number,
    required: true,
  },

  international: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Country", countrySchema);
