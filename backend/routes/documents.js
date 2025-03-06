const express = require('express');
const router = express.Router();
const controller = require('../controllers/documentsController');

// Getting all sections
router.get('/getSubsections', controller.getSubsections);

// Getting paths
router.get('/getFilePaths', controller.getFilePaths);

module.exports = router;
