const pool = require('../config/database');

async function initializeDatabase() {
  let connection;
  try {
    connection = await pool.getConnection();

    console.log('Initializing database tables...');

    // Create Users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'teacher', 'parent') NOT NULL DEFAULT 'parent',
        phone VARCHAR(20),
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Users table created');

    // Create Auth Tokens table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS auth_tokens (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        token VARCHAR(500) NOT NULL,
        expires_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_token (token),
        INDEX idx_user_id (user_id)
      )
    `);
    console.log('✓ Auth tokens table created');

    // Create Students table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS students (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100),
        roll_number VARCHAR(50),
        class VARCHAR(50),
        parent_id INT,
        teacher_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (parent_id) REFERENCES users(id) ON DELETE SET NULL,
        FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `);
    console.log('✓ Students table created');

    // Create Teachers table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS teachers (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL UNIQUE,
        subject VARCHAR(100),
        department VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('✓ Teachers table created');

    // Create Parents table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS parents (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL UNIQUE,
        occupation VARCHAR(100),
        address VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('✓ Parents table created');

    // Create Performance table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS performance (
        id INT PRIMARY KEY AUTO_INCREMENT,
        student_id INT NOT NULL,
        subject VARCHAR(100),
        score INT,
        year INT,
        semester INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
      )
    `);
    console.log('✓ Performance table created');

    // Create Alerts table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS alerts (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        priority VARCHAR(50) DEFAULT 'medium',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Alerts table created');

    // Create indexes (wrap in try-catch to handle missing columns)
    try {
      await connection.query('CREATE INDEX IF NOT EXISTS idx_user_email ON users(email)');
      await connection.query('CREATE INDEX IF NOT EXISTS idx_user_role ON users(role)');
      await connection.query('CREATE INDEX IF NOT EXISTS idx_student_parent ON students(parent_id)');
      await connection.query('CREATE INDEX IF NOT EXISTS idx_student_teacher ON students(teacher_id)');
      await connection.query('CREATE INDEX IF NOT EXISTS idx_performance_student ON performance(student_id)');
      await connection.query('CREATE INDEX IF NOT EXISTS idx_alert_status ON alerts(status)');
      console.log('✓ Indexes created');
    } catch (indexError) {
      // Indexes may fail if columns don't exist, but that's OK
      console.log('⚠ Some indexes skipped (non-critical)');
    }

    console.log('✓ Database initialization completed successfully!');
  } catch (error) {
    console.error('Error initializing database:', error.message);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

module.exports = initializeDatabase;
