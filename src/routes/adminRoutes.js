const express = require('express');
const adminController = require('../controllers/adminController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(authenticate, authorizeRoles('admin'));

router.get('/members', adminController.getMembers);
router.put('/members/:id', adminController.updateMember);
router.patch('/members/:id/deactivate', adminController.deactivateMember);
router.post('/contributions', adminController.recordContribution);
router.get('/contributions', adminController.getAllContributions);
router.get('/welfare', adminController.getAllWelfareRequests);
router.patch('/welfare/:id/status', adminController.updateWelfareStatus);
router.get('/reports', adminController.reports);

module.exports = router;
