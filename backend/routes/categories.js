const express = require('express');
const router = express.Router();
const controller = require('../controllers/categoriesController');

// Getting all sections
router.get('/getCategoriesSubsections', controller.getCategoriesSubsections);

router.get('/fetchOCMasterCategories', controller.fetchOCMasterCategories);

router.post('/InsertCategoryIDsToCopy', controller.InsertCategoryIDsToCopy);

router.get('/GenerateCategoriesForPreviews', controller.GenerateCategoriesForPreviews);

module.exports = router;
