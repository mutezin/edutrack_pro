const Student = require('../models/Student');

// Get all students
const getStudents = async (req, res, next) => {
  try {
    const students = await Student.findAll();
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    next(error);
  }
};

// Get student by ID
const getStudentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const student = await Student.findById(id);
    
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    console.error('Error fetching student:', error);
    next(error);
  }
};

// Create a new student
const createStudent = async (req, res, next) => {
  try {
    const { name, email, roll_number, class: studentClass } = req.body;
    const student = await Student.create({ name, email, roll_number, class: studentClass });
    res.status(201).json(student);
  } catch (error) {
    console.error('Error creating student:', error);
    next(error);
  }
};

// Update a student
const updateStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, roll_number, class: studentClass } = req.body;
    const student = await Student.update(id, { name, email, roll_number, class: studentClass });
    
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    console.error('Error updating student:', error);
    next(error);
  }
};

// Delete a student
const deleteStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Student.delete(id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    next(error);
  }
};

module.exports = {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
};
