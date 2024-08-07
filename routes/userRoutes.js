const express = require('express');
const { register, login, getVolunteers, getDonors, getVolunteersAndDonors } = require('../controllers/userController');
const auth = require('../middlewares/auth');

const Router = express.Router();

Router.post('/register', register);
Router.post('/login', login);
Router.get('/volunteers', auth(['coordinator']), getVolunteers);
Router.get('/donors', auth(['coordinator']), getDonors);
Router.get('/VolunteersAndDonors', auth(['coordinator']), getVolunteersAndDonors);

module.exports = Router;
