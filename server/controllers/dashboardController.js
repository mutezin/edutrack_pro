const pool = require('../config/database');

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    
    const [studentsResult] = await connection.query('SELECT COUNT(*) as count FROM students');
    const [teachersResult] = await connection.query('SELECT COUNT(*) as count FROM teachers');
    const [alerts] = await connection.query('SELECT COUNT(*) as count FROM alerts WHERE status = "active"');
    const [performance] = await connection.query('SELECT AVG(performance_score) as avg FROM student_performance');
    
    connection.release();

    res.json({
      totalStudents: studentsResult[0].count,
      totalTeachers: teachersResult[0].count,
      activeAlerts: alerts[0].count,
      avgPerformance: Math.round(performance[0].avg || 0)
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getDashboardStats
};
