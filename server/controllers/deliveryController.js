const Order = require('../models/Order');

// Get orders assigned to the delivery boy
const getAssignedOrders = async (req, res, next) => {
    try {
        // In a real app, orders would have a deliveryBoy field
        // For now, we fetch orders with status 'Ready' or 'Out for Delivery'
        const orders = await Order.find({
            status: { $in: ['Ready', 'Out for Delivery', 'Delivered'] }
        }).select('-deliveryOtp').populate('userId', 'name address mobile').sort('-createdAt');

        res.json(orders);
    } catch (err) {
        next(err);
    }
};

// Update delivery status
const updateDeliveryStatus = async (req, res, next) => {
    try {
        const { orderId } = req.params;
        const { status, otp } = req.body;

        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        if (order.status === 'Delivered' || order.status === 'Cancelled') {
            return res.status(400).json({ message: 'Order is already finalized' });
        }

        // Logic for Delivered status - verify OTP
        if (status === 'Delivered') {
            if (!otp) {
                return res.status(400).json({ message: 'OTP is required to complete delivery' });
            }
            if (otp !== order.deliveryOtp) {
                return res.status(400).json({ message: 'Invalid OTP. Please check with customer.' });
            }
        }

        if (!['Out for Delivery', 'Delivered'].includes(status)) {
            return res.status(400).json({ message: 'Invalid delivery status' });
        }

        order.status = status;
        await order.save();

        res.json(order);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getAssignedOrders,
    updateDeliveryStatus
};
