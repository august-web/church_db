const sendContributionSms = ({ phone, fullName, amount, type, date }) => {
  const message = `SMS MOCK => Hi ${fullName}, we received your ${type} of $${amount} on ${date}. Thank you.`;
  console.log(`[MOCK_SMS] to=${phone} message="${message}"`);
  return true;
};

module.exports = { sendContributionSms };
