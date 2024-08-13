const express = require('express');
const Router = express.Router();
const auth = require('../middlewares/auth');
const { getResponses, getMyResponses } = require('../controllers/responseController');

Router.get('/getResponses', getResponses);
Router.get('/myResponses', auth(['donor']),getMyResponses);

module.exports = Router;
