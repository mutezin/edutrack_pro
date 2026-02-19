const pool = require('../config/database');

class Parent {
  static async findAll() {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(`
        SELECT p.id, u.name, u.email, u.phone, p.occupation, p.address, u.status, p.created_at
        FROM parents p
        JOIN users u ON p.user_id = u.id
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
        SELECT p.id, p.user_id, u.name, u.email, u.phone, p.occupation, p.address, u.status, p.created_at
        FROM parents p
        JOIN users u ON p.user_id = u.id
        WHERE p.id = ?
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
        SELECT p.id, p.user_id, u.name, u.email, u.phone, p.occupation, p.address, u.status, p.created_at
        FROM parents p
        JOIN users u ON p.user_id = u.id
        WHERE p.user_id = ?
      `, [userId]);
      return rows[0] || null;
    } finally {
      connection.release();
    }
  }

  static async create(userId, data) {
    const connection = await pool.getConnection();
    try {
      const { occupation, address } = data;
      const [result] = await connection.query(
        'INSERT INTO parents (user_id, occupation, address) VALUES (?, ?, ?)',
        [userId, occupation, address]
      );
      return { id: result.insertId, user_id: userId, occupation, address };
    } finally {
      connection.release();
    }
  }

  static async update(id, data) {
    const connection = await pool.getConnection();
    try {
      const { occupation, address } = data;
      const [result] = await connection.query(
        'UPDATE parents SET occupation = ?, address = ? WHERE id = ?',
        [occupation, address, id]
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
      const [result] = await connection.query('DELETE FROM parents WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } finally {
      connection.release();
    }
  }
}

module.exports = Parent;
