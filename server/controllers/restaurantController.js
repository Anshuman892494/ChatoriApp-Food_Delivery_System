const Restaurant = require('../models/Restaurant');

// @GET /api/restaurants — public
const getRestaurants = async (req, res) => {
    const restaurants = await Restaurant.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(restaurants);
};

// @GET /api/admin/restaurants — admin (all)
const getAllRestaurants = async (req, res) => {
    const restaurants = await Restaurant.find().sort({ createdAt: -1 });
    res.json(restaurants);
};

// @POST /api/admin/restaurants — admin
const createRestaurant = async (req, res) => {
    const { name, description, address, isActive } = req.body;
    if (!req.file) return res.status(400).json({ message: 'Image is required' });

    const restaurant = await Restaurant.create({
        name,
        image: req.file.path,
        description,
        address,
        isActive: isActive !== undefined ? isActive : true,
    });
    res.status(201).json(restaurant);
};

// @PUT /api/admin/restaurants/:id — admin
const updateRestaurant = async (req, res) => {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

    const { name, description, address, isActive } = req.body;
    restaurant.name = name || restaurant.name;
    restaurant.description = description || restaurant.description;
    restaurant.address = address || restaurant.address;
    if (isActive !== undefined) restaurant.isActive = isActive === 'true' || isActive === true;
    if (req.file) restaurant.image = req.file.path;

    const updated = await restaurant.save();
    res.json(updated);
};

// @DELETE /api/admin/restaurants/:id — admin
const deleteRestaurant = async (req, res) => {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
    res.json({ message: 'Restaurant deleted' });
};

module.exports = { getRestaurants, getAllRestaurants, createRestaurant, updateRestaurant, deleteRestaurant };
