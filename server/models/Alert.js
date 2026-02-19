const pool = require('../config/database');

class Alert {
  static async findAll() {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query('SELECT * FROM alerts ORDER BY created_at DESC');
      return rows;
    } finally {
      connection.release();
    }
  }

  static async findById(id) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query('SELECT * FROM alerts WHERE id = ?', [id]);
      return rows[0] || null;
    } finally {
      connection.release();
    }
  }

  static async findByStatus(status) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(
        'SELECT * FROM alerts WHERE status = ? ORDER BY created_at DESC',
        [status]
      );
      return rows;
    } finally {
      connection.release();
    }
  }

  static async create(data) {
    const connection = await pool.getConnection();
    try {
      const { title, description, status = 'active' } = data;
      const [result] = await connection.query(
        'INSERT INTO alerts (title, description, status) VALUES (?, ?, ?)',
        [title, description, status]
      );
      return { id: result.insertId, ...data, status };
    } finally {
      connection.release();
    }
  }

  static async update(id, data) {
    const connection = await pool.getConnection();
    try {
      const { title, description, status } = data;
      const [result] = await connection.query(
        'UPDATE alerts SET title = ?, description = ?, status = ? WHERE id = ?',
        [title, description, status, id]
      );
      if (result.affectedRows === 0) return null;
      return { id, ...data };
    } finally {
      connection.release();
    }
  }

  static async delete(id) {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.query('DELETE FROM alerts WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } finally {
      connection.release();
    }
  }
}

module.exports = Alert;
