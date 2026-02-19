const pool = require('../config/database');

// Get dashboard statistics
const getDashboardStats = async (req, res, next) => {
  try {
    const connection = await pool.getConnection();
    
    const [studentsResult] = await connection.query('SELECT COUNT(*) as count FROM students');
    const [teachersResult] = await connection.query('SELECT COUNT(*) as count FROM teachers');
    const [alertsResult] = await connection.query('SELECT COUNT(*) as count FROM alerts WHERE status = "pending"');
    const [performanceResult] = await connection.query('SELECT AVG(score) as avg FROM performance');
    
    connection.release();

    res.json({
      totalStudents: studentsResult[0].count,
      totalTeachers: teachersResult[0].count,
      activeAlerts: alertsResult[0].count,
      avgPerformance: Math.round(performanceResult[0].avg || 0)
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    next(error);
  }
};

module.exports = {
  getDashboardStats
};
