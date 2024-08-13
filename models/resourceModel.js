const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  type: { type: String, required: true, unique: true },
  quantity: { type: Number, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  status: { type: String, enum: ['available', 'assigned', 'delivered'], default: 'available' },
  donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const Resource = mongoose.model('Resource', resourceSchema);

module.exports = Resource;
