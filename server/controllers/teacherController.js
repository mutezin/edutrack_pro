const Teacher = require('../models/Teacher');

// Get all teachers
const getTeachers = async (req, res, next) => {
  try {
    const teachers = await Teacher.findAll();
    res.json(teachers);
  } catch (error) {
    console.error('Error fetching teachers:', error);
    next(error);
  }
};

// Get teacher by ID
const getTeacherById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findById(id);
    
    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }
    res.json(teacher);
  } catch (error) {
    console.error('Error fetching teacher:', error);
    next(error);
  }
};

// Create a new teacher
const createTeacher = async (req, res, next) => {
  try {
    const { name, email, subject, department } = req.body;
    const teacher = await Teacher.create({ name, email, subject, department });
    res.status(201).json(teacher);
  } catch (error) {
    console.error('Error creating teacher:', error);
    next(error);
  }
};

// Update a teacher
const updateTeacher = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, subject, department } = req.body;
    const teacher = await Teacher.update(id, { name, email, subject, department });
    
    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }
    res.json(teacher);
  } catch (error) {
    console.error('Error updating teacher:', error);
    next(error);
  }
};

// Delete a teacher
const deleteTeacher = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Teacher.delete(id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Teacher not found' });
    }
    res.json({ message: 'Teacher deleted successfully' });
  } catch (error) {
    console.error('Error deleting teacher:', error);
    next(error);
  }
};

module.exports = {
  getTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher
};
