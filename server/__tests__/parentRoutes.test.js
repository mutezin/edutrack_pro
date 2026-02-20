const request = require('supertest');
const express = require('express');
const parentRoutes = require('../routes/parentRoutes');
const { authenticate, isParent } = require('../middleware/authMiddleware');

// Mock modules
jest.mock('../controllers/parentController');
jest.mock('../middleware/authMiddleware');

const parentController = require('../controllers/parentController');

describe('Parent Routes', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    // Mock auth middleware to pass through if token is valid
    authenticate.mockImplementation((req, res, next) => {
      const token = req.headers.authorization?.split(' ')[1];
      if (token === 'valid-token') {
        req.user = { id: 1, role: 'parent' };
        next();
      } else {
        res.status(401).json({ message: 'Unauthorized' });
      }
    });

    isParent.mockImplementation((req, res, next) => {
      if (req.user?.role === 'parent') {
        next();
      } else {
        res.status(403).json({ message: 'Forbidden' });
      }
    });

    app.use('/api/parents', parentRoutes);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/parents/:parentId/dashboard', () => {
    it('should return dashboard data with valid token', async () => {
      const mockData = {
        child: { id: 1, name: 'John', class: '10th', roll_number: '001' },
        averageScore: 85,
        attendance: 96,
        performanceTrend: [],
        alerts: [],
        upcomingSubmissionsCount: 2
      };

      parentController.getParentDashboard.mockImplementation((req, res) => {
        res.json(mockData);
      });

      const res = await request(app)
        .get('/api/parents/1/dashboard')
        .set('Authorization', 'Bearer valid-token');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockData);
    });

    it('should return 401 without valid token', async () => {
      const res = await request(app).get('/api/parents/1/dashboard');

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Unauthorized');
    });

    it('should call getParentDashboard controller', async () => {
      parentController.getParentDashboard.mockImplementation((req, res) => {
        res.json({});
      });

      await request(app)
        .get('/api/parents/1/dashboard')
        .set('Authorization', 'Bearer valid-token');

      expect(parentController.getParentDashboard).toHaveBeenCalled();
    });
  });

  describe('GET /api/parents/:parentId/child/:childId/report', () => {
    it('should return child report with valid token', async () => {
      const mockData = {
        child: { id: 1, name: 'John', class: '10th', roll_number: '001' },
        averageScore: 85,
        performances: [{ performance_score: 85, academic_year: 2024, created_at: '2024-01-01' }]
      };

      parentController.getChildReport.mockImplementation((req, res) => {
        res.json(mockData);
      });

      const res = await request(app)
        .get('/api/parents/1/child/1/report')
        .set('Authorization', 'Bearer valid-token');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockData);
    });

    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/parents/1/child/1/report');

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/parents/:parentId/child/:childId/analysis', () => {
    it('should return analysis with valid token', async () => {
      const mockData = {
        child: { id: 1, name: 'John' },
        avgRecent: 85,
        avgPrev: 80,
        trend: 5,
        recommendations: ['Keep working hard!']
      };

      parentController.getDetailedAnalysis.mockImplementation((req, res) => {
        res.json(mockData);
      });

      const res = await request(app)
        .get('/api/parents/1/child/1/analysis')
        .set('Authorization', 'Bearer valid-token');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockData);
    });

    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/parents/1/child/1/analysis');

      expect(res.status).toBe(401);
    });
  });

  describe('Auth Middleware', () => {
    it('should reject requests without Authorization header', async () => {
      const res = await request(app).get('/api/parents/1/dashboard');

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Unauthorized');
    });

    it('should reject requests with invalid token format', async () => {
      const res = await request(app)
        .get('/api/parents/1/dashboard')
        .set('Authorization', 'Bearer invalid-token');

      expect(res.status).toBe(401);
    });
  });
});
