const { model, Mongoose } = require("mongoose");
const modelPat = require("../Model/patients.model");
const modelCan = require("../Model/candidacy.model");
const logic_Patient = require("../Logic/logic_patient");
const logic_Candidacy = require("../Logic/logic_candidacy");
const logic_Report = require("../Logic/logic_report");
const control_Health = require("../Controllers/healthArea.controller");
const logic_doctor = require("../Logic/logic_doctor");

//Pesquisar todos os pacientes na BD
module.exports.allPatients = async (req, res) => {
  const data = await logic_Patient.findAllPatients();
  if (data != null) res.json(data);
  else {
    res.status(500).json({ message: "Nenhum paciente encontrado!!" });
  }
};

//Apagar todos os pacientes inseridos na BD RNU
module.exports.deleteAllPatients = async (req, res) => {
  //console.log("deleteAllPatients1!");
  const data = await logic_Patient.deleteAll();
  if (data === true)
    res.status(200).json({ message: "Todos os pacientes apagados!!" });
  else {
    res.status(404).json({ message: "Impossivel apagar pacientes!!" });
  }
};

//Pesquisar um paciente recorrendo ao seu id de candidatura
module.exports.patientRead = async (req, res) => {
  //console.log("id->", req.params.id);
  const result = await logic_Patient.findPatient(req.params.id);
  //console.log("profileRead-> ", result);
  if (result != null) res.json(result);
  else {
    res.status(404).json({ message: "Nenhum paciente encontrado!!" });
  }
};

//Pesquisar um paciente recorrendo ao seu id de RNU
module.exports.patientReadRNU = async (req, res) => {
  //console.log("id->", req.params.id);
  const result = await logic_Patient.findPatientRNU(req.params.id);
  //console.log("profileRead-> ", result);
  if (result != -1) res.json(result);
  else {
    res.status(404).json({
      message: "Nenhum paciente com esse número de utente encontrado!!",
    });
  }
};

//Pesquisar um paciente na BD pelo seu tipo e numero de documento identificador
module.exports.getPatientbyID = async (req, res) => {
  const result = await logic_Patient.findID(req.body.idType, req.body.idNb);
  if (result == true) {
    res.json(result);
    console.log(result);
  } else {
    res
      .status(404)
      .json({ message: "Nenhum paciente com esse ID encontrado!!" });
  }
};

//Pesquisar um paciente na BD com um número de beneficiário de subsistema de saúde
module.exports.getPatientbySystem = async (req, res) => {
  const result = await logic_Patient.findPatientSystem(req.params.id);
  if (result == true) {
    res.json(result);
    console.log(result);
  } else {
    res.status(404).json({
      message: "Nenhum paciente com esse número de beneficário encontrado!!",
    });
  }
};

