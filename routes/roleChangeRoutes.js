const express = require('express');
const router = express.Router();
const roleChangeController = require('../controllers/roleChangeController');
const auth = require('../middlewares/auth');

router.post('/change-role/volunteer', auth(['donor']), roleChangeController.changeRoleToVolunteer);
router.post('/change-role/donor', auth(['volunteer']), roleChangeController.changeRoleToDonor);
router.post('/change-role/request-coordinator', auth(['donor','volunteer','coordinator']), roleChangeController.requestChangeRoleToCoordinator);
router.get('/role-change-requests', auth(['coordinator']), roleChangeController.getAllRoleChangeRequests);
router.post('/change-role/handle-request', auth(['coordinator']), roleChangeController.handleRoleChangeRequest);

module.exports = router;
