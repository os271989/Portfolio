const express = require("express");
const router = express.Router();
module.exports = router;
const ctrlHealth = require("../Controllers/healthArea.controller");

//Pesquisar todos os ACES
router.get("/getAllAces", ctrlHealth.allAces);
~(
  //Pesquisar ACES pelo seu ID
  router.get("/getAcesByID/:id", ctrlHealth.AcesID)
);

//Pesquisar todas as unidades de saúde
router.get("/getAllHcenters", ctrlHealth.allHcenters);

//Pesquisar unidade de saúde pelo seu ID
router.get("/getHcenterByID/:id", ctrlHealth.HcenterID);

//Pesquisar unidade de saúde pelo AcesID
router.get("/getHcenterByAcesID/:id", ctrlHealth.HcenterAcesID);

//Pesquisar todos os médicos
router.get("/getAllDoctors", ctrlHealth.allDoctors);

//Pesquisar todos os médicos com ID da unidade de saúde
router.get("/getDoctorUS/:id", ctrlHealth.doctorsUS);

//Pesquisar Médico pelo seu ID
router.get("/getDoctorID/:id", ctrlHealth.doctorID);

//Atualizar número de pacientes do médico
router.put("/UpdateDoctorPatients/:id", ctrlHealth.DoctorQtyUpdate);
