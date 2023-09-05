const mongoose = require("mongoose");

const systemSchema = new mongoose.Schema({
  codeEntity: {
    type: Number,
    required: true,
  },

  name: {
    type: String,
    required: true,
  },

  acronym: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("healthSystems", systemSchema);
