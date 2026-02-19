const pool = require('../config/database');
const { hashPassword } = require('../utils/jwt');

async function seedDatabase() {
  let connection;
  try {
    connection = await pool.getConnection();

    console.log('Seeding database with demo data...');

    // Check if users already exist
    const [users] = await connection.query('SELECT COUNT(*) as count FROM users');
    if (users[0].count > 0) {
      console.log('Database already seeded. Skipping...');
      return;
    }

    // Hash passwords
    const hashedTeacherPass = await hashPassword('teacher123');
    const hashedParentPass = await hashPassword('parent123');

    // Insert teacher user
    const [teacherResult] = await connection.query(
      'INSERT INTO users (name, email, password, role, phone, status) VALUES (?, ?, ?, ?, ?, ?)',
      ['John Smith', 'teacher@example.com', hashedTeacherPass, 'teacher', '123-456-7890', 'active']
    );

    // Insert parent user
    const [parentResult] = await connection.query(
      'INSERT INTO users (name, email, password, role, phone, status) VALUES (?, ?, ?, ?, ?, ?)',
      ['Sarah Johnson', 'parent@example.com', hashedParentPass, 'parent', '098-765-4321', 'active']
    );

    // Create teacher profile
    await connection.query(
      'INSERT INTO teachers (user_id, subject, department) VALUES (?, ?, ?)',
      [teacherResult.insertId, 'Mathematics', 'Science']
    );

    // Create parent profile
    await connection.query(
      'INSERT INTO parents (user_id, occupation, address) VALUES (?, ?, ?)',
      [parentResult.insertId, 'Engineer', '123 Main Street, City, State 12345']
    );

    // Insert sample students
    const [student1] = await connection.query(
      'INSERT INTO students (name, email, roll_number, class, parent_id, teacher_id) VALUES (?, ?, ?, ?, ?, ?)',
      ['Alice Smith', 'alice@example.com', 'S001', '10A', parentResult.insertId, teacherResult.insertId]
    );

    const [student2] = await connection.query(
      'INSERT INTO students (name, email, roll_number, class, parent_id, teacher_id) VALUES (?, ?, ?, ?, ?, ?)',
      ['Bob Wilson', 'bob@example.com', 'S002', '10B', parentResult.insertId, teacherResult.insertId]
    );

    // Insert performance records
    await connection.query(
      'INSERT INTO performance (student_id, subject, score, year, semester) VALUES (?, ?, ?, ?, ?)',
      [student1.insertId, 'Mathematics', 95, 2024, 1]
    );

    await connection.query(
      'INSERT INTO performance (student_id, subject, score, year, semester) VALUES (?, ?, ?, ?, ?)',
      [student1.insertId, 'Science', 88, 2024, 1]
    );

    await connection.query(
      'INSERT INTO performance (student_id, subject, score, year, semester) VALUES (?, ?, ?, ?, ?)',
      [student2.insertId, 'Mathematics', 78, 2024, 1]
    );

    // Insert alerts
    await connection.query(
      'INSERT INTO alerts (title, description, status, priority) VALUES (?, ?, ?, ?)',
      ['Parent-Teacher Meeting Scheduled', 'Meeting scheduled for Class 10A on Friday', 'pending', 'high']
    );

    await connection.query(
      'INSERT INTO alerts (title, description, status, priority) VALUES (?, ?, ?, ?)',
      ['Exam Results Published', 'Term 1 results are now available', 'resolved', 'medium']
    );

    console.log('✓ Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error.message);
    // Don't throw - app can continue even if seeding fails
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

module.exports = seedDatabase;
