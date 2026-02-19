import React, { useState, useEffect } from 'react';
import { alertAPI } from '../services/api';
import { Plus, Trash2 } from 'lucide-react';

function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'active'
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await alertAPI.getAll();
      setAlerts(response.data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      setError('Failed to load alerts');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};

    if (!formData.title || formData.title.trim() === '') errors.title = 'Title is required';
    if (!['active', 'resolved', 'pending'].includes(formData.status)) errors.status = 'Invalid status';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setActionLoading('add');
      const response = await alertAPI.create(formData);
      setAlerts([response.data, ...alerts]);
      setShowForm(false);
      setFormData({ title: '', description: '', status: 'active' });
      setFormErrors({});
      alert('Alert created successfully!');
    } catch (error) {
      console.error('Error creating alert:', error);
      alert(error.response?.data?.error || 'Error creating alert');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        setActionLoading(id);
        await alertAPI.delete(id);
        setAlerts(alerts.filter(a => a.id !== id));
        alert('Alert deleted successfully!');
      } catch (error) {
        console.error('Error deleting:', error);
        alert('Error deleting alert');
      } finally {
        setActionLoading(null);
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const alert = alerts.find(a => a.id === id);
      const response = await alertAPI.update(id, { ...alert, status: newStatus });
      setAlerts(alerts.map(a => a.id === id ? response.data : a));
    } catch (error) {
      console.error('Error updating alert:', error);
      alert('Error updating alert');
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-600">Loading...</div>;

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">System Alerts</h1>
          <p className="text-gray-600 mt-1">Manage system alerts and notifications</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium disabled:opacity-50"
          disabled={actionLoading}
        >
          <Plus className="w-5 h-5" />
          New Alert
        </button>
      </div>

      {error && <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Create Alert</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Alert title"
                className={`w-full px-4 py-2 border rounded-lg ${formErrors.title ? 'border-red-500' : 'border-gray-300'}`}
              />
              {formErrors.title && <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Alert description"
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
            <div className="flex gap-4 justify-end">
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium">
                Cancel
              </button>
              <button type="submit" disabled={actionLoading} className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium disabled:opacity-50">
                Create Alert
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {alerts.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-500">No alerts found</div>
        ) : (
          alerts.map(alert => (
            <div key={alert.id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-800">{alert.title}</h3>
                <span className={`px-2 py-1 text-xs font-semibold rounded ${getStatusColor(alert.status)}`}>
                  {alert.status.toUpperCase()}
                </span>
              </div>
              {alert.description && <p className="text-gray-600 text-sm mb-4">{alert.description}</p>}
              <div className="flex gap-2 justify-end">
                <select
                  value={alert.status}
                  onChange={(e) => handleStatusChange(alert.id, e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded text-sm"
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="resolved">Resolved</option>
                </select>
                <button
                  onClick={() => handleDelete(alert.id)}
                  disabled={actionLoading === alert.id}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm inline-flex items-center gap-1 disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Alerts;
