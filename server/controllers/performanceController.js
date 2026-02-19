const Performance = require('../models/Performance');

// Get all performance records
const getPerformances = async (req, res, next) => {
  try {
    const performances = await Performance.findAll();
    res.json(performances);
  } catch (error) {
    console.error('Error fetching performances:', error);
    next(error);
  }
};

// Get performance by ID
const getPerformanceById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const performance = await Performance.findById(id);
    
    if (!performance) {
      return res.status(404).json({ error: 'Performance record not found' });
    }
    res.json(performance);
  } catch (error) {
    console.error('Error fetching performance:', error);
    next(error);
  }
};

// Get performance by student ID
const getPerformanceByStudent = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const performances = await Performance.findByStudentId(studentId);
    res.json(performances);
  } catch (error) {
    console.error('Error fetching student performance:', error);
    next(error);
  }
};

// Create a new performance record
const createPerformance = async (req, res, next) => {
  try {
    const { student_id, performance_score, academic_year } = req.body;
    const performance = await Performance.create({ student_id, performance_score, academic_year });
    res.status(201).json(performance);
  } catch (error) {
    console.error('Error creating performance:', error);
    next(error);
  }
};

// Update a performance record
const updatePerformance = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { student_id, performance_score, academic_year } = req.body;
    const performance = await Performance.update(id, { student_id, performance_score, academic_year });
    
    if (!performance) {
      return res.status(404).json({ error: 'Performance record not found' });
    }
    res.json(performance);
  } catch (error) {
    console.error('Error updating performance:', error);
    next(error);
  }
};

// Delete a performance record
const deletePerformance = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Performance.delete(id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Performance record not found' });
    }
    res.json({ message: 'Performance record deleted successfully' });
  } catch (error) {
    console.error('Error deleting performance:', error);
    next(error);
  }
};

module.exports = {
  getPerformances,
  getPerformanceById,
  getPerformanceByStudent,
  createPerformance,
  updatePerformance,
  deletePerformance
};
