const express = require('express');
const router = express.Router();
const controller = require('../controllers/ordersController');

// Getting all sections
router.get('/getOrderStatusSubsections', controller.getOrderStatusSubsections);

// Add new order status
router.post('/addNewOrderStatus', controller.addNewOrderStatus);

// Pushing to store
router.post('/pushOrderStatus', controller.pushOrderStatus);

// Loading all
router.get('/viewEditOrderStatusName', controller.viewEditOrderStatusName);

// Changing name on local table
router.post('/updateOrderStatusName', controller.updateOrderStatusName);


module.exports = router;
