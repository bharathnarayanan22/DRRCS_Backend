const express = require('express');
const { register, login, getVolunteers, getDonors, getVolunteersAndDonors, getUserRole } = require('../controllers/userController');
const auth = require('../middlewares/auth');
const User = require('../models/userModel');

const Router = express.Router();

Router.post('/register', register);
Router.post('/login', login);
Router.get('/volunteers', auth(['coordinator']), getVolunteers);
Router.get('/donors', auth(['coordinator']), getDonors);
Router.get('/VolunteersAndDonors', auth(['coordinator']), getVolunteersAndDonors);
Router.get('/role',auth(['coordinator', 'volunteer','donor']) , getUserRole);
Router.put('/updateTasks/:taskId', auth(['volunteer']), async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      if (!user.tasks.includes(req.params.taskId)) {
        user.tasks.push(req.params.taskId);
        await user.save();
        res.status(200).json({ message: 'Task added to user profile' });
      } else {
        res.status(400).json({ message: 'Task already in user profile' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error updating user tasks' });
    }
  });


  Router.get('/profile', auth(['coordinator', 'volunteer','donor']), async (req, res) => {
    try {
      const user = await User.findById(req.user._id).populate('tasks');
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user profile' });
    }
  });

module.exports = Router;
