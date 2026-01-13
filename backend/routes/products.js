const express = require('express');
const router = express.Router();
const controller = require('../controllers/productsController');
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });


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


// Updating products
router.post('/updateProducts_updateProductsTo', controller.updateProductsTo);

router.post('/updateProducts_getProductsToUpdate', controller.getProductsToUpdate);

// Truncating product data table
router.post('/truncateSelectedProductsToUpdateTable', controller.truncateSelectedProductsToUpdateTable);

// Inserting products to update into table
router.post('/insertIntoSelectedProductsToUpdate', controller.insertIntoSelectedProductsToUpdate);




/* PRODUCT DESCRIPTIONS */

// Getting sections
router.get('/getProductDescriptionSubsections', controller.getProductDescriptionSubsections);

// getting differences on selected product (in the modal)
router.post('/getProductDescDifferences', controller.getProductDescDifferences);

// saving to stores
router.post('/saveProductDescription', controller.saveProductDescription);

// refetching from OCMaster
router.post('/refetchProductDescriptions', controller.refetchProductDescriptions);

// searching for product
router.post('/searchForProducts', controller.searchForProducts);

// getting product description fields
router.post('/GetProductDescriptionInfo', controller.GetProductDescriptionInfo);

// updating product description/name/meta
router.post('/UpdateProductDescriptionName', controller.UpdateProductDescriptionName);


/* DISCONTINUED PRODUCTS */

// Getting discontinued products
router.get('/GetDiscontinuedDisabledProducts', controller.DiscontinuedDisabledProducts);

// Updating discontinued products (reason or replaced by)
router.post('/UpdateDiscontinuedOrDisabledProducts', controller.UpdateDiscontinuedOrDisabledProducts);

// Adding discontinued product
router.post('/AddDiscontinuedOrDisabledProduct', controller.AddDiscontinuedOrDisabledProduct);

// Adding attachments
router.post(
  '/UploadDiscontinuedAttachments',
  upload.array("files"),
  controller.UploadDiscontinuedAttachments
);



/* PRODUCT PROMOTIONS */

// Getting product promotions
router.get('/GetProductPromotions', controller.GetProductPromotions);

// // Adding product promotion
router.post('/AddProductPromotion', controller.AddProductPromotion);

// Updating product promotion
router.post('/UpdateProductPromotion', controller.UpdateProductPromotion);

module.exports = router;