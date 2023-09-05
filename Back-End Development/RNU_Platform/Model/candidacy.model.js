const mongoose = require("mongoose");

const candidacySchema = new mongoose.Schema({
  candNb: {
    type: Number,
    required: true,
  },

  completName: {
    type: String,
    required: true,
  },

  gender: {
    type: String,
    required: true,
  },

  birthday: {
    type: Date,
    required: true,
  },

  idType: {
    type: Number, //1- CC/ 2- BI/ 3- Passport
    required: true,
  },

  idNb: {
    type: String,
    required: true,
  },

  nationality: {
    type: String,
    required: true,
  },

  status: {
    type: Number, //0- Submitted / 1-Validated / 2- Refused
    required: true,
  },

  address: {
    type: String,
    required: true,
  },

  aces: {
    type: Number,
    required: true,
    default: 0,
  },

  healthCenter: {
    type: Number,
    default: 0,
  },

  nif: {
    type: String,
    default: "",
  },

  dateCreated: {
    type: Date,
    required: true,
    default: Date.now(),
  },

  cp: {
    type: String,
    required: true,
  },

  association: {
    type: Number,
    required: true,
    default: 0,
  },

  exemption: {
    type: { exemptionID: Number, duration: Number },
    required: true,
    default: null,
  },

  medication: {
    type: { medicationID: Number, duration: Number },
    required: true,
    default: null,
  },

  subSystem: {
    type: { code: Number, beneficiary: Number, validity: Date },
    required: true,
    default: null,
  },
});

module.exports = mongoose.model("Candidacy", candidacySchema);
