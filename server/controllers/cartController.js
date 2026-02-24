const Cart = require('../models/Cart');

// @GET /api/cart
const getCart = async (req, res) => {
    try {
        if (!req.user) {
            console.error('getCart error: req.user is undefined');
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const cart = await Cart.findOne({ userId: req.user._id });
        res.json(cart || { items: [] });
    } catch (error) {
        console.error('getCart error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @POST /api/cart — add item
const addToCart = async (req, res) => {
    const { foodId, name, image, price, quantity } = req.body;
    let cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
        cart = await Cart.create({ userId: req.user._id, items: [] });
    }

    const existingItem = cart.items.find((i) => i.foodId.toString() === foodId);
    if (existingItem) {
        existingItem.quantity += quantity || 1;
    } else {
        cart.items.push({ foodId, name, image, price, quantity: quantity || 1 });
    }

    await cart.save();
    res.json(cart);
};

// @PUT /api/cart/:itemId — update quantity
const updateCartItem = async (req, res) => {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const item = cart.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ message: 'Item not found in cart' });

    item.quantity = quantity;
    await cart.save();
    res.json(cart);
};

// @DELETE /api/cart/:itemId — remove item
const removeCartItem = async (req, res) => {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter((i) => i._id.toString() !== req.params.itemId);
    await cart.save();
    res.json(cart);
};

// @DELETE /api/cart — clear cart
const clearCart = async (req, res) => {
    await Cart.findOneAndUpdate({ userId: req.user._id }, { items: [] });
    res.json({ message: 'Cart cleared' });
};

// @POST /api/cart/reorder — clear and add multiple items
const reorderItems = async (req, res) => {
    const { items } = req.body;
    let cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
        cart = await Cart.create({ userId: req.user._id, items: [] });
    }

    // Set items (replaces current cart)
    cart.items = items.map(item => ({
        foodId: item.foodId,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity || 1
    }));

    await cart.save();
    res.json(cart);
};

module.exports = { getCart, addToCart, updateCartItem, removeCartItem, clearCart, reorderItems };
