import React, { useState, useEffect } from 'react';
import { performanceAPI, studentAPI } from '../services/api';
import { Plus, Edit2, Trash2 } from 'lucide-react';

function Performance() {
  const [performances, setPerformances] = useState([]);
  const [students, setStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [formData, setFormData] = useState({
    student_id: '',
    performance_score: '',
    academic_year: new Date().getFullYear()
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [perfResponse, studResponse] = await Promise.all([
        performanceAPI.getAll(),
        studentAPI.getAll()
      ]);
      setPerformances(perfResponse.data);
      setStudents(studResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load performance data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};

    if (!formData.student_id) errors.student_id = 'Student is required';
    if (!formData.performance_score || formData.performance_score < 0 || formData.performance_score > 100) {
      errors.performance_score = 'Score must be between 0 and 100';
    }
    if (!formData.academic_year) errors.academic_year = 'Academic year is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setActionLoading('add');
      const response = await performanceAPI.create(formData);
      setPerformances([...performances, response.data]);
      setShowForm(false);
      setFormData({ student_id: '', performance_score: '', academic_year: new Date().getFullYear() });
      setFormErrors({});
      alert('Performance record added successfully!');
    } catch (error) {
      console.error('Error adding performance:', error);
      alert(error.response?.data?.error || 'Error adding performance record');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        setActionLoading(id);
        await performanceAPI.delete(id);
        setPerformances(performances.filter(p => p.id !== id));
        alert('Performance record deleted successfully!');
      } catch (error) {
        console.error('Error deleting:', error);
        alert('Error deleting performance record');
      } finally {
        setActionLoading(null);
      }
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-600">Loading...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Student Performance</h1>
          <p className="text-gray-600 mt-1">Track and manage student performance scores</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium disabled:opacity-50"
          disabled={actionLoading}
        >
          <Plus className="w-5 h-5" />
          Add Performance
        </button>
      </div>

      {error && <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Add Performance Record</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student *</label>
                <select
                  value={formData.student_id}
                  onChange={(e) => setFormData({...formData, student_id: e.target.value})}
                  className={`w-full px-4 py-2 border rounded-lg ${formErrors.student_id ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Select a student</option>
                  {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                {formErrors.student_id && <p className="text-red-500 text-sm mt-1">{formErrors.student_id}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Score (0-100) *</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.performance_score}
                  onChange={(e) => setFormData({...formData, performance_score: e.target.value})}
                  className={`w-full px-4 py-2 border rounded-lg ${formErrors.performance_score ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Score"
                />
                {formErrors.performance_score && <p className="text-red-500 text-sm mt-1">{formErrors.performance_score}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year *</label>
                <input
                  type="number"
                  value={formData.academic_year}
                  onChange={(e) => setFormData({...formData, academic_year: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div className="flex gap-4 justify-end">
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium">
                Cancel
              </button>
              <button type="submit" disabled={actionLoading} className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium disabled:opacity-50">
                Add Record
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Student</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Score</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Year</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {performances.length === 0 ? (
              <tr><td colSpan="4" className="px-6 py-4 text-center text-gray-500">No records found</td></tr>
            ) : (
              performances.map(p => (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-800">{p.student_name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{p.performance_score}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{p.academic_year}</td>
                  <td className="px-6 py-4 text-sm">
                    <button onClick={() => handleDelete(p.id)} disabled={actionLoading === p.id} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition flex items-center gap-1 disabled:opacity-50">
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Performance;
