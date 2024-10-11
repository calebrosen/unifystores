const express = require('express');
const router = express.Router();
const controller = require('../controllers/customersController');

// Getting subsections
router.get('/getCustomerGroupSubsections', controller.getCustomerGroupSubsections);

// Pulling customer groups
router.get('/viewEditCustomerGroupName', controller.viewEditCustomerGroupName);

// Post for updating customer groups
router.post('/editCustomerGroupName', controller.editCustomerGroupName);

// Adding new to OCMaster
router.post('/addNewCustomerGroup', controller.addNewCustomerGroup);

// Pushing groups / changes to individual stores
router.get('/pushCustomerGroups', controller.pushCustomerGroups);

module.exports = router;
