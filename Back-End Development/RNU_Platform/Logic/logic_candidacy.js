const ModelCan = require("../Model/candidacy.model");
const ModelRep = require("../Model/report.model");
const logPatient = require("../Logic/logic_patient");
const logCountry = require("../Logic/logic_country");
const logHealth = require("../Logic/logic_healthCenter");
const logAces = require("../Logic/logic_aces");
const logTools = require("../Logic/logic_tools");
const mongoose = require("mongoose");
const validator = require("validator");

async function VerCandidacy(cand) {
  const report = new ModelRep();
  const candidacy = new ModelCan(cand);
  const re1 = new RegExp(
    "^[a-zA-Z\u00C0-\u00ff ][a-zA-Z\u00C0-\u00ff ]+[a-zA-Z\u00C0-\u00ff ]$"
  );
  const re2 = new RegExp("[M]|[F]");
  //const re1 = new RegExp("^[a-zA-Z][a-zA-Z ]+[a-zA-Z]$"); //Exp Regular para testar valor do nome -> letras(aA) + espaços
  console.log("Cand-> ", cand);
  if (cand) {
    console.log("IF1", candidacy.candNb);
    //Verificar numero da candidatura
    if (candidacy.candNb != null) {
      console.log("IF2");
      if (candidacy.candNb != 0) {
        console.log("canNB->", candidacy.candNb);
        if ((await logPatient.findPatient(cand.candNb)) == true) {
          report.obs.push(
            "Já existe um utente com esse número de candidatura!"
          );
        } else {
          report.candNb = true;
        } //true está tudo bem
      } else {
        report.candNb = false;
        report.obs.push("Número de candidatura inválido!");
      }
      console.log("candNB OK");

      //Verificar nome
      if (re1.test(candidacy.completName)) {
        //console.log("REGEX OK");
        report.completName = true;
      } else {
        report.obs.push("Nome Inválido!");
      }
      console.log("completName OK");

      //Verificar Genero
      //if (candidacy.gender.toUpperCase == "M" || candidacy.gender.toUpperCase == "F")
      //console.log("gender->", candidacy.gender);
      if (
        candidacy.gender != undefined &&
        re2.test(candidacy.gender.toUpperCase())
      ) {
        report.gender = true;
      } else {
        report.obs.push("Gênero Inválido!");
      }

      console.log("gender OK");
      //Verificar validade da data de nascimento
      switch (calcBirthday(candidacy.birthday)) {
        case -1:
          report.obs.push("DataNasc Inválida!");
          break;
        case 0:
          report.obs.push("Idade maior do que 120 anos");
          break;
        case 1:
          report.birthday = true; //Verificar validade da data de nascimento formato yyyy-MM-dd
          break;
        default:
          report.obs.push("Erro na DataNasc!");
          break;
      }

      console.log("birthday OK");

      //Verificar identificador de tipo de ID válido
      if (candidacy.idType > 0 && candidacy.idType <= 3) {
        report.idType = true; //Tem de conter um id de tipo de documento de identificação
        //report.status = 1;
      } else {
        report.obs.push("Tipo de Identificação Inválida!");
      }

      console.log("idType OK");

      //Discutir se vair ser apenas um id ou um array de ID
      let existCand;
      if (candidacy.idNb != undefined) {
        existCand = await logPatient.findID(candidacy.idType, candidacy.idNb);
      } else existCand = false;

      if (!existCand) {
        const validID = await verIDNumber(
          candidacy.idType,
          candidacy.idNb,
          candidacy.nationality
        );
        switch (validID) {
          case -1:
            report.obs.push("Formato de identificação introduzido incorreto!");
            report.idNb = false;
            //report.status = 2;
            break;
          case 0:
            report.obs.push("Numero de identificação inválido!");
            report.idNb = false;
            //report.status = 2;
            break;
          case 1:
            report.idNb = true;
            //report.status = 1;
            break;
          default:
            report.obs.push("Erro no numero de identificação!");
            //report.status = 2;
            report.idNb = false;
            break;
        }
      } else {
        report.obs.push(
          "Já existe um utente com esse numero de identificação!!"
        );
      }
      console.log("idNb OK");

      //Verificar validade da nacionalidade introduzida
      const existCountry = await logCountry.findOneCountry(
        candidacy.nationality
      );
      if (existCountry != false) {
        report.nationality = true; //Discutir como vamos tratar as nacionalidades
      } else {
        report.obs.push("Naturalidade Inválida!!");
      }

      console.log("Natutrality OK");

      //Verificar validade do NIF introduzido
      const existNif = CheckNIF(candidacy.nif); //await verIDNumber(4, candidacy.nif, candidacy.nationality);
      if (existNif === true || existNif === 0) {
        report.nif = true;
      } else {
        report.obs.push("NIF Inválido!!");
      }

      //console.log("NIF OK");

      //Verificação de escolha de unidade de Saúde
      const healthChoice = await logHealth.VerifyChoiceHc(
        candidacy.healthCenter
      );

      //Tratamento da validação de escolha de Unidade de Saúde
      switch (healthChoice) {
        case -1:
          report.obs.push("Escolha de Unidade de Saúde Inválida!!");
          break;
        case 0:
          break;
        case 1:
          report.healthCenter = true;
          break;
        default:
          report.obs.push("Escolha de Unidade de Saúde Incorreta!!");
          break;
      }

      const acesChoice = await logAces.VerifyChoiceAces(candidacy.aces);
      //Tratamento da validação de escolha de ACES
      switch (acesChoice) {
        case -1:
          report.obs.push("Escolha de ACES Inválida!!");
          break;
        case 0:
          break;
        case 1:
          report.healthCenter = true;
          break;
        default:
          report.obs.push("Escolha de ACES Incorreta!!");
          break;
      }

      //Verificação de nº RNU para associação
      const family = await verAssociation(candidacy.association);
      if (family === true || family === 0) {
        report.association = true;
        report.familiarOwner = candidacy.association;
      } else {
        report.exemption = false;
        report.obs.push(
          "Impossível associar! Não existe nenhum utente com o código indicado de RNU !!"
        );
      }

      //Verificação de isenção a atribuir
      const exemption = await verExemption(candidacy.exemption);
      console.log("exemption->", exemption);
      switch (exemption) {
        case -1:
          report.exemption = false;
          report.obs.push(
            "Impossível atribuir isenção! Não foi indicada a sua duração!!"
          );
          break;
        case 0:
          report.exemption = true;
          report.obs.push("Nenhum pedido de isenção associado!!");
          break;
        case false:
          report.exemption = false;
          report.obs.push(
            "Impossível atribuir isenção! Não existe nenhuma isenção com o código indicado!!"
          );
          break;
        default:
          report.exemption = true;
          break;
      }

      //Verificação de isenção a atribuir
      const medication = await verMedication(candidacy.medication);
      console.log("medication-> ", medication);
      switch (medication) {
        case -1:
          report.medication = false;
          report.obs.push(
            "Impossível atribuir medicação! Não foi indicada a sua duração!!"
          );
          break;
        case 0:
          report.medication = true;
          report.obs.push("Nenhum beneficio de medicação especial associado!!");
          break;
        case false:
          report.medication = false;
          report.obs.push(
            "Impossível atribuir medicação! Não existe nenhuma medicação com o código indicado!!"
          );
          break;
        default:
          report.medication = true;
          break;
      }

      //Verificação de dados subsistema de saúde
      const subSystem = await verSubSystem(candidacy.subSystem);
      console.log("SubSystem", subSystem);
      switch (subSystem) {
        case -1:
          report.subSystem = false;
          report.obs.push(
            "Impossível associar Subsistema de Saúde! Não existe nenhum Subsistema com o código indicado!!"
          );
          break;
        case 0:
          report.subSystem = true;
          report.obs.push("Nenhum Subsistema de saúde associado!!");
          break;
        case true:
          result = await logPatient.findPatientSystem(
            candidacy.subSystem.beneficiary
          );
          if (result == false) report.subSystem = true;
          else {
            report.subSystem = false;
            report.obs.push(
              "Já existe um utente com o número de beneficiário indicado!!"
            );
          }
          break;
        default:
          report.subSystem = false;
          report.obs.push(
            "Impossível associar Subsistema de Saúde! Dados do beneficiário com erros!!"
          );
          break;
      }
    }

    //Se não entrar em nenhuma condição
    report.status = verStatus(report);
    //console.log("STATUS->", report);
    //Se candidatura inválida
  } else {
    //console.log("FALHOU2!!");
    report.obs.push("Candidatura Inexistente");
  }
  //console.log("Return??");
  return report; //Devolve relatório com resultado de todas as validações e possíveis observações
}

