const mongoose = require("mongoose");

const health_CenterSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },

  name: {
    type: String,
    required: true,
  },

  type: {
    type: String,
    required: true,
  },

  ars: {
    type: String,
    required: true,
  },

  acesCode: {
    type: Number,
    required: true,
  },

  cs: {
    type: String,
  },

  code_UF: {
    type: Number,
    required: true,
  },

  street: {
    type: String,
    required: true,
  },

  cp: {
    type: String,
    required: true,
  },

  locality: {
    type: String,
    required: true,
  },

  tel: {
    type: Number,
    required: true,
  },

  fax: {
    type: Number,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  parish: {
    type: String,
    required: true,
  },

  parishCode: {
    type: Number,
    required: true,
  },

  district: {
    type: String,
    required: true,
  },

  localization: {
    type: Object,
    required: true,
  },
});

module.exports = mongoose.model("healthCenters", health_CenterSchema);
