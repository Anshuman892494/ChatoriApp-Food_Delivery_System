const Order = require('../models/Order');
const Cart = require('../models/Cart');

// @POST /api/orders — user places order
const createOrder = async (req, res) => {
    try {
        const { items, totalAmount, deliveryAddress, paymentMethod, razorpayOrderId } = req.body;

        if (!items || items.length === 0)
            return res.status(400).json({ message: 'Order must have items' });

        const deliveryOtp = Math.floor(100000 + Math.random() * 900000).toString();

        const order = await Order.create({
            userId: req.user._id,
            items,
            totalAmount,
            deliveryAddress,
            paymentMethod,
            paymentStatus: paymentMethod === 'COD' ? 'COD' : 'Pending',
            razorpayOrderId: razorpayOrderId || '',
            status: 'Pending',
            deliveryOtp,
        });

        // Clear cart after placing order
        await Cart.findOneAndUpdate({ userId: req.user._id }, { items: [] });

        res.status(201).json(order);
    } catch (error) {
        console.error("Create Order Error:", error);
        res.status(500).json({ message: 'Failed to create order' });
    }
};

// @GET /api/orders/user — user order history
const getUserOrders = async (req, res) => {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
};

// @GET /api/orders/admin — admin all orders
const getAllOrders = async (req, res) => {
    const orders = await Order.find()
        .populate('userId', 'name email')
        .sort({ createdAt: -1 });
    res.json(orders);
};

// @PUT /api/orders/:id/status — admin update status
const updateOrderStatus = async (req, res) => {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (['Delivered', 'Cancelled'].includes(order.status)) {
        return res.status(400).json({ message: `Cannot update order that is already ${order.status}` });
    }

    order.status = status;
    await order.save();
    res.json(order);
};

module.exports = { createOrder, getUserOrders, getAllOrders, updateOrderStatus };