//#region Funções de Validação

//Data de nascimento deve ser posterior ou igual ao dia corrente
//-1-> Inválido/ 0-> >120anos/ 1-> OK
function calcBirthday(birthday) {
  var date1 = new Date(birthday);
  var date2 = new Date(Date.now() - date1);

  if (Date.now() >= date1) {
    if (date2.getFullYear() - 1970 <= 120) return 1;
    return 0;
  }
  return -1;
}
//Verificar validade do numero de documento
// 0- Nenhum/ 1- CC/ 2- BI/ 3- Passport/ 4- NIF/ 5- NISS
async function verIDNumber(idType, id, nationality) {
  //console.log("verIDNumber->>", idType, id, nationality);
  if (idType > 0 && id.length > 0)
    switch (idType) {
      case 1:
        return CheckCC(id);
      case 2:
        return CheckBI(id);
      case 3:
        const origin = await logCountry.findOneCountry(nationality);
        //console.log("Origin->", origin);
        return CheckPassport(id, origin.name_abrev);
      case 4:
        return CheckNIF(id);
      case 5:
        return CheckNISS(id);
      default:
        return false;
    }
}

//#region ValidateID

//Função para autenticar numero de CC
function CheckCC(numeroDocumento) {
  var sum = 0;
  var secondDigit = false;
  console.log(numeroDocumento.length);
  //Se CC.length inferior a 12 pode faltar um 0 á esquerda, caso falte introduzir um número o cálculo final irá dar errado
  if (numeroDocumento.length < 12) numeroDocumento = "0" + numeroDocumento; //return false;
  if (numeroDocumento.length > 12) return -1;

  for (i = numeroDocumento.length - 1; i >= 0; --i) {
    valor = GetNumberFromChar(numeroDocumento[i]);
    if (secondDigit) {
      valor *= 2;
      if (valor > 9) valor -= 9;
    }
    sum += valor;
    secondDigit = !secondDigit;
  }
  if (sum % 10 == 0) return 1;
  return 0;
}
//Metodo para devolver valor numérico conforme carater passado
function GetNumberFromChar(letter) {
  switch (letter) {
    case "0":
      return 0;
    case "1":
      return 1;
    case "2":
      return 2;
    case "3":
      return 3;
    case "4":
      return 4;
    case "5":
      return 5;
    case "6":
      return 6;
    case "7":
      return 7;
    case "8":
      return 8;
    case "9":
      return 9;
    case "A":
      return 10;
    case "B":
      return 11;
    case "C":
      return 12;
    case "D":
      return 13;
    case "E":
      return 14;
    case "F":
      return 15;
    case "G":
      return 16;
    case "H":
      return 17;
    case "I":
      return 18;
    case "J":
      return 19;
    case "K":
      return 20;
    case "L":
      return 21;
    case "M":
      return 22;
    case "N":
      return 23;
    case "O":
      return 24;
    case "P":
      return 25;
    case "Q":
      return 26;
    case "R":
      return 27;
    case "S":
      return 28;
    case "T":
      return 29;
    case "U":
      return 30;
    case "V":
      return 31;
    case "W":
      return 32;
    case "X":
      return 33;
    case "Y":
      return 34;
    case "Z":
      return 35;
  }
}
//Função para autenticar NIF
function CheckNIF(nif) {
  //console.log("NIF-> ", nif);
  var c;
  // verifica o tamanho
  if (Number(nif) == 0) return 0;
  if (nif.length != 9) return false;

  // valida primeiro digito
  c = nif.charAt(0);
  if (c == "0" || c == "3" || c == "4" || c == "7" || c == "8") return false;

  // algoritmo de validação
  return AlgoritmoValidacao(nif);
}
//Função para autenticar numero de BI
function CheckBI(number) {
  var BIformated;
  var lastDigit = number.charAt(number.length - 1); //Apanhar ultimo numero para check-digit
  var nbi = number.slice(0, number.length - 1); //separar numero de documento do check-digit
  // verifica tamanhos
  if (nbi.length < 7 || nbi.length > 8) return -1;

  // prepara o numero de BI formatado
  if (nbi.length === 8) {
    BIformated = nbi + lastDigit;
  } else {
    BIformated = "0" + nbi + lastDigit;
  }
  // algoritmo de validação
  const value = AlgoritmoValidacao(BIformated);
  if (value == true) return 1;
  return 0;
}
//Função para autenticar o NISS
function CheckNISS(niss) {
  const values = [29, 23, 19, 17, 13, 11, 7, 5, 3, 2];
  var numNISS = niss;
  //const initials = ["1", "2"];

  //verificar tamanho do número passado
  if (numNISS.length != 11) return -1;

  //verificar validade do carácter inicial do NISS
  if (!(numNISS[0] === "1" || numNISS[0] === "2")) return -1;
  if (!(numNISS[1] === "1" || numNISS[1] === "2")) return -1;

  //converter número para lista de inteiros
  numNISS = numNISS.split("").map(Number);
  //console.log("Slice->", numNISS);

  //verificar soma de controlo
  const result = sumLists(values, numNISS) % 10;
  //console.log("ResultNISS->", result);
  if (!Number(numNISS[10]) === 9 - result) return 1;
  return 0;
}
//Função para autenticar um número de passaporte
function CheckPassport(nbr, country) {
  //console.log("Passport->", nbr, country);
  if (country === null) return -1;
  if (validator.isPassportNumber(nbr, country)) return 1;
  return 0;
}
//Função para multiplicar os valores de 2 matrizes com o mesmo tamanho
function sumLists(a, b) {
  i = 0;
  total = 0;
  while (i < a.length) {
    total += a[i] * b[i];
    i++;
  }
  return total;
}
//Função de validação para BI e NIF
function AlgoritmoValidacao(numFormated) {
  var pos,
    ctl,
    val = 0;
  //Multiplicar valor pela sua posição da direita para a esquerda (9valortotal - posicao) e somar todos
  for (pos = 0; pos < 8; ++pos) {
    val += parseInt(numFormated.charAt(pos)) * (9 - pos);
  }

  ctl = 0;
  if (val % 11 != 0) ctl = (11 - (val % 11)) % 10;
  //verifica se valor calculado == ultimo algarismo passado por parametro
  return ctl === parseInt(numFormated.charAt(8));
}

