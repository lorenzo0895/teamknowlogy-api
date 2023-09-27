var express = require("express");
var router = express.Router();
const _statsService = require("../services/stats.service");

router.get("/", async function (req, res, next) {
  try {
    const data = await _statsService.getStats();
    res.json(data);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
