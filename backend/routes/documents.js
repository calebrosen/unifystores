const express = require("express");
const router = express.Router();
const controller = require("../controllers/documentsController");

// Getting all sections
router.get("/getSubsections", controller.getSubsections);

// Getting paths
router.get("/getDocuments", controller.getDocuments);

// Getting paths
router.post("/getFilteredDocuments", controller.getFilteredDocuments);

// Deleting document
router.post("/deleteDocument", controller.deleteDocument);

// Updating document
router.post("/updateDocument", controller.updateDocument);

// Adding new document
router.post("/addNewDocument", controller.addNewDocument);

// Getting all brands
router.get("/getBrands", controller.getBrands);

// Getting all file types
router.get("/getDocumentTypes", controller.getFileTypes);

// getting product display names
router.post("/getProductDisplayNames", controller.getProductDisplayNames);

// getting product display names
router.post("/getProductMPNs", controller.getProductMPNs);

// this is filling in dropdowns for add new document
router.post("/getDataForDocumentsDropdown", controller.getDataForDocumentsDropdown);

router.post("/createFolder", controller.createFolder);

router.post("/upload", controller.uploadDocument); // uses multer inside controller

router.post("/list", controller.list);

router.post("/createFolder", controller.createFolder);

module.exports = router;
