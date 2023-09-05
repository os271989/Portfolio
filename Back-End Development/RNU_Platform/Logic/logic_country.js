const modelCountry = require("../Model/country.model");

//Searching if one country exists in DB
async function findOneCountry(countryName) {
  try {
    //console.log("OjectCountry", countryName);
    const data = await modelCountry.findOne({ name: countryName });
    //console.log("Country->", data);
    if (data != null) return data;
    return false;
  } catch (error) {
    return false;
  }
}

//Find All countries
async function findAllCountries() {
  try {
    const data = await modelCountry.find();
    return data;
  } catch (error) {
    return null;
  }
}

module.exports = { findOneCountry, findAllCountries };
