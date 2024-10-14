const express = require('express');
const router = express.Router();
const controller = require('../controllers/salesAgentsController');

// Getting all sections
router.get('/getSalesagentSubsections', controller.getSalesagentSubsections);

// Getting salesagents
router.get('/getSalesAgents', controller.getSalesAgents);

// Adding new to local
router.post('/addNewSalesAgent', controller.addNewSalesAgent);

// Editing local
router.post('/EditSalesAgent', controller.EditSalesAgent);

// Importing to store
router.post('/ImportSalesAgents', controller.ImportSalesAgents);

module.exports = router;
