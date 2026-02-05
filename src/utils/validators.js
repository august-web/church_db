const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value || '');
const isPhone = (value) => /^[+\d\-()\s]{7,25}$/.test(value || '');

const validateRegisterInput = (payload) => {
  const errors = [];

  if (!payload.full_name || payload.full_name.trim().length < 2) {
    errors.push('Full name is required and must be at least 2 characters.');
  }

  if (!isEmail(payload.email)) {
    errors.push('A valid email address is required.');
  }

  if (!isPhone(payload.phone)) {
    errors.push('A valid phone number is required.');
  }

  if (!payload.password || payload.password.length < 8) {
    errors.push('Password is required and must be at least 8 characters.');
  }

  if (!['admin', 'member'].includes(payload.role)) {
    errors.push('Role must be admin or member.');
  }

  return errors;
};

const validateContributionInput = (payload) => {
  const errors = [];

  if (!payload.user_id || Number(payload.user_id) <= 0) {
    errors.push('Valid user_id is required.');
  }

  if (!['tithe', 'offering', 'donation'].includes(payload.type)) {
    errors.push('Type must be tithe, offering, or donation.');
  }

  if (!payload.amount || Number(payload.amount) <= 0) {
    errors.push('Amount must be a positive number.');
  }

  if (!payload.date || Number.isNaN(Date.parse(payload.date))) {
    errors.push('A valid date is required.');
  }

  return errors;
};

const validateWelfareInput = (payload) => {
  const errors = [];

  if (!payload.request_reason || payload.request_reason.trim().length < 5) {
    errors.push('Request reason is required and should be descriptive.');
  }

  if (!payload.amount || Number(payload.amount) <= 0) {
    errors.push('Amount must be a positive number.');
  }

  return errors;
};

module.exports = {
  validateRegisterInput,
  validateContributionInput,
  validateWelfareInput
};
