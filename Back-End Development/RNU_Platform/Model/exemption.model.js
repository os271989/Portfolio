const mongoose = require("mongoose");

const exemptionSchema = new mongoose.Schema({
  exemptionID: {
    type: Number,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  prooveCode: {
    type: Number,
    required: true,
  },

  prooveDescription: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Exemption", exemptionSchema);
