import React from 'react';

function PerformanceTrends() {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Performance Trends</h3>
          <p className="text-gray-500 text-sm">Monthly academic performance data</p>
        </div>
        <div className="flex gap-3">
          <select className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-600 bg-white">
            <option>Academic Year 2023-24</option>
            <option>Academic Year 2024-25</option>
          </select>
          <button className="px-3 py-1 bg-gray-800 text-white rounded text-sm hover:bg-gray-900">
            Support Center
          </button>
        </div>
      </div>

      <svg viewBox="0 0 600 300" className="w-full h-64">
        {/* Grid lines */}
        {[0, 1, 2, 3, 4].map(i => (
          <line key={`grid-${i}`} x1="50" y1={280 - i * 60} x2="580" y2={280 - i * 60} stroke="#f0f0f0" strokeWidth="1" />
        ))}

        {/* Y-axis */}
        <line x1="50" y1="20" x2="50" y2="280" stroke="#ccc" strokeWidth="2" />
        {/* X-axis */}
        <line x1="50" y1="280" x2="580" y2="280" stroke="#ccc" strokeWidth="2" />

        {/* Performance curve */}
        <path
          d="M 50 220 Q 120 200 170 150 T 280 100 T 400 140 T 520 80 T 580 120"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Area under curve */}
        <path
          d="M 50 220 Q 120 200 170 150 T 280 100 T 400 140 T 520 80 T 580 120 L 580 280 L 50 280 Z"
          fill="rgba(59, 130, 246, 0.1)"
        />

        {/* X-axis labels */}
        {['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN'].map((month, i) => (
          <text key={month} x={80 + i * 90} y="300" textAnchor="middle" className="text-xs fill-gray-500">
            {month}
          </text>
        ))}

        {/* Y-axis labels */}
        {[0, 20, 40, 60, 80, 100].map((val) => (
          <text key={`y-${val}`} x="40" y={285 - (val / 100) * 260} textAnchor="end" className="text-xs fill-gray-500">
            {val}
          </text>
        ))}
      </svg>
    </div>
  );
}

export default PerformanceTrends;
