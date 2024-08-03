const express = require('express');
const Router = express.Router();
const auth = require('../middlewares/auth');
const { createTask, getTasks, updateTaskStatus, acceptTask } = require('../controllers/taskController');

Router.post('/createTask', auth(['coordinator']), createTask);
Router.get('/getTask', getTasks);
Router.put('/acceptTask/:id', auth(['volunteer']), acceptTask)
// Router.put('/updateTask/:id', auth, updateTask);
Router.put('/updateTaskStatus/:id', auth(['coordinator', 'volunteeer']), updateTaskStatus);

module.exports = Router;