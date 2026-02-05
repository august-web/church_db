const userModel = require('../models/userModel');
const contributionModel = require('../models/contributionModel');
const welfareModel = require('../models/welfareModel');
const { sendContributionSms } = require('../services/smsService');
const { validateContributionInput } = require('../utils/validators');

const getMembers = async (req, res) => {
  try {
    const members = await userModel.listMembers(req.query.search || '');
    return res.json(members);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch members.', error: error.message });
  }
};

const updateMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, phone, department, status } = req.body;

    if (!full_name || !phone || !['active', 'inactive'].includes(status)) {
      return res.status(400).json({ message: 'full_name, phone, and valid status are required.' });
    }

    await userModel.updateMember(id, { full_name, phone, department, status });
    return res.json({ message: 'Member updated successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update member.', error: error.message });
  }
};

const deactivateMember = async (req, res) => {
  try {
    await userModel.deactivateMember(req.params.id);
    return res.json({ message: 'Member deactivated successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to deactivate member.', error: error.message });
  }
};

const recordContribution = async (req, res) => {
  try {
    const errors = validateContributionInput(req.body);
    if (errors.length) {
      return res.status(400).json({ errors });
    }

    const member = await userModel.findById(req.body.user_id);
    if (!member || member.role !== 'member') {
      return res.status(404).json({ message: 'Member not found.' });
    }

    const contributionId = await contributionModel.createContribution({
      user_id: Number(req.body.user_id),
      type: req.body.type,
      amount: Number(req.body.amount),
      date: req.body.date,
      recorded_by: req.user.id
    });

    sendContributionSms({
      phone: member.phone,
      fullName: member.full_name,
      amount: Number(req.body.amount).toFixed(2),
      type: req.body.type,
      date: req.body.date
    });

    await contributionModel.markSmsSent(contributionId);

    return res.status(201).json({
      message: 'Contribution recorded and SMS simulated successfully.',
      contribution_id: contributionId,
      sms_sent: true
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to record contribution.', error: error.message });
  }
};

const getAllContributions = async (req, res) => {
  try {
    const rows = await contributionModel.listAll();
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load contributions.', error: error.message });
  }
};

const getAllWelfareRequests = async (req, res) => {
  try {
    const rows = await welfareModel.listAll();
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load welfare requests.', error: error.message });
  }
};

const updateWelfareStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' });
    }

    await welfareModel.updateStatus(id, status, req.user.id);
    return res.json({ message: 'Welfare status updated.' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update welfare status.', error: error.message });
  }
};

const reports = async (_req, res) => {
  try {
    const [members, contributions, welfare] = await Promise.all([
      userModel.listMembers(''),
      contributionModel.listAll(),
      welfareModel.listAll()
    ]);

    return res.json({
      totals: {
        members: members.length,
        contributions: contributions.length,
        welfare_requests: welfare.length
      },
      members,
      contributions,
      welfare
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to generate report.', error: error.message });
  }
};

module.exports = {
  getMembers,
  updateMember,
  deactivateMember,
  recordContribution,
  getAllContributions,
  getAllWelfareRequests,
  updateWelfareStatus,
  reports
};
