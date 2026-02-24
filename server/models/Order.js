const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem' },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    image: { type: String },
});

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    deliveryAddress: { type: String, required: true },
    paymentMethod: { type: String, enum: ['COD', 'Online'], required: true },
    paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed', 'COD'], default: 'Pending' },
    razorpayOrderId: { type: String, default: '' },
    razorpayPaymentId: { type: String, default: '' },
    status: {
        type: String,
        enum: ['Pending', 'Preparing', 'Ready', 'Out for Delivery', 'Delivered', 'Cancelled'],
        default: 'Pending',
    },
    deliveryOtp: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
