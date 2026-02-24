const FoodItem = require('../models/FoodItem');

// @GET /api/restaurants/:id/foods — public
const getFoods = async (req, res) => {
    const foods = await FoodItem.find({ restaurantId: req.params.id, isAvailable: true });
    res.json(foods);
};

// @GET /api/admin/restaurants/:id/foods — admin (all)
const getAllFoods = async (req, res) => {
    const foods = await FoodItem.find({ restaurantId: req.params.id });
    res.json(foods);
};

// @POST /api/admin/restaurants/:id/foods — admin
const createFood = async (req, res) => {
    const { name, price, category, isAvailable } = req.body;
    if (!req.file) return res.status(400).json({ message: 'Image is required' });

    const food = await FoodItem.create({
        restaurantId: req.params.id,
        name,
        image: req.file.path,
        price: Number(price),
        category,
        isAvailable: isAvailable !== undefined ? isAvailable : true,
    });
    res.status(201).json(food);
};

// @PUT /api/admin/foods/:id — admin
const updateFood = async (req, res) => {
    const food = await FoodItem.findById(req.params.id);
    if (!food) return res.status(404).json({ message: 'Food item not found' });

    const { name, price, category, isAvailable } = req.body;
    food.name = name || food.name;
    food.price = price !== undefined ? Number(price) : food.price;
    food.category = category || food.category;
    if (isAvailable !== undefined) food.isAvailable = isAvailable === 'true' || isAvailable === true;
    if (req.file) food.image = req.file.path;

    const updated = await food.save();
    res.json(updated);
};

// @DELETE /api/admin/foods/:id — admin
const deleteFood = async (req, res) => {
    const food = await FoodItem.findByIdAndDelete(req.params.id);
    if (!food) return res.status(404).json({ message: 'Food item not found' });
    res.json({ message: 'Food item deleted' });
};

// @GET /api/restaurants/popular-foods — public
const getPopularFoods = async (req, res) => {
    // get a few foods and populate restaurant details
    const foods = await FoodItem.find({ isAvailable: true })
        .populate('restaurantId', 'name')
        .limit(8);
    res.json(foods);
};

// @GET /api/admin/foods — admin (all global foods)
const getAllFoodsGlobal = async (req, res) => {
    const foods = await FoodItem.find().populate('restaurantId', 'name');
    res.json(foods);
};

// @POST /api/admin/foods — admin (create food with restaurant selection)
const createFoodGlobal = async (req, res) => {
    const { restaurantId, name, price, category, isAvailable } = req.body;
    if (!req.file) return res.status(400).json({ message: 'Image is required' });
    if (!restaurantId) return res.status(400).json({ message: 'Restaurant ID is required' });

    const food = await FoodItem.create({
        restaurantId,
        name,
        image: req.file.path,
        price: Number(price),
        category,
        isAvailable: isAvailable !== undefined ? isAvailable : true,
    });

    // Populate before returning so frontend gets restaurant name immediately
    await food.populate('restaurantId', 'name');
    res.status(201).json(food);
};

module.exports = {
    getFoods, getAllFoods, createFood, updateFood, deleteFood, getPopularFoods,
    getAllFoodsGlobal, createFoodGlobal
};
