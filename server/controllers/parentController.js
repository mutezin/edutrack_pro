const pool = require('../config/database');

// Parent dashboard: returns child summary, performance trend, alerts
const getParentDashboard = async (req, res, next) => {
  const { parentId } = req.params;
  let connection;
  try {
    connection = await pool.getConnection();

    // Find first child for this parent
    const [students] = await connection.query('SELECT * FROM students WHERE parent_id = ?', [parentId]);
    if (!students || students.length === 0) {
      return res.status(404).json({ error: 'No child found for this parent' });
    }
    const child = students[0];

    // Average score for child
    const [avgRows] = await connection.query(
      'SELECT AVG(performance_score) as avg_score FROM student_performance WHERE student_id = ?',
      [child.id]
    );
    const averageScore = Math.round(avgRows[0].avg_score || 0);

    // Recent performance trend (last 6 records)
    const [trendRows] = await connection.query(
      'SELECT performance_score, academic_year, created_at FROM student_performance WHERE student_id = ? ORDER BY created_at DESC LIMIT 6',
      [child.id]
    );
    const performanceTrend = trendRows.reverse().map(r => ({ score: r.performance_score, academic_year: r.academic_year, date: r.created_at }));

    // Latest alerts (system-wide for now)
    const [alerts] = await connection.query('SELECT id, title, description, status, created_at FROM alerts ORDER BY created_at DESC LIMIT 5');

    // Count upcoming submissions/important items (best-effort)
    const [upcomingRows] = await connection.query("SELECT COUNT(*) as cnt FROM alerts WHERE title LIKE '%submission%' OR status = 'upcoming'");
    const upcomingSubmissionsCount = upcomingRows[0].cnt || 0;

    // Attendance: no attendance table in schema; return a best-effort placeholder
    const attendancePercentage = 96; // placeholder until attendance is tracked

    res.json({
      child: {
        id: child.id,
        name: child.name,
        class: child.class,
        roll_number: child.roll_number
      },
      currentGPA: null,
      averageScore,
      attendance: attendancePercentage,
      performanceTrend,
      alerts,
      upcomingSubmissionsCount
    });
  } catch (error) {
    console.error('Error fetching parent dashboard:', error);
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = {
  getParentDashboard
};

// Get a full child report for a parent's child
const getChildReport = async (req, res, next) => {
  const { parentId, childId } = req.params;
  let connection;
  try {
    connection = await pool.getConnection();

    // Verify child belongs to parent
    const [students] = await connection.query('SELECT * FROM students WHERE id = ? AND parent_id = ?', [childId, parentId]);
    if (!students || students.length === 0) {
      return res.status(404).json({ error: 'Child not found for this parent' });
    }
    const child = students[0];

    // Performance history
    const [performances] = await connection.query(
      'SELECT performance_score, academic_year, created_at FROM student_performance WHERE student_id = ? ORDER BY created_at DESC',
      [child.id]
    );

    // Aggregate stats
    const [avgRows] = await connection.query('SELECT AVG(performance_score) as avg_score FROM student_performance WHERE student_id = ?', [child.id]);
    const averageScore = Math.round(avgRows[0].avg_score || 0);

    // Compose report
    const report = {
      child: {
        id: child.id,
        name: child.name,
        class: child.class,
        roll_number: child.roll_number
      },
      averageScore,
      performances
    };

    res.json(report);
  } catch (error) {
    console.error('Error fetching child report:', error);
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

// Get a simple analysis for the child (recommendations)
const getDetailedAnalysis = async (req, res, next) => {
  const { parentId, childId } = req.params;
  let connection;
  try {
    connection = await pool.getConnection();

    // Verify ownership
    const [students] = await connection.query('SELECT * FROM students WHERE id = ? AND parent_id = ?', [childId, parentId]);
    if (!students || students.length === 0) {
      return res.status(404).json({ error: 'Child not found for this parent' });
    }
    const child = students[0];

    // Compute simple trends: average of last 3 vs previous 3
    const [rows] = await connection.query(
      'SELECT performance_score, created_at FROM student_performance WHERE student_id = ? ORDER BY created_at DESC LIMIT 6',
      [child.id]
    );
    const recent = rows.slice(0, 3).map(r => r.performance_score);
    const prev = rows.slice(3, 6).map(r => r.performance_score);

    const avgRecent = recent.length ? Math.round(recent.reduce((a, b) => a + b, 0) / recent.length) : null;
    const avgPrev = prev.length ? Math.round(prev.reduce((a, b) => a + b, 0) / prev.length) : null;

    const trend = avgRecent != null && avgPrev != null ? (avgRecent - avgPrev) : null;

    const recommendations = [];
    if (trend != null && trend < 0) {
      recommendations.push('Performance has declined recently. Consider scheduling extra tutoring.');
    } else if (trend != null && trend > 0) {
      recommendations.push('Performance is improving—keep encouraging consistent study time.');
    } else {
      recommendations.push('Performance is stable. Continue current routines and monitor upcoming assessments.');
    }

    res.json({ child: { id: child.id, name: child.name }, avgRecent, avgPrev, trend, recommendations });
  } catch (error) {
    console.error('Error fetching detailed analysis:', error);
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = {
  getParentDashboard,
  getChildReport,
  getDetailedAnalysis
};
