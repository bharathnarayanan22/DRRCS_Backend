const mongoose = require('mongoose');

const roleChangeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  currentRole: { type: String, required: true },
  requestedRole: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

const RoleChange = mongoose.model('RoleChangeRequest', roleChangeSchema);
module.exports = RoleChange;
