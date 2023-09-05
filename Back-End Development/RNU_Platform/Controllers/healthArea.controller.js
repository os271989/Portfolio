const logic_Aces = require("../Logic/logic_aces");
const logic_Health = require("../Logic/logic_healthCenter");
const logic_Doctors = require("../Logic/logic_doctor");

//Get all ACES
module.exports.allAces = async (req, res) => {
  const data = await logic_Aces.GetAllAces();
  if (data != false) res.json(data);
  else {
    res.status(500).json({ message: "Nenhum ACES encontrado" });
  }
};

//Get ACES with param ID
module.exports.AcesID = async (req, res) => {
  const data = await logic_Aces.GetAcesID(req.params.id);
  if (data != false) res.json(data);
  else {
    res.status(500).json({ message: "Nenhum ACES foi encontrada!!" });
  }
};

//Get all Health Centers
module.exports.allHcenters = async (req, res) => {
  //console.log("Entrou");
  const data = await logic_Health.GetAllHcenters();
  if (data != false) res.json(data);
  else {
    res.status(500).json({ message: "Nenhuma Unida de Saúde encontrada" });
  }
};

//Get Health Center with param ID
module.exports.HcenterID = async (req, res) => {
  const data = await logic_Health.GetHcenterID(req.params.id);
  if (data != false) res.json(data);
  else {
    res
      .status(500)
      .json({ message: "Nenhuma Unidade de Saúde foi encontrada!!" });
  }
};

//Get Health Center with param ACES_ID
module.exports.HcenterAcesID = async (req, res) => {
  const data = await logic_Health.GetHcenterAcesCode(req.params.id);
  if (data != false) res.json(data);
  else {
    res.status(500).json({
      message:
        "Nenhuma Unidade de Saúde foi encontrada pertencente a esse ACES!!",
    });
  }
};

//Get all doctors
module.exports.allDoctors = async (req, res) => {
  const data = await logic_Doctors.getAllDoctors();
  if (data != false) res.json(data);
  else {
    res.status(500).json({ message: "Nenhum médico foi encontrado" });
  }
};

//Get doctors with us association
module.exports.doctorsUS = async (req, res) => {
  const data = await logic_Doctors.getDoctorUS(req.params.id);
  if (data != false) res.json(data);
  else {
    res.status(500).json({ message: "Nenhum médico foi encontrado" });
  }
};

//Get doctor by ID
module.exports.doctorID = async (req, res) => {
  const data = await logic_Doctors.getDoctorID(req.params.id);
  if (data != false) res.json(data);
  else {
    res.status(500).json({ message: "Nenhum médico foi encontrado" });
  }
};

module.exports.findDoctorID = async (id) => {
  console.log("findDoctor OK!!", id);
  try {
    if (id != 0) {
      const doctor = await logic_Doctors.getDoctorID(id);
      console.log("findDoctor-> ", doctor);
      if (doctor != false) return doctor;
      else {
        return 0;
      }
    }
  } catch (error) {
    console.log("ErrorFind");
    return false;
  }
};

//Update doctors patient quantity
module.exports.DoctorQtyUpdate = async (req, res) => {
  const data = await logic_Doctors.doctorAddPatient(req.params.id);
  if (data != false) res.json(data);
  else {
    res.status(500).json({ message: "Nenhum médico foi encontrado" });
  }
};

module.exports.patientAttribution = async (patient) => {
  try {
    if (patient != null) {
      let newPatient = await logic_Aces.acesAttribution(patient);

      if (newPatient.aces != -1 && newPatient.aces != 0) {
        newPatient = await logic_Health.centerAttribution(
          newPatient.aces,
          patient
        );
        //console.log("Center-> ", newPatient.healthCenter);
        if (newPatient.healthCenter != -1 && newPatient.healthCenter != 0)
          console.log("Atribute Doctor!!");
        newPatient.idDoctor = await logic_Doctors.doctorAttribution(
          newPatient.healthCenter
        );
        return newPatient;
      }
    }
    return false;
  } catch (error) {
    return -1;
  }
};
