var express = require('express');
var router = express.Router();
const { MutationsService } = require('../services/mutations.service');
const _mutationService = new MutationsService(4);

router.post('/', async function (req, res, next) {
  try {
    await _mutationService.checkAndSaveMutation(req.body.dna)
    res.json();
  } catch (error) {
    res.status(error.status).send(error.message);
  }
});

module.exports = router;
