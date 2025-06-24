const express = require('express');
const router = express.Router();
const controller = require('../controllers/filtersController');


// Getting all sections
router.get('/getFiltersSections', controller.getFiltersSections);

// updating category filter logic table
router.get('/updateCategoryFilterLogicTable', controller.updateCategoryFilterLogicTable);

// getting category filter logic table
router.get('/getCategoryFilterLogicTable', controller.getCategoryFilterLogicTable);

// getting filter group names for category
router.post('/getFilterGroupNamesForCategory', controller.getFilterGroupNamesForCategory);

// getting all filter groups
router.get('/getAllFilterGroups', controller.getAllFilterGroups);

// getting filter groups by category ID
router.post('/getFilterGroupsByCategoryID', controller.getFilterGroupsByCategoryID);

// getting all filter groups
router.get('/getAllCategoriesWithFilterGroups', controller.getAllCategoriesWithFilterGroups);

// save category filter
router.post('/saveCategoryFilter', controller.saveCategoryFilter);




module.exports = router;
