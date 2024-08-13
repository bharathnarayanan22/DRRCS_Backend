const Request = require('../models/requestModel');
const Response = require('../models/responseModel');
const User =require("../models/userModel")

const createRequest = async (req, res) => {
  const { type, quantity, location } = req.body;
  const coordinator = req.user._id;

  try {
    const request = new Request({ type, quantity, location, coordinator });
    await request.save();
    res.json(request);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

const getRequests = async (req, res) => {
  try {
    const requests = await Request.find().populate('coordinator', ['name', 'email']);
    res.json(requests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// const respondToRequest = async (req, res) => {
//   const { requestId } = req.params;
//   const { resourceId, message } = req.body;
//   const donor = req.user._id;

//   try {
//     const request = await Request.findById(requestId);
//     if (!request) {
//       return res.status(404).json({ message: 'Request not found' });
//     }

//     const response = new Response({ requestId, donor, resource: resourceId, message });
//     await response.save();

//     request.responses.push(response._id);
//     request.status = 'accepted'; // Update the request status to 'accepted'
//     await request.save();

//     res.json(response);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// };
const respondToRequest = async (req, res) => {
  const { requestId } = req.params;
  const { type, quantity, location, message } = req.body;
  const donor = req.user._id;

  try {
    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    const response = new Response({
      requestId,
      donor,
      resource: {
        type,
        quantity,
        location,
      },
      message,
    });

    await response.save();

    request.responses.push(response._id);
    request.status = 'accepted'; 
    await request.save();

    const user = await User.findById(donor);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.responses.includes(response._id)) {
      return res.status(400).json({ message: 'Resource already associated with user' });
    }

    user.responses.push(response._id);
    await user.save();

    res.json(response);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


const getRequestResponses = async (req, res) => {
  const { requestId } = req.params;

  try {
    const request = await Request.findById(requestId).populate({
      path: 'responses',
      populate: [
        { path: 'donor', select: ['name', 'email'] },
        { path: 'resource', select: ['type'] }
      ]
    });

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.json(request.responses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

module.exports = { createRequest, getRequests, respondToRequest, getRequestResponses };

