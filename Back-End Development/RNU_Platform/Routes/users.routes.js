const ctrlUsers = require("../Controllers/authentication.controller");

const express = require("express");
const router = express.Router();
module.exports = router;

//Get All Users
router.get("/getAllUsers", ctrlUsers.allUsers);
//Try to login an user
router.get("/login", ctrlUsers.login);
