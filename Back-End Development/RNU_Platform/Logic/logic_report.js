const modelRep = require("../Model/report.model");
const modelExe = require("../Model/exemption.model");

//Devolver todos os relatórios presentes na BD
async function findAllReports() {
  try {
    const data = await modelRep.find();
    return data;
  } catch (error) {
    return null;
  }
}

//Encontrar relatórios na BD RNU com nmr de candidatura
async function findReport(id) {
  try {
    const data = await modelRep.findOne({ candNb: id });
    //console.log("DATA->", data);
    if (data != null) return true;
    return false;
  } catch (error) {
    return false;
  }
}

//Apagar todos os relatorios do RNU
async function deleteAllReports() {
  //console.log("deleteALL");
  try {
    const all = await modelRep.deleteMany(modelRep.find());
    //console.log("All->", all);
    if (all.deletedCount !== 0) return true;
    return false;
  } catch (error) {
    return false;
  }
}

//Criar novo relatório na BD
async function createReport(rep) {
  try {
    const data = await rep.save();
  } catch (error) {
    res.status(500).json({ message: "Impossivel criar Relatorio" });
  }
}

module.exports = { findAllReports, findReport, createReport, deleteAllReports };
