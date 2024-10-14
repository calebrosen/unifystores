const express = require('express');
const router = express.Router();
const controller = require('../controllers/stockStatusController');

// Getting all sections
router.get('/getStockstatusSubsections', controller.getStockstatusSubsections);

/* Not in use (yet)
router.post('/updateStockStatusName', controller.updateStockStatusName);
*/

// Pushing to stores
router.post('/addNewStockStatus', controller.addNewStockStatus);

// Adding new to local
router.post('/addNewStockStatus', controller.addNewStockStatus);

// Editing local
router.get('/viewEditStockStatusName', controller.viewEditStockStatusName);

// pushing to store
router.post('/pushStockStatus', controller.pushStockStatus);

module.exports = router;
