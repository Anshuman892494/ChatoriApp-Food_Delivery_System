const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// @POST /api/auth/register
const register = async (req, res, next) => {
    try {
        const { name, email, mobile, password } = req.body;
        if (!name || !email || !mobile || !password)
            return res.status(400).json({ message: 'Name, email, mobile and password are required' });

        const emailExists = await User.findOne({ email });
        if (emailExists) return res.status(400).json({ message: 'Email already in use' });

        const mobileExists = await User.findOne({ mobile });
        if (mobileExists) return res.status(400).json({ message: 'Mobile number already registered' });

        const user = await User.create({ name, email, mobile, password });
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            mobile: user.mobile,
            role: user.role,
            token: generateToken(user._id),
        });
    } catch (err) {
        next(err);
    }
};

// @POST /api/auth/login  (identifier = email OR mobile)
const login = async (req, res, next) => {
    try {
        const { identifier, password } = req.body;
        if (!identifier || !password)
            return res.status(400).json({ message: 'Identifier and password are required' });

        const user = await User.findOne({
            $or: [{ email: identifier.toLowerCase() }, { mobile: identifier }]
        });
        if (!user || !user.password || !(await user.comparePassword(password)))
            return res.status(401).json({ message: 'Invalid credentials' });

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            mobile: user.mobile,
            role: user.role,
            token: generateToken(user._id),
        });
    } catch (err) {
        next(err);
    }
};

// @POST /api/admin/login
const adminLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password)))
            return res.status(401).json({ message: 'Invalid credentials' });
        if (user.role !== 'admin')
            return res.status(403).json({ message: 'Not authorized as admin' });

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } catch (err) {
        next(err);
    }
};

// @POST /api/auth/google  — Firebase Google Sign-In
const googleAuth = async (req, res, next) => {
    try {
        const { uid, name, email, avatar } = req.body;
        if (!uid || !email) return res.status(400).json({ message: 'Invalid Google credentials' });

        // Find existing user or create a new one
        let user = await User.findOne({ email });

        if (user) {
            // Update googleId/avatar if signing in with Google for first time
            if (!user.googleId) {
                user.googleId = uid;
                user.avatar = avatar;
                await user.save();
            }
        } else {
            // New Google user — no password needed
            user = await User.create({ name, email, googleId: uid, avatar });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            token: generateToken(user._id),
        });
    } catch (err) {
        next(err);
    }
};

// @PUT /api/auth/profile
const updateUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.mobile = req.body.mobile || user.mobile;

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                mobile: updatedUser.mobile,
                role: updatedUser.role,
                token: generateToken(updatedUser._id),
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        next(err);
    }
};

module.exports = { register, login, adminLogin, googleAuth, updateUserProfile };

