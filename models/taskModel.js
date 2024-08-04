const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  description: { type: String, required: true },
  status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
  volunteersNeeded: { type: Number, required: true },
  volunteers: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['accepted', 'declined', 'pending'], default: 'pending' }
  }],
  coordinator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startLocation: { type: String },
  endLocation: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
