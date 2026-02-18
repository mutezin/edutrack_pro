import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Reports() {
  const [reportData, setReportData] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    avgPerformance: 0,
    activeAlerts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/dashboard/stats');
      setReportData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching report data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading reports...</div>;
  }

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Reports & Analytics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Total Students</h3>
          <p className="text-4xl font-bold text-blue-600">{reportData.totalStudents}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Total Teachers</h3>
          <p className="text-4xl font-bold text-green-600">{reportData.totalTeachers}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Avg Performance</h3>
          <p className="text-4xl font-bold text-purple-600">{reportData.avgPerformance}%</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Active Alerts</h3>
          <p className="text-4xl font-bold text-red-600">{reportData.activeAlerts}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Performance Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Student Enrollment Rate</span>
              <span className="text-lg font-semibold">95%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '95%' }}></div>
            </div>
          </div>
          <div className="space-y-3 mt-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Teacher Assignment Rate</span>
              <span className="text-lg font-semibold">88%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: '88%' }}></div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Quick Stats</h3>
          <ul className="space-y-3 text-gray-600">
            <li>📚 Active Classes: 12</li>
            <li>👥 Active Users: {reportData.totalStudents + reportData.totalTeachers}</li>
            <li>✅ System Uptime: 99.9%</li>
            <li>⚠️ Pending Actions: 5</li>
            <li>📊 Last Updated: Today</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Reports;