//#endregion ValidateID

//Função para verificar se o nº de RNU para associar é válido
async function verAssociation(rnu) {
  if (rnu == 0) return 0;
  else {
    const aux = await logPatient.findPatientRNU(rnu);
    if (aux) return true;
  }
  return -1;
}

//Função para verificar validade/existencia da isenção pedida
async function verExemption(exemption) {
  //console.log("Entrou em VerExemption", exemption);
  if (exemption.exemptionID == 0 || exemption == null) return 0;
  else {
    const aux = await logTools.findExemption(exemption.exemptionID);
    if (aux) {
      if (exemption.duration > 1) return true;
      else if (exemption.duration == 1) return 1;
      else if (exemption.duration == 0 || exemption.duration == null) return -1;
    } else return false;
  }
}

//Função para verificar validade/existencia da isenção pedida
async function verMedication(medication) {
  //console.log("Entrou em VerMedication", medication);
  if (medication === null || medication.medicationID == 0) return 0;
  else {
    const aux = await logTools.findMedication(medication.medicationID);
    //console.log("auxMed-> ", aux);
    if (aux) {
      if (medication.duration > 1) return true;
      else if (medication.duration == 1) return 1;
      else if (medication.duration == 0 || medication.duration == null)
        return -1; //-1 duração não foi indicada
    } else return false; //false não existe medicação com o código indicado
  }
}

//Função para verificar dados de associação de subsistema de saúde
async function verSubSystem(subSystem) {
  console.log("Entrou em verSystem", subSystem.code);
  if (subSystem == null || subSystem.code == 0) return 0; //0-> sem atribuição
  else {
    const aux = await logTools.findSystemID(subSystem.code);
    //console.log("aux-> ", aux);
    if (aux == true) {
      valDate = new Date(subSystem.validity) > Date.now();
      //console.log("date-> ", valDate);
      if (subSystem.beneficiary > 0 && valDate === true) {
        return true; //True com atribuição
      } else {
        return false;
      } //False dados de beneficiario com erros
    } else return -1; //-1 Não existe subsistema de saúde
  }
}

//Função para passar todos os atributos do relatorio e verificar se tem algum com valor falso
function verStatus(report) {
  //console.log("REPORT->", report);
  const aux = Object.create(report);
  //console.log("object->", aux);
  let result = false;
  for (var k in report) {
    if (report[k] === false) {
      //console.log("Report[k]->", report[k]);
      result = true;
      break;
    }
  }

  console.log("Result->", result);
  if (result) return 2;
  return 1;
}

//#endregion Funções de Validação

module.exports = { VerCandidacy };
