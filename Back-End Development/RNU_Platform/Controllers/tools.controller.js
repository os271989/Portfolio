const logic_Tools = require("../Logic/logic_tools");

//Encontrar todas as isenções
async function allExemptions(req, res) {
  const data = await logic_Tools.findAllExemptions();
  if (data != null) res.json(data);
  else res.status(500).json({ message: "Nenhuma isenção encontrada!!" });
}

//Encontrar Isenção pelo seu id
async function exemptionID(req, res) {
  const data = await logic_Tools.findExemption(req.params.id);
  if (data != null) res.json(data);
  else
    res
      .status(500)
      .json({ message: "Nenhuma isenção encontrada com esse ID!!" });
}

//Encontrar todas as medicações
async function allMedications(req, res) {
  const data = await logic_Tools.findAllMedications();
  if (data != null) res.json(data);
  else res.status(500).json({ message: "Nenhuma Medicação encontrada!!" });
}

//Encontrar Medicação pelo seu id
async function getMedicationID(req, res) {
  const data = await logic_Tools.findMedication(req.params.id);
  if (data != null) res.json(data);
  else
    res
      .status(500)
      .json({ message: "Nenhuma medicação encontrada com esse ID!!" });
}

//Encontrar todas os subSistemas
async function allSystems(req, res) {
  const data = await logic_Tools.findAllSystems();
  if (data != null) res.json(data);
  else res.status(500).json({ message: "Nenhum Subsistema encontrado!!" });
}

//Encontrar Subsistema pelo seu codigo de entidade
async function getSystemID(req, res) {
  const data = await logic_Tools.findSystemID(req.params.id);
  if (data != null) res.json(data);
  else
    res
      .status(500)
      .json({ message: "Nenhum Subsistema encontrada com esse código!!" });
}

module.exports = {
  allExemptions,
  allMedications,
  exemptionID,
  getMedicationID,
  allSystems,
  getSystemID,
};
