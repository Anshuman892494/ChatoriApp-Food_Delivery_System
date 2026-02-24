const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { createOrder, getUserOrders } = require('../controllers/orderController');

router.use(protect);
router.post('/', createOrder);
router.get('/user', getUserOrders);

module.exports = router;
