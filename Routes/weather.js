const express = require("express");
const axios = require("axios");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

router.get("/weather", authenticateToken, async (req, res) => {
  const { lat, lon } = req.body;
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=f0d5ef72a9784272ae229d496634a984&units=metric`;
  try {
    const response = await axios.get(url);
    const data = response.data;
    res.send(data);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting weather information");
  }
});

module.exports = router;
