const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  type: { type: String, required: true },
  quantity: { type: Number, required: true },
  location: { type: String, required: true },
  status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' },
  coordinator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  responses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Response' }],
});

const Request = mongoose.model('Request', requestSchema);

module.exports = Request;