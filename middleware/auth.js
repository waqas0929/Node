const jwt = require("jsonwebtoken");
const jwtKey = "e-com";

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).send({ message: "Unauthorized" });
  }

  jwt.verify(token, jwtKey, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    req.user = { id: decoded.user._id };
    next();
  });
}

module.exports = { authenticateToken };
