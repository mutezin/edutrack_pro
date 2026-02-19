const pool = require('../config/database');

class User {
  static async findAll() {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query('SELECT id, name, email, role, phone, status, created_at FROM users');
      return rows;
    } finally {
      connection.release();
    }
  }

  static async findById(id) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query('SELECT id, name, email, role, phone, status, created_at FROM users WHERE id = ?', [id]);
      return rows[0] || null;
    } finally {
      connection.release();
    }
  }

  static async findByEmail(email) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
      return rows[0] || null;
    } finally {
      connection.release();
    }
  }

  static async findByRole(role) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query('SELECT id, name, email, role, phone, status, created_at FROM users WHERE role = ?', [role]);
      return rows;
    } finally {
      connection.release();
    }
  }

  static async create(data) {
    const connection = await pool.getConnection();
    try {
      const { name, email, password, role = 'parent', phone } = data;
      const [result] = await connection.query(
        'INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)',
        [name, email, password, role, phone]
      );
      return { id: result.insertId, name, email, role, phone };
    } finally {
      connection.release();
    }
  }

  static async update(id, data) {
    const connection = await pool.getConnection();
    try {
      const { name, email, phone } = data;
      const [result] = await connection.query(
        'UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?',
        [name, email, phone, id]
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
      const [result] = await connection.query('DELETE FROM users WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } finally {
      connection.release();
    }
  }
}

module.exports = User;
