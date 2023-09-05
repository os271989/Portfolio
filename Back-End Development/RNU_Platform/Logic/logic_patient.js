const modelPat = require("../Model/patients.model");
const modelCan = require("../Model/candidacy.model");

const MaxDoctorPatients = 5;

//Find All patients
async function findAllPatients() {
  try {
    const data = await modelPat.find();
    return data;
  } catch (error) {
    return null;
  }
}

//Encontrar paciente na BD RNU com nmr de candidatura
async function findPatientRNU(id) {
  try {
    const data = await modelPat.findOne({ idRNU: id });
    //console.log("RNUfind->", data);
    if (data != null) return true;
    return false;
  } catch (error) {
    return -1;
  }
}

//Encontrar paciente na BD RNU com nmr RNU
async function findPatient(id) {
  try {
    const data = await modelPat.findOne({ candNb: id });
    //console.log("DATA->", data);
    if (data != null) return true;
    return false;
  } catch (error) {
    return false;
  }
}

//Encontrar paciente na BD RNU com nmr beneficiário de subsistema de saúde
async function findPatientSystem(id) {
  try {
    console.log("ID-> ", id);
    const data = await modelPat.findOne({ "subSystem.beneficiary": id });
    //let data = await findAllPatients();
    console.log("DATA->", data);

    if (data != null) return true;
    return false;
  } catch (error) {
    return false;
  }
}

//Procurar existência de um paciente recorrendo a um tipo de ID e seu número
async function findID(type, id) {
  try {
    const data = await modelPat.findOne({ idType: type, idNb: id });
    if (data != null) return true;
    return false;
  } catch (error) {
    return false;
  }
}

//Apagar todos os pacientes do RNU
async function deleteAll() {
  //console.log("deleteALL");
  try {
    const all = await modelPat.deleteMany(modelPat.find());
    //console.log("All->", all);
    if (all.deletedCount !== 0) return true;
    return false;
  } catch (error) {
    return false;
  }
}

//Número total de pacientes na BD
async function totalNumber() {
  try {
    const total = await modelPat.find().sort({ _id: -1 }).limit(1);
    if (total.length != 0 && total != null) return total[0].idRNU;
    return 0;
  } catch (error) {
    return null;
  }
}

//Criar um novo Paciente a partir de uma candidatura previamente validada
async function CreatePatient(cand) {
  console.log("CAND-> ", cand);
  const newCand = new modelCan(cand);
  const rnu = (await this.totalNumber()) + 1;
  newCand.subSystem.validity = new Date(newCand.subSystem.validity);

  const owner = function familyOwner(cand, rnuID) {
    if (cand.association === 0) return rnuID;
    return cand.association;
  };
  const newPat = new modelPat({
    completName: newCand.completName.toUpperCase(),
    gender: newCand.gender.toUpperCase(),
    birthday: newCand.birthday,
    idType: newCand.idType,
    idNb: newCand.idNb,
    candNb: newCand.candNb,
    idRNU: rnu,
    address: newCand.address.toUpperCase(),
    cp: newCand.cp,
    nationality: newCand.nationality,
    naturality: newCand.naturality,
    nif: newCand.nif,
    aces: newCand.aces,
    healthCenter: newCand.healthCenter,
    familyOwner: owner(newCand, rnu),
    type: 1,
    exemption: newCand.exemption,
    medication: newCand.medication,
    subSystem: newCand.subSystem,
  });
  return newPat;
}

module.exports = {
  findAllPatients,
  CreatePatient,
  findPatient,
  totalNumber,
  deleteAll,
  findID,
  findPatientRNU,
  findPatientSystem,
};
