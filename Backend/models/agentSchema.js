//Define agentSchema
const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema({
    name: { type: String, 
        required: true,
         unique: true },
    email: { type: String,
         required: true,
          unique: true },
    phone: { type: String, 
        required: true,
         unique: true },
    password: { type: String,
         required: true,
          unique: true }
});

const Agent = mongoose.model('Agent', agentSchema);
module.exports = Agent;
