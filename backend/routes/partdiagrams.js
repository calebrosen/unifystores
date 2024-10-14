const express = require('express');
const router = express.Router();
const controller = require('../controllers/partDiagramsController');

// Getting all sections
router.get('/getPartDiagramsSubsections', controller.getPartDiagramsSubsections);

// Pushing to store
router.post('/pushPartDiagrams', controller.pushPartDiagrams);

module.exports = router;
