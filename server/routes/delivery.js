const express = require('express');
const router = express.Router();
const { getAssignedOrders, updateDeliveryStatus } = require('../controllers/deliveryController');
const { protect } = require('../middleware/auth');

// Middleware to check for delivery role
const isDelivery = (req, res, next) => {
    if (req.user && req.user.role === 'delivery') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Delivery role required.' });
    }
};

router.use(protect, isDelivery);

router.get('/orders', getAssignedOrders);
router.patch('/order/:orderId/status', updateDeliveryStatus);

module.exports = router;
