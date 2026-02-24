const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @POST /api/payment/create-order
const createRazorpayOrder = async (req, res) => {
    try {
        const { amount } = req.body;

        const options = {
            amount: Math.round(amount * 100), // paise
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);
        res.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            keyId: process.env.RAZORPAY_KEY_ID,
        });
    } catch (error) {
        console.error("Razorpay Create Order Error:", error);
        res.status(500).json({ message: 'Failed to create payment order' });
    }
};

// @POST /api/payment/verify
const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            if (orderId) {
                await Order.findByIdAndUpdate(orderId, {
                    paymentStatus: 'Failed',
                    status: 'Cancelled',
                });
            }
            return res.status(400).json({ message: 'Payment verification failed' });
        }

        // Signature valid — mark order as Paid
        const order = await Order.findByIdAndUpdate(
            orderId,
            {
                paymentStatus: 'Paid',
                razorpayPaymentId: razorpay_payment_id,
                razorpayOrderId: razorpay_order_id,
            },
            { new: true }
        );

        res.json({ message: 'Payment verified successfully', order });
    } catch (error) {
        console.error("Payment Verification Error:", error);
        res.status(500).json({ message: 'Payment verification error' });
    }
};

module.exports = { createRazorpayOrder, verifyPayment };
