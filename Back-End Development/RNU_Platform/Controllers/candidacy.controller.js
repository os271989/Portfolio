const log_Country = require("../Logic/logic_country");
const logHealth = require("../Logic/logic_healthCenter");

module.exports.findCountry = async (req, res) => {
  //console.log("Country to find-> ", req.body.Country);
  const data = await log_Country.findOneCountry(req.body.Country);
  res.json(data);
};

//Get All Patients Method
module.exports.allCountries = async (req, res) => {
  const data = await log_Country.findAllCountries();
  if (data != null) res.json(data);
  else {
    res.status(500).json({ message: "Nenhum pais encontrado!!" });
  }
};

module.exports.distanceBetween = async (req, res) => {
  res.json(logHealth.Distance2Points(req.body.loc1, req.body.loc2));
};
