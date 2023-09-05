const ctrlReport = require("../Controllers/report.controller");

const express = require("express");
const router = express.Router();
module.exports = router;

//Pesquisar todos os relatórios
router.get("/getAllReports", ctrlReport.allReports);
//router.get("/deleteAllReports", ctrlReport.deleteAllReport);
