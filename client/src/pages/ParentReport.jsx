import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { parentAPI } from '../services/api';
import { Download, Mail, Print, ArrowLeft } from 'lucide-react';

function ParentReport() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const childId = searchParams.get('childId');
  const [report, setReport] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.id) return;
    if (!childId) {
      setError('No child selected');
      setLoading(false);
      return;
    }
    fetchReport();
  }, [user, childId]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const res = await parentAPI.getChildReport(user.id, childId);
      setReport(res.data);
      // also fetch analysis
      const ares = await parentAPI.getDetailedAnalysis(user.id, childId);
      setAnalysis(ares.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load report');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    if (!report) return;
    const rows = [
      ['Name', 'Class', 'Roll Number', 'Average Score'],
      [report.child.name, report.child.class, report.child.roll_number, report.averageScore],
      [],
      ['Date', 'Academic Year', 'Score'],
      ...report.performances.map(p => [
        new Date(p.created_at).toLocaleDateString(),
        p.academic_year,
        p.performance_score
      ])
    ];
    const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report_${report.child.name}_${new Date().getTime()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleEmailReport = async () => {
    if (!report) return;
    // In a real app, this would call a backend endpoint to send email
    // For now, show a placeholder message
    alert(`Email report for ${report.child.name} would be sent to the parent's registered email address.`);
  };

  if (loading) return <div className="p-8">Loading report...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!report) return null;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg"
            title="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold">Full Report — {report.child.name}</h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 flex items-center gap-2"
          >
            <Print className="w-4 h-4" />
            Print
          </button>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={handleEmailReport}
            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 flex items-center gap-2"
          >
            <Mail className="w-4 h-4" />
            Email Report
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h2 className="font-semibold text-lg mb-4">Summary</h2>
        <div className="mt-2 grid grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded">
            <div className="text-xs text-gray-500">Average Score</div>
            <div className="text-lg font-bold">{report.averageScore}%</div>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <div className="text-xs text-gray-500">Class</div>
            <div className="text-lg font-bold">{report.child.class}</div>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <div className="text-xs text-gray-500">Roll</div>
            <div className="text-lg font-bold">{report.child.roll_number}</div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-medium text-lg mb-3">Performance History</h3>
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left border-b bg-gray-50">
                <th className="py-2 px-4">Date</th>
                <th className="py-2 px-4">Academic Year</th>
                <th className="py-2 px-4">Score</th>
              </tr>
            </thead>
            <tbody>
              {report.performances.map((p, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{new Date(p.created_at).toLocaleDateString()}</td>
                  <td className="py-2 px-4">{p.academic_year}</td>
                  <td className="py-2 px-4 font-medium">{p.performance_score}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {analysis && (
          <div className="mt-6 border-t pt-6">
            <h3 className="font-medium text-lg mb-3">Analysis & Recommendations</h3>
            <div className="text-sm text-gray-700 space-y-2">
              <p><strong>Recent Average (last 3 assessments):</strong> {analysis.avgRecent ?? 'N/A'}</p>
              <p><strong>Previous Average (3 assessments before):</strong> {analysis.avgPrev ?? 'N/A'}</p>
              <p>
                <strong>Trend:</strong> {' '}
                {analysis.trend != null ? (
                  <span className={analysis.trend > 0 ? 'text-green-600' : analysis.trend < 0 ? 'text-red-600' : 'text-gray-600'}>
                    {analysis.trend > 0 ? '+' : ''}{analysis.trend}%
                  </span>
                ) : (
                  'N/A'
                )}
              </p>
              <div className="mt-3">
                <strong>Recommendations:</strong>
                <ul className="list-disc ml-5 mt-1">
                  {analysis.recommendations.map((r, idx) => (
                    <li key={idx}>{r}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ParentReport;
