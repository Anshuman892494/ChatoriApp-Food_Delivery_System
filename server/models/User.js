const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String },
    mobile: { type: String },   // required for email/password users (enforced in controller)
    googleId: { type: String },
    avatar: { type: String },
    role: { type: String, enum: ['user', 'admin', 'delivery'], default: 'user' },
}, { timestamps: true });

userSchema.index({ mobile: 1 }, { unique: true, sparse: true }); // Consolidated unique sparse index

userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
