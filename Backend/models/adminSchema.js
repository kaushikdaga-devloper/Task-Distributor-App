//Define the schema for admin login.
const mongoose = require('mongoose');
const adminSchema = new mongoose.Schema({
    email: { type: String, 
        required: true,
         unique: true },
    password: { type: String, 
        required: true, 
        unique: true }
});
const admin = mongoose.model('Admin', adminSchema);
module.exports = admin;