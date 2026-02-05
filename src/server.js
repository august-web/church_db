const path = require('path');
const express = require('express');
const dotenv = require('dotenv');

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const memberRoutes = require('./routes/memberRoutes');

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/member', memberRoutes);

app.get('/admin', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'views', 'admin-dashboard.html'));
});

app.get('/member', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'views', 'member-dashboard.html'));
});

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'views', 'login.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
