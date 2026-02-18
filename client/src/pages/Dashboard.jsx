import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StatCard from '../components/StatCard';
import PerformanceTrends from '../components/PerformanceTrends';
import SystemFeed from '../components/SystemFeed';
import { BarChart3, Users, AlertCircle, TrendingUp } from 'lucide-react';

function Dashboard() {
  const [stats, setStats] = useState({
    totalStudents: 19480,
    totalTeachers: 842,
    activeAlerts: 12,
    avgPerformance: 88.5
  });
  const [loading, setLoading] = useState(false);

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/dashboard/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1">Welcome back, Alex. Here's a snapshot of the academic health today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={Users}
          label="Total Students"
          value={stats.totalStudents || 0}
          color="bg-blue-100 text-blue-600"
          subtitle="Active students in system"
        />
        <StatCard
          icon={Users}
          label="Total Teachers"
          value={stats.totalTeachers || 0}
          color="bg-purple-100 text-purple-600"
          subtitle="Teaching staff members"
        />
        <StatCard
          icon={AlertCircle}
          label="Active Alerts"
          value={stats.activeAlerts || 0}
          color="bg-red-100 text-red-600"
          subtitle="Pending notifications"
        />
        <StatCard
          icon={TrendingUp}
          label="Avg Performance"
          value={`${stats.avgPerformance || 0}%`}
          color="bg-yellow-100 text-yellow-600"
          subtitle="Overall academic score"
        />
      </div>

      {/* Performance Trends and System Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PerformanceTrends />
        </div>
        <div>
          <SystemFeed />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
