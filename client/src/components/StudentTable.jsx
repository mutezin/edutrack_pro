import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';

function StudentTable({ students, onDelete, onEdit, isLoading }) {
  if (students.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No students found. Add a new student to get started.
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
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Roll No.</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Class</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id} className="border-b hover:bg-gray-50 transition">
              <td className="px-6 py-4 text-sm text-gray-800">{student.name}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{student.email}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{student.roll_number}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{student.class}</td>
              <td className="px-6 py-4 text-sm flex gap-2">
                <button
                  onClick={() => onEdit(student)}
                  disabled={isLoading}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition inline-flex items-center gap-1 disabled:opacity-50"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => onDelete(student.id)}
                  disabled={isLoading === student.id}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition inline-flex items-center gap-1 disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
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

export default StudentTable;
