const form = document.getElementById('loginForm');
const errorBox = document.getElementById('errorBox');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  errorBox.classList.add('d-none');

  try {
    const payload = {
      email: document.getElementById('email').value,
      password: document.getElementById('password').value
    };

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    window.location.href = data.user.role === 'admin' ? '/admin' : '/member';
  } catch (error) {
    errorBox.textContent = error.message;
    errorBox.classList.remove('d-none');
  }
});
