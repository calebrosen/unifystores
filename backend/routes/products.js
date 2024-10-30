const express = require('express');
const router = express.Router();
const controller = require('../controllers/productsController');


/* PRODUCTS */

// Getting subsections
router.get('/getProductSubsections', controller.getProductSubsections);

// Loading OC Master products
router.get('/getProductsToCopy', controller.getProductsToCopy);

// Step 1 of copy products
router.post('/getProductsForViewingCopy', controller.getProductsForViewingCopy);

// Step 2 of copy products
router.post('/truncateSelectedProductsToCopyTable', controller.truncateSelectedProductsToCopyTable);

// Step 3 of copy products
router.post('/insertIntoSelectedProductsToCopy', controller.insertIntoSelectedProductsToCopy);

// Step 4 of copy products
router.post('/CopyProducts_GetTargetData', controller.CopyProducts_GetTargetData);

// Step 5 of copy products
router.post('/CopyProducts_GetProductsToCopy', controller.CopyProducts_GetProductsToCopy);

// Step 6 of copy products
router.post('/CopyProducts_CopyProductsToStore', controller.CopyProducts_CopyProductsToStore);

// Getting images that need to be copied
router.post('/CopyProducts_CopyImagesToStore', controller.CopyProducts_CopyImagesToStore);

// Calling NodeJS function that actually copies each image. This is called once per image (in a loop)
router.post('/CopyProducts_CopyImagesToStore_Action', controller.CopyProducts_CopyImagesToStore_Action);

// Procedure to refetch OC Master products
router.get('/RefetchOCMasterTables', controller.RefetchOCMasterTables);

// Loading products to release
router.post('/getProductsForRelease', controller.getProductsForRelease);

// Releasing product on selected store
router.post('/releaseProductOnStore', controller.releaseProductOnStore);


/* PRODUCT DESCRIPTIONS */

// Getting sections
router.get('/getProductDescriptionSubsections', controller.getProductDescriptionSubsections);

// loading the edit page
router.get('/viewEditProductDescription', controller.viewEditProductDescription);

// getting differences on selected product (in the modal)
router.post('/getProductDescDifferences', controller.getProductDescDifferences);

// saving to stores
router.post('/saveProductDescription', controller.saveProductDescription);

// refetching from OCMaster
router.post('/refetchProductDescriptions', controller.refetchProductDescriptions);

module.exports = router;