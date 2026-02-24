const express = require('express');
const router = express.Router();
const { getRestaurants } = require('../controllers/restaurantController');
const { getFoods, getPopularFoods } = require('../controllers/foodController');

router.get('/', getRestaurants);
router.get('/popular-foods', getPopularFoods);
router.get('/:id/foods', getFoods);

module.exports = router;
