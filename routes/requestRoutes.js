const express = require('express');
const Router = express.Router();
const auth = require('../middlewares/auth');
const requestController = require('../controllers/requestController');

Router.post('/respondToRequest/:requestId', auth(['donor']), requestController.respondToRequest);
Router.post('/createRequest', auth(['coordinator']), requestController.createRequest);
Router.get('/getRequests', requestController.getRequests);

module.exports = Router;