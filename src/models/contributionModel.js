const pool = require('../config/db');

const createContribution = async ({ user_id, type, amount, date, recorded_by }) => {
  const [result] = await pool.execute(
    `INSERT INTO contributions (user_id, type, amount, date, recorded_by, sms_sent)
     VALUES (?, ?, ?, ?, ?, false)`,
    [user_id, type, amount, date, recorded_by]
  );

  return result.insertId;
};

const markSmsSent = async (id) => {
  await pool.execute('UPDATE contributions SET sms_sent = true WHERE id = ?', [id]);
};

const listAll = async () => {
  const [rows] = await pool.execute(
    `SELECT c.id, c.user_id, u.full_name AS member_name, c.type, c.amount, c.date,
            c.recorded_by, a.full_name AS recorded_by_name, c.sms_sent, c.created_at
     FROM contributions c
     JOIN users u ON u.id = c.user_id
     JOIN users a ON a.id = c.recorded_by
     ORDER BY c.date DESC, c.created_at DESC`
  );
  return rows;
};

const listByUser = async (userId) => {
  const [rows] = await pool.execute(
    `SELECT id, user_id, type, amount, date, recorded_by, sms_sent, created_at
     FROM contributions
     WHERE user_id = ?
     ORDER BY date DESC, created_at DESC`,
    [userId]
  );
  return rows;
};

module.exports = { createContribution, markSmsSent, listAll, listByUser };
