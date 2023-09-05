const mongoose = require("mongoose");

//false-> erros/ true-> ok
const reportSchema = new mongoose.Schema({
  candNb: {
    type: Boolean,
    default: false,
    required: true,
  },

  completName: {
    type: Boolean,
    required: true,
    default: false,
  },

  gender: {
    type: Boolean,
    required: true,
    default: false,
  },

  birthday: {
    type: Boolean,
    required: true,
    default: false,
  },

  idType: {
    type: Boolean,
    required: true,
    default: false,
  },

  idNb: {
    type: Boolean,
    required: true,
    default: false,
  },

  nationality: {
    type: Boolean,
    required: true,
    default: false,
  },

  nif: {
    type: Boolean,
    required: true,
    default: false,
  },

  status: {
    type: Number, //1-Valid / 2- Refused
    required: true,
    default: 2,
  },

  idRNU: {
    type: Number,
  },

  aces: {
    type: Number,
    required: true,
    default: 0,
  },

  healthCenter: {
    type: Number,
    required: true,
    default: 0,
  },

  idDoctor: {
    type: String,
    default: "",
  },

  association: {
    type: Boolean,
    required: true,
    default: false,
  },

  familiarOwner: {
    type: Number,
    required: true,
    default: 0,
  },

  dateCreated: {
    type: Date,
    required: true,
    default: Date.now(),
  },

  exemption: {
    type: Boolean,
    default: false,
  },

  medication: {
    type: Boolean,
    required: true,
    default: false,
  },

  subSystem: {
    type: Boolean,
    required: true,
    default: false,
  },

  obs: {
    type: [],
    required: true,
  },
});

module.exports = mongoose.model("Report", reportSchema);
