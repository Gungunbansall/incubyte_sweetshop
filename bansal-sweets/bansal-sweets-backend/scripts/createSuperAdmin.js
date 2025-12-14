const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const createSuperAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bansalsweets');
    
    const existingAdmin = await User.findOne({ email: 'admin@bansalsweets.com' });
    
    if (existingAdmin) {
      console.log('Super admin already exists');
      process.exit(0);
    }

    const superAdmin = new User({
      username: 'admin',
      email: 'admin@bansalsweets.com',
      password: 'admin123',
      role: 'admin'
    });

    await superAdmin.save();
    console.log('Super admin created successfully');
    console.log('Email: admin@bansalsweets.com');
    console.log('Password: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating super admin:', error);
    process.exit(1);
  }
};

createSuperAdmin();
