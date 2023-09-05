const logic_Report = require("../Logic/logic_report");

//Get All Patients Method
module.exports.allReports = async (req, res) => {
  const data = await logic_Report.findAllReports();
  if (data != null) res.json(data);
  else {
    res.status(500).json({ message: "Nenhum relatório encontrado!!" });
  }
};

module.exports.deleteAllReport = async (req, res) => {
  console.log("deleteAllReport!");
  const data = await logic_Report.deleteAllReports();
  if (data === true)
    res.status(200).json({ message: "Todos os Relatorios apagados!!" });
  else {
    res.status(404).json({ message: "Impossivel apagar Relatorios!!" });
  }
};
