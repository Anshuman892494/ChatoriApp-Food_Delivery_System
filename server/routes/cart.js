const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getCart, addToCart, updateCartItem, removeCartItem, clearCart, reorderItems } = require('../controllers/cartController');

router.use(protect);
router.get('/', getCart);
router.post('/', addToCart);
router.post('/reorder', reorderItems);
router.put('/:itemId', updateCartItem);
router.delete('/clear', clearCart);
router.delete('/:itemId', removeCartItem);

module.exports = router;
