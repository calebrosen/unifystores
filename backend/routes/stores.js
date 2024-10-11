const express = require('express');
const router = express.Router();
const controller = require('../controllers/storesController');

// Getting all stores
router.get('/getStores', controller.getAllStores);

module.exports = router;
