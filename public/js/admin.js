const messageBox = document.getElementById('message');

const showMessage = (text, type = 'success') => {
  messageBox.className = `alert alert-${type}`;
  messageBox.textContent = text;
  messageBox.classList.remove('d-none');
};

const ensureAdmin = () => {
  const user = getUser();
  if (!user.role || user.role !== 'admin') {
    logout();
  }
};

const loadMembers = async (search = '') => {
  try {
    const data = await authFetch(`${API_BASE}/admin/members?search=${encodeURIComponent(search)}`);
    const tbody = document.getElementById('membersTable');
    tbody.innerHTML = data.map((member) => `
      <tr>
        <td>${member.full_name}</td>
        <td>${member.email}</td>
        <td>${member.phone}</td>
        <td>${member.department || ''}</td>
        <td>${member.status}</td>
        <td>
          <button class="btn btn-sm btn-outline-danger" onclick="deactivateMember(${member.id})">Deactivate</button>
        </td>
      </tr>
    `).join('');
  } catch (error) {
    showMessage(error.message, 'danger');
  }
};

const deactivateMember = async (id) => {
  try {
    await authFetch(`${API_BASE}/admin/members/${id}/deactivate`, { method: 'PATCH' });
    showMessage('Member deactivated.');
    loadMembers(document.getElementById('memberSearch').value);
  } catch (error) {
    showMessage(error.message, 'danger');
  }
};
window.deactivateMember = deactivateMember;

const loadContributions = async () => {
  try {
    const data = await authFetch(`${API_BASE}/admin/contributions`);
    const tbody = document.getElementById('contributionsTable');
    tbody.innerHTML = data.map((row) => `
      <tr>
        <td>${row.id}</td>
        <td>${row.member_name}</td>
        <td>${row.type}</td>
        <td>$${Number(row.amount).toFixed(2)}</td>
        <td>${row.date}</td>
        <td>${row.sms_sent ? 'Yes' : 'No'}</td>
      </tr>
    `).join('');
  } catch (error) {
    showMessage(error.message, 'danger');
  }
};

const updateWelfareStatus = async (id, status) => {
  try {
    await authFetch(`${API_BASE}/admin/welfare/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
    showMessage('Welfare request updated.');
    loadWelfare();
  } catch (error) {
    showMessage(error.message, 'danger');
  }
};
window.updateWelfareStatus = updateWelfareStatus;

const loadWelfare = async () => {
  try {
    const data = await authFetch(`${API_BASE}/admin/welfare`);
    const tbody = document.getElementById('welfareTable');
    tbody.innerHTML = data.map((row) => `
      <tr>
        <td>${row.id}</td>
        <td>${row.member_name}</td>
        <td>${row.request_reason}</td>
        <td>$${Number(row.amount).toFixed(2)}</td>
        <td>${row.status}</td>
        <td>
          <button class="btn btn-sm btn-outline-success" onclick="updateWelfareStatus(${row.id}, 'approved')">Approve</button>
          <button class="btn btn-sm btn-outline-danger" onclick="updateWelfareStatus(${row.id}, 'rejected')">Reject</button>
        </td>
      </tr>
    `).join('');
  } catch (error) {
    showMessage(error.message, 'danger');
  }
};

document.getElementById('registerMemberForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  try {
    const payload = {
      full_name: document.getElementById('full_name').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      department: document.getElementById('department').value,
      password: document.getElementById('password').value,
      role: 'member'
    };

    await authFetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    showMessage('Member created successfully.');
    event.target.reset();
    loadMembers();
  } catch (error) {
    showMessage(error.message, 'danger');
  }
});

document.getElementById('contributionForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  try {
    const payload = {
      user_id: Number(document.getElementById('memberId').value),
      type: document.getElementById('contributionType').value,
      amount: Number(document.getElementById('amount').value),
      date: document.getElementById('contributionDate').value
    };

    await authFetch(`${API_BASE}/admin/contributions`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    showMessage('Contribution recorded and SMS simulated.');
    event.target.reset();
    loadContributions();
  } catch (error) {
    showMessage(error.message, 'danger');
  }
});

document.getElementById('searchBtn').addEventListener('click', () => {
  loadMembers(document.getElementById('memberSearch').value);
});

ensureAdmin();
loadMembers();
loadContributions();
loadWelfare();
