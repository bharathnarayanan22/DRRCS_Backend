const express = require('express');
const Router = express.Router();
const auth = require('../middlewares/auth');
const { getResponses } = require('../controllers/responseController');

Router.get('/getResponses', getResponses);

module.exports = Router;
