const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const { adminLogin } = require('../controllers/authController');
const { upload } = require('../config/cloudinary');
const {
    getAllRestaurants, createRestaurant, updateRestaurant, deleteRestaurant,
} = require('../controllers/restaurantController');
const {
    getAllFoods, createFood, updateFood, deleteFood,
    getAllFoodsGlobal, createFoodGlobal
} = require('../controllers/foodController');
const { getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { getAllUsers } = require('../controllers/userController');

// Admin auth
router.post('/login', adminLogin);

// Restaurant CRUD
router.get('/restaurants', protect, adminOnly, getAllRestaurants);
router.post('/restaurants', protect, adminOnly, upload.single('image'), createRestaurant);
router.put('/restaurants/:id', protect, adminOnly, upload.single('image'), updateRestaurant);
router.delete('/restaurants/:id', protect, adminOnly, deleteRestaurant);

// Food CRUD
router.get('/restaurants/:id/foods', protect, adminOnly, getAllFoods);
router.post('/restaurants/:id/foods', protect, adminOnly, upload.single('image'), createFood);

// Global Food CRUD (Items tab)
router.get('/foods', protect, adminOnly, getAllFoodsGlobal);
router.post('/foods', protect, adminOnly, upload.single('image'), createFoodGlobal);
router.put('/foods/:id', protect, adminOnly, upload.single('image'), updateFood);
router.delete('/foods/:id', protect, adminOnly, deleteFood);

// Orders
router.get('/orders', protect, adminOnly, getAllOrders);
router.put('/orders/:id/status', protect, adminOnly, updateOrderStatus);

// Users
router.get('/users', protect, adminOnly, getAllUsers);

module.exports = router;
