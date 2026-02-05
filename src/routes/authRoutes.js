const express = require('express');
const { registerMember, login } = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/login', login);
router.post('/register', authenticate, authorizeRoles('admin'), registerMember);

module.exports = router;