//Pesquisar o número de pacientes inseridos na BD
module.exports.patientsNumber = async (req, res) => {
  try {
    const result = await logic_Patient.totalNumber();
    //const total = await modelPat.find().sort({ _id: -1 }).limit(1);
    if (result != null) {
      res.json(result);
    } else {
      res.status(404).json({ message: "Nenhum paciente inserido!!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Não conseguimos efetuar a procura!!" });
  }
};

//Validar que campos estão preenchidos
//Register Method
module.exports.createPatient = async (req, res) => {
  //console.log("Patient!!!", req.body);
  try {
    const dataCan = new modelCan({
      //Verificar campos que são enviados pelo Rui
      candNb: req.body.candNb,
      completName: req.body.completName,
      gender: req.body.gender,
      birthday: req.body.birthday,
      idType: req.body.idType,
      idNb: req.body.idNb,
      nationality: req.body.nationality,
      status: req.body.status,
      dateCreated: new Date(req.body.dateCreation),
      address: req.body.address,
      aces: req.body.aces,
      healthCenter: req.body.healthCenter,
      nif: req.body.nif,
      cp: req.body.cp,
      association: req.body.association,
      exemption: req.body.exemption,
      medication: req.body.medication,
      subSystem: req.body.subSystem,
    });
    //res.status(500).json(dataCan);

    //Se candidatura verificada e considerada válida vamos então criar o paciente na BD RNU
    let report = await logic_Candidacy.VerCandidacy(dataCan);
    //console.log("report-> ", report);

    if (report.status === 1) {
      dataCan.status = 1;
      let newPat = await logic_Patient.CreatePatient(dataCan);
      //console.log("PatientCreated");
      const acesChoice = await control_Health.patientAttribution(newPat);
      if (acesChoice === -1) {
        report.status = 2;
        report.obs.push(
          "Atribuição de Paciente Impossível!! Verificar Escolhas ou dados de Residência"
        );
        report.obs.push("Candidatura Rejeitada!!");
        res.status(500).json(report);
      } else if (acesChoice != false) {
        newPat = acesChoice;
        try {
          const dataToSave = await newPat.save();
          //console.log("datatoSave-> ", dataToSave);
          if (dataToSave != null)
            report.obs.push("Novo Paciente Criado com Sucesso!!");
          report = await reportHealthAttribution(newPat, report);
          reportExemption(newPat, report);
          reportMedication(newPat, report);
          report.familiarOwner = newPat.familyOwner;
          report.obs.push("[Sem Erros]");
          res.status(200).json(report);
          logic_Report.createReport(report);
        } catch (error) {
          report.status = 2;
          res.status(400).json({
            message: "Impossivel criar Registo!! Problema no Sistema",
          });
        }
      } else {
        report.status = 2;
        report.obs.push(
          "Erro ao Atribuir ACES ao doente!! Candidatura Inválida"
        );
        res.status(500).json(report);
      }
    } else {
      report.obs.push("Impossivel Criar Paciente!! Dados Incorretos");
      res.status(500).json(report);
    }
  } catch (error) {
    res.status(500).json({ message: "Esquema de Candidatura Inválido!!" });
  }
};

//#region Funções auxiliares

//Função para adicionar dados de saúde atribuídos ao relatório
async function reportHealthAttribution(patient, rep) {
  //console.log("healthPat ->", patient.subSystem.code);
  rep.idRNU = patient.idRNU;
  rep.aces = patient.aces;
  rep.healthCenter = patient.healthCenter;
  const option = await control_Health.findDoctorID(patient.idDoctor);
  console.log("ReportDoctor-> ", option.cedule);
  rep.idDoctor = option.name;
  console.log("rep.idDoctor-> ", rep.idDoctor);
  if (patient.subSystem.code != 0) {
    message =
      "Subsistema de saúde com o código " +
      patient.subSystem.code +
      " associado até " +
      patient.subSystem.validity +
      "!!";
    rep.obs.push(message);
  }
  /*if (option.cedule > 0) {
    console.log("Option");
    message = "Paciente associado ao médico " + option.name + "!!";
    rep.obs.push(message);
  }*/
  return rep;
}

//Função para adicionar indicação de isenção no relatório
function reportExemption(patient, rep) {
  if (patient.exemption.duration === 1) {
    message =
      "Isenção com o código " +
      patient.exemption.exemptionID +
      " atribuida a titulo definitivo!!";
    rep.obs.push(message);
  } else if (patient.exemption.duration > 1) {
    message =
      "Isenção com o código " +
      patient.exemption.exemptionID +
      " atribuida a titulo provisório com a duração de " +
      patient.exemption.duration +
      " dias!!";
    rep.obs.push(message);
  }
}

//Função para adicionar indicação de medicação no relatório
function reportMedication(patient, rep) {
  if (patient.medication.duration === 1) {
    message =
      "Medicação com o código " +
      patient.medication.medicationID +
      " atribuida a titulo definitivo!!";
    rep.obs.push(message);
  } else if (patient.medication.duration > 1) {
    message =
      "Medicação com o código " +
      patient.medication.medicationID +
      " atribuida a titulo provisório com a duração de " +
      patient.medication.duration +
      " dias!!";
    rep.obs.push(message);
  }
}

//#endregion Funções auxiliares
