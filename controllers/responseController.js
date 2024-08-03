const Response = require('../models/responseModel');

const getResponses = async (req, res) => {
  try {
    const responses = await Response.find().populate('requestId', ['type', 'quantity', 'location']).populate('donor', ['name', 'email']);
    res.json(responses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

module.exports = { getResponses };
