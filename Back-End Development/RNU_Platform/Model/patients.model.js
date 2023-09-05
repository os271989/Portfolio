const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
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
    type: Number,
    required: true,
    default: 0,
  },

  idNb: {
    type: String,
    required: true,
  },

  candNb: {
    type: Number,
    required: true,
  },

  idRNU: {
    type: Number,
    required: true,
  },

  nif: {
    type: String,
  },

  address: {
    type: String,
    required: true,
  },

  cp: {
    type: String,
    required: true,
  },

  nationality: {
    type: String,
    //required: true,
  },

  medication: {
    type: { medicationID: Number, duration: Number },
  },

  naturality: {
    type: String,
  },

  type: {
    type: Number, // -1-> Inactive/ 0-> Provisory/ 1-> Definitive
    required: true,
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
    type: Number,
    required: true,
    default: 0,
  },

  dateCreated: {
    type: Date,
    required: true,
    default: Date.now(),
  },

  familyOwner: {
    type: Number,
    required: true,
    default: 0,
  },

  exemption: {
    type: { exemptionID: Number, duration: Number },
  },

  subSystem: {
    type: { code: Number, beneficiary: Number, validity: Date },
  },
  //strictQuery: false,
});

module.exports = mongoose.model("Patients", patientSchema);
