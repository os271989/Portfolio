const express = require("express");
const router = express.Router();
module.exports = router;
const ctrl_Tools = require("../Controllers/tools.controller");
const ctrlCandidacy = require("../Controllers/candidacy.controller");

//Calcular distância entre dois pontos
router.get("/distance", ctrlCandidacy.distanceBetween);

//Pesquisar país pelo seu nome
router.get("/verCountry", ctrlCandidacy.findCountry);

//Pesquisar todos os países da BD
router.get("/getAllCountries", ctrlCandidacy.allCountries);

//Converter Postal Code
router.get("/PostalCode/:id");

//Encontrar todas as isenções
router.get("/allExemptions", ctrl_Tools.allExemptions);

//Encontrar isenção pelo ID
router.get("/getExemptionID/:id", ctrl_Tools.exemptionID);

//Encontrar todas as Medicações
router.get("/allMedications", ctrl_Tools.allMedications);

//Encontrar medicação pelo ID
router.get("/getMedicationID/:id", ctrl_Tools.getMedicationID);

//Encontrar todas os Subsistemas
router.get("/allSystems", ctrl_Tools.allSystems);

//Encontrar Subsistema pelo codigo da entidade
router.get("/getSystemID/:id", ctrl_Tools.getSystemID);
