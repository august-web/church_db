const pool = require('../config/db');

const createRequest = async ({ user_id, request_reason, amount }) => {
  const [result] = await pool.execute(
    `INSERT INTO welfare (user_id, request_reason, amount, status)
     VALUES (?, ?, ?, 'pending')`,
    [user_id, request_reason, amount]
  );
  return result.insertId;
};

const listAll = async () => {
  const [rows] = await pool.execute(
    `SELECT w.id, w.user_id, u.full_name AS member_name, w.request_reason, w.amount,
            w.status, w.approved_by, a.full_name AS approved_by_name, w.created_at
     FROM welfare w
     JOIN users u ON u.id = w.user_id
     LEFT JOIN users a ON a.id = w.approved_by
     ORDER BY w.created_at DESC`
  );
  return rows;
};

const listByUser = async (userId) => {
  const [rows] = await pool.execute(
    `SELECT id, user_id, request_reason, amount, status, approved_by, created_at
     FROM welfare
     WHERE user_id = ?
     ORDER BY created_at DESC`,
    [userId]
  );
  return rows;
};

const updateStatus = async (id, status, approvedBy) => {
  await pool.execute(
    'UPDATE welfare SET status = ?, approved_by = ? WHERE id = ?',
    [status, approvedBy, id]
  );
};

module.exports = { createRequest, listAll, listByUser, updateStatus };
