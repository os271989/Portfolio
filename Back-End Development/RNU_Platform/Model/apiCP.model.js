const axios = require("axios");

const api = axios.create({
  baseURL: "https://api.duminio.com/ptcp/v2/ptapi638d3e04251d84.30909031/:id",
});

module.exports = api;
