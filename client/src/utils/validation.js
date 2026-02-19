export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateStudent = (data) => {
  const errors = {};

  if (!data.name || data.name.trim() === '') {
    errors.name = 'Name is required';
  }

  if (!data.email || data.email.trim() === '') {
    errors.email = 'Email is required';
  } else if (!validateEmail(data.email)) {
    errors.email = 'Invalid email format';
  }

  if (!data.roll_number || data.roll_number.trim() === '') {
    errors.roll_number = 'Roll number is required';
  }

  if (!data.class || data.class.trim() === '') {
    errors.class = 'Class is required';
  }

  return errors;
};

export const validateTeacher = (data) => {
  const errors = {};

  if (!data.name || data.name.trim() === '') {
    errors.name = 'Name is required';
  }

  if (!data.email || data.email.trim() === '') {
    errors.email = 'Email is required';
  } else if (!validateEmail(data.email)) {
    errors.email = 'Invalid email format';
  }

  if (!data.subject || data.subject.trim() === '') {
    errors.subject = 'Subject is required';
  }

  if (!data.department || data.department.trim() === '') {
    errors.department = 'Department is required';
  }

  return errors;
};

export const validatePerformance = (data) => {
  const errors = {};

  if (!data.student_id) {
    errors.student_id = 'Student ID is required';
  }

  if (!data.performance_score || isNaN(data.performance_score)) {
    errors.performance_score = 'Performance score is required';
  } else if (data.performance_score < 0 || data.performance_score > 100) {
    errors.performance_score = 'Score must be between 0 and 100';
  }

  if (!data.academic_year) {
    errors.academic_year = 'Academic year is required';
  }

  return errors;
};

export const validateAlert = (data) => {
  const errors = {};

  if (!data.title || data.title.trim() === '') {
    errors.title = 'Title is required';
  }

  if (data.status && !['active', 'resolved', 'pending'].includes(data.status)) {
    errors.status = 'Invalid status';
  }

  return errors;
};
