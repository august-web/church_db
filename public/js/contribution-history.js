const loadContributionHistory = async () => {
  const user = getUser();
  if (user.role !== 'member') {
    logout();
    return;
  }

  try {
    const rows = await authFetch('/api/member/contributions');
    document.getElementById('historyTable').innerHTML = rows.map((row) => `
      <tr>
        <td>${row.id}</td>
        <td>${row.type}</td>
        <td>$${Number(row.amount).toFixed(2)}</td>
        <td>${row.date}</td>
        <td>${row.sms_sent ? 'Yes' : 'No'}</td>
      </tr>
    `).join('');
  } catch (error) {
    document.getElementById('historyTable').innerHTML = `<tr><td colspan="5">${error.message}</td></tr>`;
  }
};

loadContributionHistory();
