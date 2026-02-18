import React from 'react';

function TeacherTable({ teachers, onDelete }) {
  if (teachers.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No teachers found. Add a new teacher to get started.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-white rounded-lg overflow-hidden shadow">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Subject</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Department</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
          </tr>
        </thead>
        <tbody>
          {teachers.map((teacher) => (
            <tr key={teacher.id} className="border-b hover:bg-gray-50 transition">
              <td className="px-6 py-4 text-sm text-gray-800">{teacher.name}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{teacher.email}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{teacher.subject}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{teacher.department}</td>
              <td className="px-6 py-4 text-sm">
                <button
                  onClick={() => onDelete(teacher.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TeacherTable;
