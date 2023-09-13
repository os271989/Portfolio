const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");
//const routes = require("./router/friends.js");

const app = express();
const port = 5000;
app.use(express.json());
app.use(
  session({ secret: "fingerpint" }, (resave = true), (saveUninitialized = true))
);

//Function to prevent username's repetition
const doesExist = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
};

//Check if username and password provided match with saved data
const authenticatedUser = (username, password) => {
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
};

//Post method to register new user
app.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registred. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

//Post method to allow an user to login creating JWToken if credentials are valid
app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  console.log("Enter Login");
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 * 60 }
    );

    req.session.authorization = {
      accessToken,
      username,
    };
    return res.status(200).send("User successfully logged in");
  } else {
    return res
      .status(208)
      .json({ message: "Invalid Login. Check username and password" });
  }
});

app.listen(port, () =>
  console.log("Server connected in http://localhost:" + port)
);
