const modelHealthCenter = require("../Model/healthCenter.model");
const haversine = require("haversine");
const axios = require("axios");

//Calcular distância entre coordenadas de 2 objetos
function Distance2Points(dist1, dist2) {
  //console.log("Dist1-> ", dist1);
  //console.log("Dist2-> ", dist2);
  const start = {
    latitude: dist1.latitude,
    longitude: dist1.longitude,
  };
  const end = {
    latitude: dist2.Latitude,
    longitude: dist2.Longitude,
  };

  return haversine(start, end, { unit: "km" }); //Biblioteca para calcular distancia entre coordenadas
}

//Devolver todos as unidades de saúde disponíveis
async function GetAllHcenters() {
  try {
    const data = await modelHealthCenter.find();
    //console.log("DATA->", data);
    if (data != null) return data;
    return false;
  } catch (error) {
    return false;
  }
}

//Pesquisar unidade de saúde pelo seu ID
async function GetHcenterID(hc) {
  try {
    const data = await modelHealthCenter.findOne({ id: hc });
    if (data != null) return data;
    return false;
  } catch (error) {
    return false;
  }
}

//Pesquisar unidade de saúde pelo ID de ACES
async function GetHcenterAcesCode(aces) {
  try {
    const data = await modelHealthCenter.find({ acesCode: aces });
    if (data != null) return data;
    return false;
  } catch (error) {
    return false;
  }
}

//Função para verificar que a escolhaUS é válida
async function VerifyChoiceHc(hc) {
  if (hc === 0) return 0;
  //console.log("hc ->", hc);
  const validHealth = await GetHcenterID(hc);

  if (validHealth != false) return 1;
  if (validHealth == false) return -1;
}

//Atribuição de Unidade de saúde ao utente
async function centerAttribution(acesCode, patient) {
  //console.log("CenterAtt1");
  console.log("Lvl1->", acesCode, patient);
  const newPatient = patient;
  if (acesCode != 0 && newPatient.healthCenter == 0) {
    const choice = await GetHealthResidence(
      acesCode,
      newPatient.cp,
      newPatient.address
    );
    console.log("Choice->", choice);
    if (choice != false) {
      newPatient.healthCenter = choice;
      return newPatient;
      //return choice;
    }
  } else if (acesCode == 0) return patient;

  return (newPatient.healthCenter = -1);
}

async function getCPLocalization(postalCode, address) {
  let url = "https://api.duminio.com/ptcp/v2/ptapi638d3e04251d84.30909031/";
  const response = await axios.get(url + postalCode);
  const choice = chooseRightLocalization(response.data, address);
  return choice;
}

function chooseRightLocalization(localList, address) {
  let cont = 0;
  let result = false;
  let aux;
  if (localList.length > 1) {
    for (const element of localList) {
      aux = element.Morada;
      if (aux == undefined) aux = element.street; //Alternativa para reaproveitar código, se não é do tipo aces é do tipo HealthCenter
      //console.log("Element1", element, address);
      result = verifyIncludeAddress(address, aux);
      if (result == true) {
        return localList[cont];
      }
      cont++;
    }
  }
  return localList;
}

//Verificar se uma morada inclui a outra
function verifyIncludeAddress(address, street) {
  aux1 = address.toLowerCase();
  aux2 = street.toLowerCase();
  return aux1.includes(aux2);
}

//Encontrar o Unidade de Saúde que inclua a área de residência e ACES
async function GetHealthResidence(acesCode, cp, address) {
  //console.log("Lvl2->", acesCode, cp, address);
  const add = cp.substr(0, 4) + cp.substr(5, 8);
  //console.log("Add-> ", add);
  //Recebe CP e converte para objeto de localizacao
  const aux = await getCPLocalization(add, address);
  //console.log("Aux-> ", aux);
  if (aux != undefined) {
    const healthCenters = await GetHcenterAcesCode(acesCode);
    health = findCloserHealthCenter(healthCenters, aux);
    return health;
  }
  //const choice = aces;
  return false;
}

function findCloserHealthCenter(Hcenters, residence) {
  let aux;
  let item = 0;
  let min = Distance2Points(Hcenters[0].localization, residence);
  let closer = Hcenters[0];
  //Testar esta função e comparar objetos
  for (element in Hcenters) {
    aux = Distance2Points(Hcenters[item].localization, residence);
    //console.log("min->", min);
    //console.log("aux->", aux);
    //console.log("Closer->", closer.id);
    if (aux < min) {
      closer = Hcenters[item];
      min = aux;
    }
    item++;
  }
  if (closer != null) return closer.id;
  return -1;
}

module.exports = {
  Distance2Points,
  GetAllHcenters,
  VerifyChoiceHc,
  GetHcenterID,
  centerAttribution,
  getCPLocalization,
  GetHcenterAcesCode,
};
