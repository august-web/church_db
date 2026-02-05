const pool = require('../config/db');

const createUser = async ({ full_name, email, phone, password, role, department }) => {
  const [result] = await pool.execute(
    `INSERT INTO users (full_name, email, phone, password, role, department, status)
     VALUES (?, ?, ?, ?, ?, ?, 'active')`,
    [full_name, email, phone, password, role, department || null]
  );

  return result.insertId;
};

const findByEmail = async (email) => {
  const [rows] = await pool.execute('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
  return rows[0];
};

const findById = async (id) => {
  const [rows] = await pool.execute(
    'SELECT id, full_name, email, phone, role, department, status, created_at FROM users WHERE id = ? LIMIT 1',
    [id]
  );
  return rows[0];
};

const listMembers = async (search = '') => {
  const likeTerm = `%${search}%`;
  const [rows] = await pool.execute(
    `SELECT id, full_name, email, phone, role, department, status, created_at
     FROM users
     WHERE role = 'member'
       AND (full_name LIKE ? OR email LIKE ? OR phone LIKE ?)
     ORDER BY created_at DESC`,
    [likeTerm, likeTerm, likeTerm]
  );
  return rows;
};

const updateMember = async (id, { full_name, phone, department, status }) => {
  await pool.execute(
    `UPDATE users
     SET full_name = ?, phone = ?, department = ?, status = ?
     WHERE id = ? AND role = 'member'`,
    [full_name, phone, department || null, status, id]
  );
};

const deactivateMember = async (id) => {
  await pool.execute(
    `UPDATE users SET status = 'inactive' WHERE id = ? AND role = 'member'`,
    [id]
  );
};

module.exports = {
  createUser,
  findByEmail,
  findById,
  listMembers,
  updateMember,
  deactivateMember
};
