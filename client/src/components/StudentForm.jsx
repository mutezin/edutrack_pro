import React from 'react';
import { useState, useEffect } from 'react';
import { validateStudent } from '../utils/validation';

function StudentForm({ onSubmit, onCancel, initialData = null, isLoading = false }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    roll_number: '',
    class: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        roll_number: initialData.roll_number || '',
        class: initialData.class || ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateStudent(formData);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    onSubmit(formData);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">
        {initialData ? 'Edit Student' : 'Add New Student'}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter student name"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter student email"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Roll Number *
            </label>
            <input
              type="text"
              name="roll_number"
              value={formData.roll_number}
              onChange={handleChange}
              placeholder="Enter roll number"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.roll_number ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.roll_number && <p className="text-red-500 text-sm mt-1">{errors.roll_number}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Class *
            </label>
            <input
              type="text"
              name="class"
              value={formData.class}
              onChange={handleChange}
              placeholder="Enter class"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.class ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.class && <p className="text-red-500 text-sm mt-1">{errors.class}</p>}
          </div>
        </div>
        
        <div className="flex gap-4 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium disabled:opacity-50"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : (initialData ? 'Update Student' : 'Add Student')}
          </button>
        </div>
      </form>
    </div>
  );
}

export default StudentForm;
