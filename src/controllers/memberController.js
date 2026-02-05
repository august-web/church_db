const userModel = require('../models/userModel');
const contributionModel = require('../models/contributionModel');
const welfareModel = require('../models/welfareModel');
const { validateWelfareInput } = require('../utils/validators');

const getMyProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch profile.', error: error.message });
  }
};

const getMyContributions = async (req, res) => {
  try {
    const rows = await contributionModel.listByUser(req.user.id);
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch contributions.', error: error.message });
  }
};

const getMyWelfare = async (req, res) => {
  try {
    const rows = await welfareModel.listByUser(req.user.id);
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch welfare records.', error: error.message });
  }
};

const createWelfareRequest = async (req, res) => {
  try {
    const errors = validateWelfareInput(req.body);
    if (errors.length) {
      return res.status(400).json({ errors });
    }

    const requestId = await welfareModel.createRequest({
      user_id: req.user.id,
      request_reason: req.body.request_reason,
      amount: Number(req.body.amount)
    });

    return res.status(201).json({ message: 'Welfare request submitted.', welfare_id: requestId });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create welfare request.', error: error.message });
  }
};

module.exports = { getMyProfile, getMyContributions, getMyWelfare, createWelfareRequest };
