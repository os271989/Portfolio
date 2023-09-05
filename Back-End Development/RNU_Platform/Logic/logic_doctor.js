const { default: mongoose } = require("mongoose");
const doctors = require("../Model/doctor.model");

//Get list of all Doctors availables
async function getAllDoctors() {
  try {
    const data = await doctors.find();
    if (data != null) return data;
    return false;
  } catch (error) {
    return false;
  }
}

//Get list of doctors assigned to a Health Center
async function getDoctorUS(us) {
  try {
    const data = await doctors.find({ association: us });
    if (data != null) return data;
    return false;
  } catch (error) {
    return false;
  }
}

//Get doctor by his cedule number
async function getDoctorID(id) {
  try {
    const data = await doctors.findOne({ cedule: id });
    console.log("DATADoctor", data);
    if (data != null) return data;
    else return false;
  } catch (error) {
    return false;
  }
}

//Add one patient do a doctor
async function doctorAddPatient(id) {
  const docID = { cedule: id };
  const aux = await getDoctorID(id);
  //console.log("AUX->", aux);
  const newData = { patientsQty: aux.patientsQty + 1 };
  try {
    const data = await doctors.findOneAndUpdate(docID, newData, { new: true });
    //console.log("DATA-> ", data);
    if (data != null) return data;
    return false;
  } catch (error) {
    return -1;
  }
}

//Assign a patient to a specific doctor from a HelthCenter code
async function doctorAttribution(healthCode) {
  let doctor = 0;
  const aux = await getDoctorUS(healthCode);
  //console.log("aux-> ", aux);
  doctor = aux[0];
  for (const element of aux) {
    if (element.patientsQty < doctor.patientsQty) {
      doctor = element;
    }
  }
  if (doctor.patientsQty < 1500) {
    console.log("Doctor-> ", doctor);
    doctorAddPatient(doctor.cedule);
    return doctor.cedule;
  }
  return 0;
}

module.exports = {
  getAllDoctors,
  getDoctorUS,
  doctorAttribution,
  doctorAddPatient,
  getDoctorID,
};
