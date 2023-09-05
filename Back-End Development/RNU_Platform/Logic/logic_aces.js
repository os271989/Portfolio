const modelAces = require("../Model/aces.model");
const logic_Health = require("../Logic/logic_healthCenter");
const api = require("../Model/apiCP.model");

//Procurar um ACES com Código Postal
async function FindAcesCp(cpNumber) {
  const aux = cpNumber.slice(0, 4);
  try {
    const data = await modelAces.findOne({ cp: aux });

    if (data != null) return data;
    return false;
  } catch (error) {
    return false;
  }
}

//Procurar um ACES com código do ACES
async function FindAcesCode(acesCode) {
  try {
    const data = await modelAces.findOne({ code: acesCode });
    if (data != null) return data;
    return false;
  } catch (error) {
    return false;
  }
}

async function GetAllAces() {
  try {
    const data = await modelAces.find();
    if (data != null) return data;
    return false;
  } catch (error) {
    return false;
  }
}

async function GetAcesID(aces) {
  try {
    const data = await modelAces.findOne({ code: aces });
    if (data != null) return data;
    return false;
  } catch (error) {
    return false;
  }
}

//Função para verificar que a escolhaUS é válida
async function VerifyChoiceAces(aces) {
  if (aces == 0) return 0;
  const validAces = await GetAcesID(aces);
  //console.log("validAces -> " + validAces + "validHealth -> " + validHealth);

  if (validAces != false) return 1;
  if (validAces == false) return -1;
}

//Função para procurar na lista de ACES o que está mais próximo da área de residência
function findCloserAcesList(acesList, residence) {
  //console.log("acesList-> ", acesList);
  let aux;
  let item = 0;
  let min = logic_Health.Distance2Points(acesList[0].localization, residence);
  let closer = acesList[0];
  //Testar esta função e comparar objetos
  for (element in acesList) {
    aux = logic_Health.Distance2Points(acesList[item].localization, residence);
    //console.log("min->", min);
    //console.log("aux->", aux);
    //console.log("Closer->", closer);
    if (aux < min) {
      closer = acesList[item];
      min = aux;
    }
    item++;
  }
  if (closer != null) return closer.code;
  return -1;
}

//Encontrar o ACES que inclua a área de residência
async function GetAcesResidence(cp, address) {
  const add = cp.substr(0, 4) + cp.substr(5, 8);
  //console.log("Add-> ", add);
  //Recebe CP e converte para objeto de localizacao
  const aux = await logic_Health.getCPLocalization(add, address);
  //console.log("Aux-> ", aux);
  if (aux != undefined) {
    let aces = await GetAllAces();
    aces = findCloserAcesList(aces, aux);
    return aces;
  }
  //const choice = aces;
  return false;
}

//Função para atribuição de ACES a um paciente
async function acesAttribution(patient) {
  const newPatient = patient;
  //Testar se o campo do ACES não foi preenchido
  if (newPatient.aces == 0) {
    const choice = await GetAcesResidence(newPatient.cp, newPatient.address);
    if (choice != false) {
      newPatient.aces = choice;
    } else {
      return (newPatient.aces = -1);
    }
  }
  return newPatient;
}

module.exports = {
  FindAcesCp,
  FindAcesCode,
  GetAllAces,
  GetAcesID,
  VerifyChoiceAces,
  acesAttribution,
};
