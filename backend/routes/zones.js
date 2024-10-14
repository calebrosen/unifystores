const express = require('express');
const router = express.Router();
const controller = require('../controllers/zonesController');

// Getting all sections
router.get('/getZonesSubsections', controller.getZonesSubsections);

// get all zones
router.get('/getZones', controller.getZones);

// get enabled zones only
router.get('/viewEnabledZones', controller.viewEnabledZones);

// disable zone
router.post('/disableZone', controller.disableZone);

// editing zone on selected store (status only)
router.post('/editZonesOnStore', controller.editZonesOnStore);

module.exports = router;
