const express = require("express");
require("./db/config");
const User = require("./db/User");
const app = express();

// const Jwt = require(jsonwebtoken);
// const jswtKey = "e-com";

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
      resp.send(user);
    } else {
      resp.send({ result: "User Not Found" });
    }
  }
});

app.listen(3001);
