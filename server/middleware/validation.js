// Validation middleware
const validateStudent = (req, res, next) => {
  const { name, email, roll_number, class: studentClass } = req.body;

  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ error: 'Name is required and must be a non-empty string' });
  }

  if (email && !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  if (roll_number && typeof roll_number !== 'string') {
    return res.status(400).json({ error: 'Roll number must be a string' });
  }

  if (studentClass && typeof studentClass !== 'string') {
    return res.status(400).json({ error: 'Class must be a string' });
  }

  next();
};

const validateTeacher = (req, res, next) => {
  const { name, email, subject, department } = req.body;

  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ error: 'Name is required and must be a non-empty string' });
  }

  if (email && !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  if (subject && typeof subject !== 'string') {
    return res.status(400).json({ error: 'Subject must be a string' });
  }

  if (department && typeof department !== 'string') {
    return res.status(400).json({ error: 'Department must be a string' });
  }

  next();
};

const validatePerformance = (req, res, next) => {
  const { student_id, performance_score, academic_year } = req.body;

  if (!student_id || typeof student_id !== 'number' || student_id <= 0) {
    return res.status(400).json({ error: 'Student ID is required and must be a positive number' });
  }

  if (typeof performance_score !== 'number' || performance_score < 0 || performance_score > 100) {
    return res.status(400).json({ error: 'Performance score must be a number between 0 and 100' });
  }

  if (!academic_year || typeof academic_year !== 'number' || academic_year < 1900) {
    return res.status(400).json({ error: 'Academic year is required and must be a valid year' });
  }

  next();
};

const validateAlert = (req, res, next) => {
  const { title, description, status } = req.body;

  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required and must be a non-empty string' });
  }

  if (description && typeof description !== 'string') {
    return res.status(400).json({ error: 'Description must be a string' });
  }

  if (status && !['active', 'resolved', 'pending'].includes(status)) {
    return res.status(400).json({ error: 'Status must be one of: active, resolved, pending' });
  }

  next();
};

const validateId = (req, res, next) => {
  const { id } = req.params;

  if (!id || isNaN(id) || parseInt(id) <= 0) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  next();
};

module.exports = {
  validateStudent,
  validateTeacher,
  validatePerformance,
  validateAlert,
  validateId
};
