const express = require('express');
const router = express.Router();
const controller = require('../controllers/couponsController');

// Getting subsections
router.get('/getSubsections', controller.getSubsections);

// Getting sales agents
router.get('/fetchAgents', controller.fetchAgents);

// Creating coupon
router.post('/createCoupon', controller.createCoupon);

// Getting all coupons by store
router.post('/selectCoupons', controller.selectCoupons);

router.post('/updateCoupon', controller.updateCoupon);

router.post('/deleteCoupon', controller.deleteCoupon);

module.exports = router;
