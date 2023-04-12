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
  if (req.body.email && req.body.password) {
    let user = await User.findOne({
      email: req.body.email,
      password: req.body.password,
    });
    if (user) {
      Jwt.sign({ user }, jwtKey, (err, token) => {
        resp.send({ user, auth: token });
      });
    } else {
      resp.send({ result: "INVALID EMAIL OR PASSWORD" });
    }
  } else {
    resp.send({ result: "Email and password are required" });
  }
});

app.get("/user/:userId", async (req, resp) => {
  try {
    let user = await User.findById(req.params.userId);
    if (!user) {
      return resp.status(404).send({ message: "User Not Found" });
    }
    resp.send(user);
  } catch (error) {
    resp.send(500).send({ message: error.message });
  }
});

app.listen(3001);
