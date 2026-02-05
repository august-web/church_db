const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const { validateRegisterInput } = require('../utils/validators');

const registerMember = async (req, res) => {
  try {
    const payload = { ...req.body, role: req.body.role || 'member' };
    const errors = validateRegisterInput(payload);

    if (errors.length) {
      return res.status(400).json({ errors });
    }

    const existing = await userModel.findByEmail(payload.email);
    if (existing) {
      return res.status(409).json({ message: 'Email already exists.' });
    }

    const hashed = await bcrypt.hash(payload.password, 10);
    const userId = await userModel.createUser({ ...payload, password: hashed });

    return res.status(201).json({
      message: 'User created successfully.',
      user_id: userId
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create user.', error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await userModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    if (user.status !== 'active') {
      return res.status(403).json({ message: 'User account is inactive.' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, full_name: user.full_name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        department: user.department
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Login failed.', error: error.message });
  }
};

module.exports = { registerMember, login };
