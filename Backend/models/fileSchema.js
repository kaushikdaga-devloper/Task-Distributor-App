//Define fileSchema
const mongoose = require('mongoose');
const taskSchema = new mongoose.Schema({
    firstName: { type: String,
         required: true },
    phone: { type: String, 
        required: true },
    notes: { type: String},
    assignedTo:{type: mongoose.Schema.Types.ObjectId, 
        ref: 'Agent',
        required: true},
});
const Task = mongoose.model('Task', taskSchema);
module.exports = Task;