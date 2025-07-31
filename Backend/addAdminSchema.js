// used to add/reset the admin in the database
require('dotenv').config(); // To load the MONGO_URI
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // <-- Use bcryptjs to match your controller
const Admin = require('./models/adminSchema');

const resetAdmin = async () => {
  try {
    // 1. Connect to the database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');

    // 2. Delete the old admin to prevent duplicate errors
    await Admin.deleteOne({ email: 'admin@example.com' });
    console.log('Existing admin user removed.');

    // 3. Hash the password with bcryptjs
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin@123', salt); // The password is 'admin@123'

    // 4. Create the new admin with the correctly hashed password
    await Admin.create({
      email: 'admin@example.com',
      password: hashedPassword,
    });

    console.log('✅ Admin user created successfully!');
    
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    // 5. Disconnect from the database
    await mongoose.disconnect();
    console.log('MongoDB Disconnected.');
  }
};

resetAdmin();