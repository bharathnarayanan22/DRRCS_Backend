// const mongoose = require('mongoose');

// const responseSchema = new mongoose.Schema({
//   requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Request', required: true },
//   donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   resource: { type: mongoose.Schema.Types.ObjectId, ref: 'Resource', required: true },
//   message: { type: String },
// });

// const Response = mongoose.model('Response', responseSchema);

// module.exports = Response;

const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Request', required: true },
  donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  resource: {
    type: { type: String, required: true },
    quantity: { type: Number, required: true },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
  },
  message: { type: String },
});

const Response = mongoose.model('Response', responseSchema);

module.exports = Response;
