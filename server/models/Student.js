const pool = require('../config/database');

class Student {
  static async findAll() {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query('SELECT * FROM students');
      return rows;
    } finally {
      connection.release();
    }
  }

  static async findById(id) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query('SELECT * FROM students WHERE id = ?', [id]);
      return rows[0] || null;
    } finally {
      connection.release();
    }
  }

  static async create(data) {
    const connection = await pool.getConnection();
    try {
      const { name, email, roll_number, class: studentClass } = data;
      const [result] = await connection.query(
        'INSERT INTO students (name, email, roll_number, class) VALUES (?, ?, ?, ?)',
        [name, email, roll_number, studentClass]
      );
      return { id: result.insertId, ...data };
    } finally {
      connection.release();
    }
  }

  static async update(id, data) {
    const connection = await pool.getConnection();
    try {
      const { name, email, roll_number, class: studentClass } = data;
      const [result] = await connection.query(
        'UPDATE students SET name = ?, email = ?, roll_number = ?, class = ? WHERE id = ?',
        [name, email, roll_number, studentClass, id]
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
      const [result] = await connection.query('DELETE FROM students WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } finally {
      connection.release();
    }
  }
}

module.exports = Student;
