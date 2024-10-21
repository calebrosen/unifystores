const express = require('express');
const router = express.Router();
const controller = require('../controllers/filtersController');


// Getting all sections
router.get('/getFiltersSections', controller.getFiltersSections);


module.exports = router;
