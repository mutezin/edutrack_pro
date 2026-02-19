const User = require('../models/User');
const Teacher = require('../models/TeacherWithAuth');
const Parent = require('../models/Parent');
const { hashPassword, comparePassword, generateToken } = require('../utils/jwt');

// Register new user (Teacher or Parent)
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword, role, phone, subject, department, occupation, address } = req.body;

    // Validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    if (!['teacher', 'parent'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    // Check if email already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      phone
    });

    // Create role-specific profile
    if (role === 'teacher') {
      if (!subject || !department) {
        return res.status(400).json({ message: 'Subject and department required for teachers' });
      }
      await Teacher.create(user.id, { subject, department });
    } else if (role === 'parent') {
      if (!occupation || !address) {
        return res.status(400).json({ message: 'Occupation and address required for parents' });
      }
      await Parent.create(user.id, { occupation, address });
    }

    // Generate token
    const token = generateToken(user);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone
      },
      token
    });
  } catch (error) {
    next(error);
  }
};

// Login user
exports.login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    // Special handling for admin login (role: 'admin')
    if (role === 'admin') {
      // Hardcoded admin credentials - change in production
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@edutrack.com';
      const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

      if (email === adminEmail && password === adminPassword) {
        const adminUser = {
          id: 0,
          name: 'Admin',
          email: adminEmail,
          role: 'admin'
        };
        const token = generateToken(adminUser);
        return res.status(200).json({
          message: 'Admin login successful',
          user: adminUser,
          token
        });
      } else {
        return res.status(401).json({ message: 'Invalid admin credentials' });
      }
    }

    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check role match
    if (role && user.role !== role) {
      return res.status(401).json({ message: `This account is not registered as ${role}` });
    }

    // Compare password
    const passwordMatch = await comparePassword(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken(user);

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone
      },
      token
    });
  } catch (error) {
    next(error);
  }
};

// Logout user
exports.logout = async (req, res, next) => {
  try {
    // Since using JWT, logout is handled on client-side by removing token
    // But we can add token to blacklist in production
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    next(error);
  }
};

// Get current user (protected route)
exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'User retrieved successfully',
      user
    });
  } catch (error) {
    next(error);
  }
};

// Update user profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    const userId = req.user.id;

    // Check if new email is already taken
    if (email) {
      const existingUser = await User.findByEmail(email);
      if (existingUser && existingUser.id !== userId) {
        return res.status(409).json({ message: 'Email already taken' });
      }
    }

    const updatedUser = await User.update(userId, { name, email, phone });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    next(error);
  }
};
