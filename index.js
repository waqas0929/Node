const express = require("express");
require("./db/config");
const User = require("./db/config");
const app = express();

app.post("./register", (req, resp) => {
  resp.send("");
});

app.listen(3001);
