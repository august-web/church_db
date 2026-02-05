const express = require('express');
const memberController = require('../controllers/memberController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(authenticate, authorizeRoles('member'));

router.get('/profile', memberController.getMyProfile);
router.get('/contributions', memberController.getMyContributions);
router.get('/welfare', memberController.getMyWelfare);
router.post('/welfare', memberController.createWelfareRequest);

module.exports = router;
