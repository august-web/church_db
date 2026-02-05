const ensureMember = () => {
  const user = getUser();
  if (!user.role || user.role !== 'member') {
    logout();
  }
};

const loadProfile = async () => {
  try {
    const profile = await authFetch('/api/member/profile');
    document.getElementById('profileBox').innerHTML = `
      <p><strong>Name:</strong> ${profile.full_name}</p>
      <p><strong>Email:</strong> ${profile.email}</p>
      <p><strong>Phone:</strong> ${profile.phone}</p>
      <p><strong>Department:</strong> ${profile.department || 'N/A'}</p>
      <p><strong>Status:</strong> ${profile.status}</p>
    `;
  } catch (error) {
    document.getElementById('profileBox').textContent = error.message;
  }
};

ensureMember();
loadProfile();
