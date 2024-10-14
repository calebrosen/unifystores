const express = require('express');
const router = express.Router();
const controller = require('../controllers/informationController');

// Getting all sections
router.get('/getInformationSubsections', controller.getInformationSubsections);

// Loading all information pages
router.get('/viewEditInformation', controller.viewEditInformation);

// Saving
router.post('/saveInformation', controller.saveInformation);

// Pushing to store
router.post('/pushInformation', controller.pushInformation);

module.exports = router;
