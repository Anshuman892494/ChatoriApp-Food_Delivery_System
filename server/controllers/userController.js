const User = require('../models/User');

// @GET /api/admin/users — admin
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        console.error("userController Error:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getAllUsers };
