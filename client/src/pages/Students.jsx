import React, { useState, useEffect } from 'react';
import { studentAPI } from '../services/api';
import StudentForm from '../components/StudentForm';
import StudentTable from '../components/StudentTable';
import { Plus } from 'lucide-react';

function Students() {
  const [students, setStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await studentAPI.getAll();
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
      setError('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (formData) => {
    try {
      setActionLoading('add');
      if (editingId) {
        const response = await studentAPI.update(editingId, formData);
        setStudents(students.map(s => s.id === editingId ? response.data : s));
        setEditingId(null);
        alert('Student updated successfully!');
      } else {
        const response = await studentAPI.create(formData);
        setStudents([...students, response.data]);
        alert('Student added successfully!');
      }
      setShowForm(false);
    } catch (error) {
      console.error('Error saving student:', error);
      alert(error.response?.data?.error || 'Error saving student');
    } finally {
      setActionLoading(null);
    }
  };

  const handleEditStudent = (student) => {
    setEditingId(student.id);
    setShowForm(true);
  };

  const handleDeleteStudent = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        setActionLoading(id);
        await studentAPI.delete(id);
        setStudents(students.filter(s => s.id !== id));
        alert('Student deleted successfully!');
      } catch (error) {
        console.error('Error deleting student:', error);
        alert(error.response?.data?.error || 'Error deleting student');
      } finally {
        setActionLoading(null);
      }
    }
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const editingStudent = editingId ? students.find(s => s.id === editingId) : null;

  if (loading) {
    return <div className="p-8 text-center text-gray-600">Loading students...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Students Management</h1>
          <p className="text-gray-600 mt-1">Manage and track all student information</p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setShowForm(!showForm);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
          disabled={actionLoading}
        >
          <Plus className="w-5 h-5" />
          Add Student
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {showForm && (
        <StudentForm
          initialData={editingStudent}
          onSubmit={handleAddStudent}
          onCancel={() => {
            setShowForm(false);
            setEditingId(null);
          }}
          isLoading={actionLoading === 'add'}
        />
      )}

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">
              All Students ({students.length})
            </h3>
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <StudentTable 
          students={filteredStudents} 
          onDelete={handleDeleteStudent}
          onEdit={handleEditStudent}
          isLoading={actionLoading}
        />
      </div>
    </div>
  );
}

export default Students;
