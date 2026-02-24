require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const connectDB = require('./config/db');

const createAdmin = async () => {
    try {
        await connectDB();

        // Define admin details here
        const adminEmail = 'admin@chatori.com';
        const adminPassword = 'admin123';
        const adminName = 'Admin';

        // Check if admin already exists
        const adminExists = await User.findOne({ email: adminEmail });

        if (adminExists) {
            console.log('Admin user already exists!');
        } else {
            // Create new admin user
            const adminUser = await User.create({
                name: adminName,
                email: adminEmail,
                password: adminPassword,
                role: 'admin' // Setting role to admin
            });

            console.log(`Admin user created successfully: ${adminUser.email}`);
        }

        // Define delivery boy details here
        const deliveryEmail = 'delivery@chatori.com';
        const deliveryPassword = 'delivery123';
        const deliveryName = 'Delivery Boy';

        // Check if delivery boy already exists
        const deliveryExists = await User.findOne({ email: deliveryEmail });

        if (deliveryExists) {
            console.log('Delivery boy already exists!');
        } else {
            // Create new delivery boy
            const deliveryUser = await User.create({
                name: deliveryName,
                email: deliveryEmail,
                password: deliveryPassword,
                role: 'delivery' // Setting role to delivery
            });

            console.log(`Delivery boy created successfully: ${deliveryUser.email}`);
        }

        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

createAdmin();
