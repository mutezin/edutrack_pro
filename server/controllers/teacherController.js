const pool = require('../config/database');

// Get all teachers
const getTeachers = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM teachers');
    connection.release();
    res.json(rows);
  } catch (error) {
    console.error('Error fetching teachers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get teacher by ID
const getTeacherById = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM teachers WHERE id = ?', [id]);
    connection.release();
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Teacher not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching teacher:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create a new teacher
const createTeacher = async (req, res) => {
  try {
    const { name, email, subject, department } = req.body;
    const connection = await pool.getConnection();
    
    const result = await connection.query(
      'INSERT INTO teachers (name, email, subject, department) VALUES (?, ?, ?, ?)',
      [name, email, subject, department]
    );
    
    connection.release();
    res.status(201).json({ id: result[0].insertId, name, email, subject, department });
  } catch (error) {
    console.error('Error creating teacher:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a teacher
const deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    
    const result = await connection.query('DELETE FROM teachers WHERE id = ?', [id]);
    connection.release();
    
    if (result[0].affectedRows === 0) {
      return res.status(404).json({ error: 'Teacher not found' });
    }
    res.json({ message: 'Teacher deleted successfully' });
  } catch (error) {
    console.error('Error deleting teacher:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getTeachers,
  getTeacherById,
  createTeacher,
  deleteTeacher
};
