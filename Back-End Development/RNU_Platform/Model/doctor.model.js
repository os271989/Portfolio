const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  cedule: {
    type: Number,
    required: true,
  },

  name: {
    type: String,
    required: true,
  },

  patientsQty: {
    type: Number,
    required: true,
  },

  association: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Doctor", doctorSchema);
