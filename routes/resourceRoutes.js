const express = require('express');
const Router = express.Router();
const auth = require('../middlewares/auth');
const resourceController = require('../controllers/resourceController');

Router.post('/createResource', auth, resourceController.createResource);
Router.get('/getResource', resourceController.getResources);
Router.put('/updateResource/:id', auth, resourceController.updateResource);
Router.put('/updateResourceStatus/:id', auth, resourceController.updateResourceStatus);
Router.delete('/deleteResource/:id', auth, resourceController.deleteResource);

module.exports = Router;
