const pool = require('../config/database');

// Get all students
const getStudents = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM students');
    connection.release();
    res.json(rows);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get student by ID
const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM students WHERE id = ?', [id]);
    connection.release();
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create a new student
const createStudent = async (req, res) => {
  try {
    const { name, email, roll_number, class: studentClass } = req.body;
    const connection = await pool.getConnection();
    
    const result = await connection.query(
      'INSERT INTO students (name, email, roll_number, class) VALUES (?, ?, ?, ?)',
      [name, email, roll_number, studentClass]
    );
    
    connection.release();
    res.status(201).json({ id: result[0].insertId, name, email, roll_number, class: studentClass });
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a student
const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    
    const result = await connection.query('DELETE FROM students WHERE id = ?', [id]);
    connection.release();
    
    if (result[0].affectedRows === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getStudents,
  getStudentById,
  createStudent,
  deleteStudent
};
