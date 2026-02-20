const parentController = require('../controllers/parentController');
const pool = require('../config/database');

jest.mock('../config/database');

describe('Parent Controller', () => {
  let mockConnection;
  let req, res, next;

  beforeEach(() => {
    mockConnection = {
      query: jest.fn(),
      release: jest.fn()
    };
    pool.getConnection = jest.fn().mockResolvedValue(mockConnection);

    req = {
      params: { parentId: 1, childId: 1 }
    };
    res = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis()
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getParentDashboard', () => {
    it('should return parent dashboard data for a valid parent and child', async () => {
      const mockStudent = [{ id: 1, name: 'John Doe', class: '10th', roll_number: '001', parent_id: 1 }];
      const mockAvgScore = [{ avg_score: 85 }];
      const mockTrend = [
        { performance_score: 85, academic_year: 2024, created_at: '2024-01-01' },
        { performance_score: 80, academic_year: 2024, created_at: '2023-12-01' }
      ];
      const mockAlerts = [{ id: 1, title: 'Test Alert', description: 'Test', status: 'active', created_at: '2024-01-01' }];
      const mockUpcoming = [{ cnt: 2 }];

      mockConnection.query
        .mockResolvedValueOnce([mockStudent])
        .mockResolvedValueOnce([mockAvgScore])
        .mockResolvedValueOnce([mockTrend])
        .mockResolvedValueOnce([mockAlerts])
        .mockResolvedValueOnce([mockUpcoming]);

      await parentController.getParentDashboard(req, res, next);

      expect(mockConnection.query).toHaveBeenCalledTimes(5);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          child: expect.objectContaining({ id: 1, name: 'John Doe' }),
          averageScore: 85,
          attendance: 96,
          performanceTrend: expect.any(Array),
          alerts: expect.any(Array)
        })
      );
      expect(mockConnection.release).toHaveBeenCalled();
    });

    it('should return 404 if no child found for parent', async () => {
      mockConnection.query.mockResolvedValueOnce([]);

      await parentController.getParentDashboard(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'No child found for this parent' }));
    });

    it('should call next with error on database error', async () => {
      const error = new Error('DB Error');
      mockConnection.query.mockRejectedValueOnce(error);

      await parentController.getParentDashboard(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getChildReport', () => {
    it('should return full child report with performance history', async () => {
      const mockStudent = [{ id: 1, name: 'John Doe', class: '10th', roll_number: '001', parent_id: 1 }];
      const mockAvgScore = [{ avg_score: 85 }];
      const mockPerformances = [
        { performance_score: 85, academic_year: 2024, created_at: '2024-01-01' },
        { performance_score: 80, academic_year: 2024, created_at: '2023-12-01' }
      ];

      mockConnection.query
        .mockResolvedValueOnce([mockStudent])
        .mockResolvedValueOnce([mockAvgScore])
        .mockResolvedValueOnce([mockPerformances]);

      await parentController.getChildReport(req, res, next);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          child: expect.objectContaining({ id: 1, name: 'John Doe' }),
          averageScore: 85,
          performances: expect.any(Array)
        })
      );
    });

    it('should return 404 if child not found', async () => {
      mockConnection.query.mockResolvedValueOnce([]);

      await parentController.getChildReport(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('getDetailedAnalysis', () => {
    it('should return analysis with trend and recommendations', async () => {
      const mockStudent = [{ id: 1, name: 'John Doe', class: '10th', roll_number: '001', parent_id: 1 }];
      const mockPerformances = [
        { performance_score: 85, created_at: '2024-01-01' },
        { performance_score: 88, created_at: '2023-12-01' },
        { performance_score: 90, created_at: '2023-11-01' },
        { performance_score: 75, created_at: '2023-10-01' },
        { performance_score: 78, created_at: '2023-09-01' },
        { performance_score: 80, created_at: '2023-08-01' }
      ];

      mockConnection.query
        .mockResolvedValueOnce([mockStudent])
        .mockResolvedValueOnce([mockPerformances]);

      await parentController.getDetailedAnalysis(req, res, next);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          child: expect.objectContaining({ id: 1, name: 'John Doe' }),
          avgRecent: expect.any(Number),
          avgPrev: expect.any(Number),
          recommendations: expect.any(Array)
        })
      );
    });

    it('should handle case with no previous performance data', async () => {
      const mockStudent = [{ id: 1, name: 'John Doe', class: '10th', roll_number: '001', parent_id: 1 }];
      const mockPerformances = [{ performance_score: 85, created_at: '2024-01-01' }];

      mockConnection.query
        .mockResolvedValueOnce([mockStudent])
        .mockResolvedValueOnce([mockPerformances]);

      await parentController.getDetailedAnalysis(req, res, next);

      expect(res.json).toHaveBeenCalled();
      const call = res.json.mock.calls[0][0];
      expect(call.avgPrev).toBeNull();
    });
  });
});
