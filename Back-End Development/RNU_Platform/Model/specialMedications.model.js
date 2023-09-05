const mongoose = require("mongoose");

const medicationSchema = new mongoose.Schema(
  {
    medicationID: {
      type: Number,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },
  },
  { strictQuery: false }
);

module.exports = mongoose.model("SpecialMedication", medicationSchema);
