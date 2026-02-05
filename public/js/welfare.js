const msg = document.getElementById('message');

const showMsg = (text, type = 'success') => {
  msg.className = `alert alert-${type}`;
  msg.textContent = text;
  msg.classList.remove('d-none');
};

const loadWelfare = async () => {
  const user = getUser();
  if (user.role !== 'member') {
    logout();
    return;
  }

  try {
    const rows = await authFetch('/api/member/welfare');
    document.getElementById('welfareTable').innerHTML = rows.map((row) => `
      <tr>
        <td>${row.id}</td>
        <td>${row.request_reason}</td>
        <td>$${Number(row.amount).toFixed(2)}</td>
        <td>${row.status}</td>
        <td>${new Date(row.created_at).toLocaleDateString()}</td>
      </tr>
    `).join('');
  } catch (error) {
    showMsg(error.message, 'danger');
  }
};

document.getElementById('welfareForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  try {
    await authFetch('/api/member/welfare', {
      method: 'POST',
      body: JSON.stringify({
        request_reason: document.getElementById('reason').value,
        amount: Number(document.getElementById('amount').value)
      })
    });

    showMsg('Welfare request submitted.');
    event.target.reset();
    loadWelfare();
  } catch (error) {
    showMsg(error.message, 'danger');
  }
});

loadWelfare();
