import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TeacherForm from '../components/TeacherForm';
import TeacherTable from '../components/TeacherTable';
import { Plus } from 'lucide-react';

function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/teachers');
      setTeachers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching teachers:', error);
      setLoading(false);
    }
  };

  const handleAddTeacher = async (formData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/teachers', formData);
      setTeachers([...teachers, response.data]);
      setShowForm(false);
      alert('Teacher added successfully!');
    } catch (error) {
      console.error('Error adding teacher:', error);
      alert('Error adding teacher');
    }
  };

  const handleDeleteTeacher = async (id) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      try {
        await axios.delete(`http://localhost:5000/api/teachers/${id}`);
        setTeachers(teachers.filter(t => t.id !== id));
        alert('Teacher deleted successfully!');
      } catch (error) {
        console.error('Error deleting teacher:', error);
        alert('Error deleting teacher');
      }
    }
  };

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="p-8 text-center text-gray-600">Loading teachers...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Teachers Management</h1>
          <p className="text-gray-600 mt-1">Manage and track all teacher information</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
        >
          <Plus className="w-5 h-5" />
          Add Teacher
        </button>
      </div>

      {showForm && (
        <TeacherForm
          onSubmit={handleAddTeacher}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">
              All Teachers ({teachers.length})
            </h3>
            <input
              type="text"
              placeholder="Search teachers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <TeacherTable teachers={filteredTeachers} onDelete={handleDeleteTeacher} />
      </div>
    </div>
  );
}

export default Teachers;
