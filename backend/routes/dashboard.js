const express = require('express');
const router = express.Router();
const controller = require('../controllers/dashboardController');

router.get('/mainDashboard', controller.mainDashboard);



module.exports = router;
