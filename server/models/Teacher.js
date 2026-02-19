const pool = require('../config/database');

class Teacher {
  static async findAll() {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query('SELECT * FROM teachers');
      return rows;
    } finally {
      connection.release();
    }
  }

  static async findById(id) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query('SELECT * FROM teachers WHERE id = ?', [id]);
      return rows[0] || null;
    } finally {
      connection.release();
    }
  }

  static async create(data) {
    const connection = await pool.getConnection();
    try {
      const { name, email, subject, department } = data;
      const [result] = await connection.query(
        'INSERT INTO teachers (name, email, subject, department) VALUES (?, ?, ?, ?)',
        [name, email, subject, department]
      );
      return { id: result.insertId, ...data };
    } finally {
      connection.release();
    }
  }

  static async update(id, data) {
    const connection = await pool.getConnection();
    try {
      const { name, email, subject, department } = data;
      const [result] = await connection.query(
        'UPDATE teachers SET name = ?, email = ?, subject = ?, department = ? WHERE id = ?',
        [name, email, subject, department, id]
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
      const [result] = await connection.query('DELETE FROM teachers WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } finally {
      connection.release();
    }
  }
}

module.exports = Teacher;
