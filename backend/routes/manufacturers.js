const express = require('express');
const router = express.Router();
const controller = require('../controllers/manufacturersController');

// Getting all sections
router.get('/getManufacturersSubsections', controller.getManufacturersSubsections);

// Add new manufacturer
router.post('/addNewManufacturer', controller.addNewManufacturer);

// Pushing to store
router.post('/pushManufacturer', controller.pushManufacturer);

// Loading all
router.post('/viewEditManufacturers', controller.viewEditManufacturers);

// Changing name on local table
router.post('/updateManufacturerName', controller.updateManufacturerName);


module.exports = router;
