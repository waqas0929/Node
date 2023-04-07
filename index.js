const express = require("express");
require("./db/config");
const User = require("./db/User");

const Jwt = require("jsonwebtoken");
const jwtKey = "e-com";

const app = express();

app.use(express.json());

app.post("/register", async (req, resp) => {
  try {
    let user = new User(req.body);
    let result = await user.save();
    resp.send(result);
  } catch (error) {
    resp.status(404).send({ message: error.message });
  }
});

app.post("/login", async (req, resp) => {
  if (req.body.email) {
    let user = await User.findOne(req.body);
    if (user) {
      Jwt.sign({ user }, jwtKey, (err, token) => {
        resp.send({ user, auth: token });
      });
    } else {
      resp.send({ result: "User Not Found" });
    }
  }
});

app.listen(3001);
