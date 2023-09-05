const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const routes1 = require("./Routes/patients.routes");
const routes2 = require("./Routes/users.routes");
const routes3 = require("./Routes/report.routes");
const routes4 = require("./Routes/tools.routes");
const routes5 = require("./Routes/health.routes");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3030;
const mongoString = process.env.DATABASE_URL;
const mongoString2 = "mongodb://localhost:27017/RNU_Server;";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api", routes1);
app.use("/api", routes2);
app.use("/api", routes3);
app.use("/api", routes4);
app.use("/api", routes5);

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on("error", (error) => {
  console.log("Erro na Conexao a BD");
});

database.once("connected", () => {
  console.log("Conexao a BD com sucesso!!");
});

database.on("disconnected", () => {
  console.log("Desconexao da BD!!");
});

app.use(express.json());
app.listen(PORT, () => {
  console.log("Conexao ao servidor com Sucesso na porta " + PORT);
});
