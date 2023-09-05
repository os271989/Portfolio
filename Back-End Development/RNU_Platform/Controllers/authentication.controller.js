const { model, Mongoose } = require("mongoose");
const Model = require("../Model/user.model");
const crypto = require("crypto");
SALT_WORK_FACTOR = 15;

//Get All Users Method
module.exports.allUsers = async (req, res) => {
  try {
    //console.log("TESTE DB_RNU_Users");
    const data = await Model.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Nenhum user encontrado!!" });
  }
};

module.exports.login = async (req, res) => {
  const password = req.body.password;
  const success = await Model.findById(req.body.empNb);
  const id = null;

  if (comparePassword()) {
    id = success.id;
    res.status(200).json(success);
  } else {
    res.status(400).json({ message: error.message });
  }
};
