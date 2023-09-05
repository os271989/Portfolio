const modelExe = require("../Model/exemption.model");
const modelMed = require("../Model/specialMedications.model");
const modelSystem = require("../Model/healthSubsystems.model");

//Devolver todos os relatórios presentes na BD
async function findAllExemptions() {
  try {
    const data = await modelExe.find();
    return data;
  } catch (error) {
    return null;
  }
}

//Encontrar relatórios na BD RNU com nmr de candidatura
async function findExemption(id) {
  try {
    const data = await modelExe.findOne({ exemptionID: id });
    if (data != null) return true;
    return false;
  } catch (error) {
    return -1;
  }
}

//Encontrar todos os Medicamentos presentes na BD
async function findAllMedications() {
  try {
    const data = await modelMed.find();
    return data;
  } catch (error) {
    return null;
  }
}

//Encontrar medicamentos na BD RNU com codigo de id
async function findMedication(id) {
  console.log("MedID-> ", id);
  try {
    const data = await modelMed.findOne({ MedicationID: id });
    console.log("DATA-> ", data);
    if (data) return true;
    return false;
  } catch (error) {
    return -1;
  }
}

//Encontrar todos os Sistemas de saúde presentes na BD
async function findAllSystems() {
  try {
    const data = await modelSystem.find();
    return data;
  } catch (error) {
    return null;
  }
}

//Encontrar subsistema na BD RNU com codigo de entidade
async function findSystemID(id) {
  try {
    const data = await modelSystem.findOne({ codeEntity: id });
    if (data != null) return true;
    return false;
  } catch (error) {
    return -1;
  }
}

module.exports = {
  findAllExemptions,
  findExemption,
  findAllMedications,
  findMedication,
  findAllSystems,
  findSystemID,
};
