import React, { useState, useEffect } from 'react';
import { parentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, CheckCircle, FileText, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function ParentDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState({
    child: null,
    currentGPA: null,
    averageScore: 0,
    attendance: 0,
    performanceTrend: [],
    alerts: [],
    upcomingSubmissionsCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchParentDashboard();
  }, [user?.id]);
  const navigate = useNavigate();

  const fetchParentDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch from /api/parents/:parentId/dashboard
      const response = await parentAPI.getDashboard(user?.id);
      setData(response.data);
    } catch (err) {
      console.error('Error fetching parent dashboard:', err);
      setError('Failed to load parent dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  const child = data.child || { name: 'Student', class: 'N/A' };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1">Academic tracking for your household.</p>
      </div>

      {/* Child Info Card */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <div className="flex items-center gap-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white text-3xl font-bold">
              {child.name.charAt(0).toUpperCase()}
            </div>
          </div>

          {/* Child Info Text */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-800">{child.name}</h2>
            <p className="text-gray-600">Class {child.class} - Roll #{child.roll_number}</p>

            {/* Summary */}
            <div className="mt-4 grid grid-cols-3 gap-6">
              <div>
                <p className="text-xs text-gray-500">Current Performance</p>
                <p className="text-lg font-semibold text-blue-600">{data.averageScore}%</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Attendance</p>
                <p className="text-lg font-semibold text-green-600">{data.attendance}%</p>
              </div>
              <div>
                <button
                  onClick={() => navigate(`/parent/report?childId=${child.id}`)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                >
                  View Full Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Trend - Left (2 cols) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Current Academic Performance</h3>
              <p className="text-gray-500 text-sm">Score progress tracking</p>
            </div>
            <div className="flex gap-3">
              <select className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-600 bg-white">
                <option>This Year</option>
                <option>Last Year</option>
              </select>
            </div>
          </div>

          {/* Line chart placeholder */}
          <svg viewBox="0 0 600 300" className="w-full h-64">
            {/* Grid */}
            {[0, 1, 2, 3, 4].map(i => (
              <line
                key={`grid-${i}`}
                x1="50"
                y1={280 - i * 60}
                x2="580"
                y2={280 - i * 60}
                stroke="#f0f0f0"
                strokeWidth="1"
              />
            ))}

            {/* Axes */}
            <line x1="50" y1="20" x2="50" y2="280" stroke="#ccc" strokeWidth="2" />
            <line x1="50" y1="280" x2="580" y2="280" stroke="#ccc" strokeWidth="2" />

            {/* Performance curve */}
            <path
              d="M 50 200 Q 120 180 170 140 T 280 100 T 400 120 T 520 90 T 580 110"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Area under curve */}
            <path
              d="M 50 200 Q 120 180 170 140 T 280 100 T 400 120 T 520 90 T 580 110 L 580 280 L 50 280 Z"
              fill="rgba(59, 130, 246, 0.1)"
            />

            {/* X-axis labels */}
            {['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN'].map((month, i) => (
              <text
                key={month}
                x={80 + i * 90}
                y="300"
                textAnchor="middle"
                className="text-xs fill-gray-500"
              >
                {month}
              </text>
            ))}

            {/* Y-axis labels */}
            {['0', '20', '40', '60', '80', '100'].map((val, i) => (
              <text
                key={`y-${val}`}
                x="40"
                y={285 - (i * 60)}
                textAnchor="end"
                className="text-xs fill-gray-500"
              >
                {val}%
              </text>
            ))}
          </svg>

          {/* Summary stats */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-xs text-gray-500">Current Score</p>
              <p className="text-xl font-bold text-gray-800">{data.averageScore}%</p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-xs text-gray-500">Last Month</p>
              <p className="text-xl font-bold text-green-600">+3%</p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-xs text-gray-500">Target</p>
              <p className="text-xl font-bold text-gray-800">90%</p>
            </div>
          </div>
        </div>

        {/* Alerts & Activities - Right (1 col) */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Notifications & Alerts</h3>

          {/* Alert summary cards */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <div className="text-sm">
                <p className="font-medium text-red-800">3 Alerts</p>
                <p className="text-xs text-red-600">Pending action</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
              <FileText className="w-5 h-5 text-yellow-600" />
              <div className="text-sm">
                <p className="font-medium text-yellow-800">2 Submissions</p>
                <p className="text-xs text-yellow-600">Due this week</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div className="text-sm">
                <p className="font-medium text-green-800">Assessment Done</p>
                <p className="text-xs text-green-600">All current tests passed</p>
              </div>
            </div>
          </div>

          {/* Alerts ListView */}
          <div className="border-t pt-4">
            <h4 className="font-medium text-gray-800 mb-3">Recent Events</h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {data.alerts && data.alerts.length > 0 ? (
                data.alerts.map(alert => (
                  <div key={alert.id} className="text-sm p-2 hover:bg-gray-50 rounded">
                    <p className="font-medium text-gray-700">{alert.title}</p>
                    <p className="text-xs text-gray-500">{alert.description}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-500">No recent alerts</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <button onClick={() => navigate('/alerts')} className="w-full mt-4 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50">
            View All Alerts
          </button>
        </div>
      </div>
    </div>
  );
}
export default ParentDashboard;
