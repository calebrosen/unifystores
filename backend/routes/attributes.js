const express = require('express');
const router = express.Router();
const controller = require('../controllers/attributeController');

// Getting all sections
router.get('/getAttributeSections', controller.getAttributeSections);

// Getting all individual attributes
router.get('/getAttributes', controller.getAttributes);

// Getting all products on OCMaster with selected attribute
router.post('/getProductsForAttributeCopy', controller.getProductsForAttributeCopy);

// Previewing products on the selected store that will receive the selected attribute (matched by Model and MPN)
router.post('/previewProductsForAttributeCopy', controller.previewProductsForAttributeCopy);

module.exports = router;
