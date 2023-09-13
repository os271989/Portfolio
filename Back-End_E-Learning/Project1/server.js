const express = require("express");
const jsonwebtoken = require("jsonwebtoken");
const routes = require("./routes/users");

const app = express();
const JWT_SECRET = "aVerySecretString";

app.use(express.json());
app.use("/user", routes);

app.get("/employees", (req, res) => {
  let tkn = req.header("Authorization");
  if (!tkn) return res.status(401).send("No Token!!");
  if (tkn.startsWith("Bearer")) {
    tokenValue = tkn.slice(7, tkn.length).trimStart();
  }

  const verificationStatus = jsonwebtoken.verify(
    tokenValue,
    "aVerySecretString"
  );
  if (verificationStatus.user === "user") {
    return res
      .status(200)
      .json({ message: "Access Successful to employee endpoint!" });
  } else {
    res
      .status(401)
      .json({ message: "Please Login to access employee end point!" });
  }
  return res;
});

app.post("signin", (req, res) => {
  if (uname === "user" && pwd === "password") {
    return res.json({
      token: jsonwebtoken.sign({ user: "user" }, JWT_SECRET),
    });
  }
  return res
    .status(401)
    .json({ message: "Invalid username and/or password!!" });
});

app.listen(3000, () => {
  console.log("API Server on localhost:3000");
});

app.on("connected", () => {
  console.log("Connected to Server!");
});
