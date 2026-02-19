const pool = require('../config/database');

class Teacher {
  static async findAll() {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(`
        SELECT t.id, u.name, u.email, u.phone, t.subject, t.department, u.status, t.created_at
        FROM teachers t
        JOIN users u ON t.user_id = u.id
      `);
      return rows;
    } finally {
      connection.release();
    }
  }

  static async findById(id) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(`
        SELECT t.id, t.user_id, u.name, u.email, u.phone, t.subject, t.department, u.status, t.created_at
        FROM teachers t
        JOIN users u ON t.user_id = u.id
        WHERE t.id = ?
      `, [id]);
      return rows[0] || null;
    } finally {
      connection.release();
    }
  }

  static async findByUserId(userId) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(`
        SELECT t.id, t.user_id, u.name, u.email, u.phone, t.subject, t.department, u.status, t.created_at
        FROM teachers t
        JOIN users u ON t.user_id = u.id
        WHERE t.user_id = ?
      `, [userId]);
      return rows[0] || null;
    } finally {
      connection.release();
    }
  }

  static async create(userId, data) {
    const connection = await pool.getConnection();
    try {
      const { subject, department } = data;
      const [result] = await connection.query(
        'INSERT INTO teachers (user_id, subject, department) VALUES (?, ?, ?)',
        [userId, subject, department]
      );
      return { id: result.insertId, user_id: userId, subject, department };
    } finally {
      connection.release();
    }
  }

  static async update(id, data) {
    const connection = await pool.getConnection();
    try {
      const { subject, department } = data;
      const [result] = await connection.query(
        'UPDATE teachers SET subject = ?, department = ? WHERE id = ?',
        [subject, department, id]
      );
      if (result.affectedRows === 0) return null;
      return await this.findById(id);
    } finally {
      connection.release();
    }
  }

  static async delete(id) {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.query('DELETE FROM teachers WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } finally {
      connection.release();
    }
  }
}

module.exports = Teacher;
