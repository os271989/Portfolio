const mongoose = require("mongoose");

const localSchema = new mongoose.Schema({
  ID: { type: Number, required: true },
  CodigoPostal: { type: String, required: true },
  Morada: { type: String, required: true },
  Localidade: { type: String, required: true },
  NumeroPorta: { type: Number },
  Freguesia: { type: String, required: true },
  Concelho: { type: String, required: true },
  CodigoDistrito: { type: Number, required: true },
  Distrito: { type: String, required: true },
  Latitude: { type: Number, required: true },
  Longitude: { type: Number, required: true },
});

module.exports = mongoose.model("Localization", localSchema);
