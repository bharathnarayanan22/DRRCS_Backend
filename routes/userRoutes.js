const express = require('express');
const { register, login, getVolunteers, getDonors, getVolunteersAndDonors, getUserRole, getUserProfile, deleteUser, userProfile } = require('../controllers/userController');
const auth = require('../middlewares/auth');

const Router = express.Router();

Router.post('/register', register);
Router.post('/login', login);
Router.get('/volunteers', auth(['coordinator']), getVolunteers);
Router.get('/donors', auth(['coordinator']), getDonors);
Router.get('/volunteersAndDonors', auth(['coordinator']), getVolunteersAndDonors);
Router.get('/role', auth(['coordinator', 'volunteer', 'donor']), getUserRole);
Router.delete('/deleteUser/:id', auth(['coordinator']), deleteUser);
Router.get('/profile', auth(['coordinator', 'volunteer', 'donor']), getUserProfile);
Router.get('/userProfile/:id', userProfile);

module.exports = Router;
