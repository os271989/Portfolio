const ctrlPatients = require("../Controllers/patients.controller");

const express = require("express");
const router = express.Router();
module.exports = router;

//Pesquisar todos os pacientes
router.get("/getAllPatients", ctrlPatients.allPatients);

//Pesquisar paciente pelo número de candidatura
router.get("/getPatient/:id", ctrlPatients.patientRead);

//Pesquisar paciente pelo número de beneficiário de subsistema de saúde
router.get("/getPatientSystem/:id", ctrlPatients.getPatientbySystem);

//Pesquisar paciente por tipo e número de documento de identificação
router.get("/getID", ctrlPatients.getPatientbyID);

//Pesquisar paciente pelo número de RNU
router.get("/getPatientRNU/:id", ctrlPatients.patientReadRNU);

//Pesquisar número total de pacientes na BD
router.get("/getLastPatient", ctrlPatients.patientsNumber);

//Criar novo paciente no RNU
router.post("/createPatient", ctrlPatients.createPatient);

//Apagar todos os pacientes do RNU
router.delete("/deleteAllPatients", ctrlPatients.deleteAllPatients);
