const pool = require('../config/database');

class Performance {
  static async findAll() {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(`
        SELECT p.*, s.name as student_name 
        FROM student_performance p
        JOIN students s ON p.student_id = s.id
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
        SELECT p.*, s.name as student_name 
        FROM student_performance p
        JOIN students s ON p.student_id = s.id
        WHERE p.id = ?
      `, [id]);
      return rows[0] || null;
    } finally {
      connection.release();
    }
  }

  static async findByStudentId(studentId) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(
        'SELECT * FROM student_performance WHERE student_id = ? ORDER BY academic_year DESC',
        [studentId]
      );
      return rows;
    } finally {
      connection.release();
    }
  }

  static async create(data) {
    const connection = await pool.getConnection();
    try {
      const { student_id, performance_score, academic_year } = data;
      const [result] = await connection.query(
        'INSERT INTO student_performance (student_id, performance_score, academic_year) VALUES (?, ?, ?)',
        [student_id, performance_score, academic_year]
      );
      return { id: result.insertId, ...data };
    } finally {
      connection.release();
    }
  }

  static async update(id, data) {
    const connection = await pool.getConnection();
    try {
      const { student_id, performance_score, academic_year } = data;
      const [result] = await connection.query(
        'UPDATE student_performance SET student_id = ?, performance_score = ?, academic_year = ? WHERE id = ?',
        [student_id, performance_score, academic_year, id]
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
      const [result] = await connection.query('DELETE FROM student_performance WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } finally {
      connection.release();
    }
  }
}

module.exports = Performance;
