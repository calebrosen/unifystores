const express = require('express');
const router = express.Router();
const controller = require('../controllers/countriesController');

// Getting subsections
router.get('/getSubsections', controller.getSubsections);

// Enabling/Disabling country on selected store
router.post('/editCountryOnStore', controller.editCountryOnStore);

router.get('/viewEnabledCountries', controller.viewEnabledCountries);

router.post('/disableCountry', controller.disableCountry);

router.get('/getCountries', controller.getCountries);

module.exports = router;
