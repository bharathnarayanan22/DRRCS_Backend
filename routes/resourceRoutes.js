const express = require('express');
const Router = express.Router();
const auth = require('../middlewares/auth');
const resourceController = require('../controllers/resourceController');

Router.post('/createResource', auth(['donor', 'coordinator']), resourceController.createResource);
Router.get('/getResource', resourceController.getResources);
Router.put('/updateResource/:id', auth(['donor', 'coordinator']), resourceController.updateResource);
Router.put('/updateResourceStatus/:id', auth(['donor']), resourceController.updateResourceStatus);
Router.delete('/deleteResource/:id', auth(['donor','coordinator']), resourceController.deleteResource);
Router.get('/myResources', auth(['donor']), resourceController.getMyResources);

module.exports = Router;
