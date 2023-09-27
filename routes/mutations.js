var express = require("express");
var router = express.Router();
const _mutationService = require("../services/mutations.service");

router.post("/", async function (req, res, next) {
  try {
    // Check if the DNA sequence is valid
    const isValid = _mutationService.isValidDna(req.body.dna);
    if (!isValid) {
      res.status(400).send("Invalid DNA sequence");
      return;
    }
    const hasMutation = _mutationService.hasMutation(req.body.dna);
    
    // Avoid inserting the same mutation
    const repeated = await _mutationService.findMutation(req.body.dna);
    if (!repeated) {
      await _mutationService.addMutation(req.body.dna, hasMutation);
    }
    if (!hasMutation) res.sendStatus(403);
    else res.json();
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
