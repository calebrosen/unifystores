const express = require('express');
const router = express.Router();
const controller = require('../controllers/productsController');

// Getting subsections
router.get('/getProductSubsections', controller.getProductSubsections);

// Procedure to refetch OC Master products
router.get('/getProductsToCopy', controller.getProductsToCopy);

router.post('/getProductsForViewingCopy', controller.getProductsForViewingCopy);

router.post('/truncateSelectedProductsToCopyTable', controller.truncateSelectedProductsToCopyTable);

router.post('/insertIntoSelectedProductsToCopy', controller.insertIntoSelectedProductsToCopy);

router.post('/CopyProducts_GetTargetData', controller.CopyProducts_GetTargetData);

router.post('/CopyProducts_GetProductsToCopy', controller.CopyProducts_GetProductsToCopy);

router.post('/CopyProducts_CopyProductsToStore', controller.CopyProducts_CopyProductsToStore);

router.post('/CopyProducts_CopyImagesToStore', controller.CopyProducts_CopyImagesToStore);

router.post('/CopyProducts_CopyImagesToStore_Action', controller.CopyProducts_CopyImagesToStore_Action);

router.get('/RefetchOCMasterTables', controller.RefetchOCMasterTables);

router.get('/CopyProducts_CopyImagesToStore_Action', controller.CopyProducts_CopyImagesToStore_Action);



module.exports = router;