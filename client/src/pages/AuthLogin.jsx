import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { studentAPI } from '../services/api';
import { LogIn, AlertCircle } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, setAuthError } = useAuth();
  const [role, setRole] = useState('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Attempt login with role-based credentials
      const response = await studentAPI.post('/auth/login', {
        email,
        password,
        role
      });

      if (response.data.token) {
        login(response.data.user, response.data.token);
        navigate('/dashboard');
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please try again.';
      setError(message);
      setAuthError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="flex items-center justify-center mb-6">
          <LogIn className="w-8 h-8 text-indigo-600 mr-2" />
          <h1 className="text-3xl font-bold text-gray-800">EduTrack Pro</h1>
        </div>

        <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">Sign In</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Login As
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['admin', 'teacher', 'parent'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`py-2 px-3 rounded-lg font-medium transition-colors ${
                    role === r
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={role === 'admin' ? 'admin@edutrack.com' : 'Enter your email'}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={role === 'admin' ? 'admin123' : 'Enter your password'}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-800 font-semibold mb-2">Demo Credentials:</p>
          <p className="text-xs text-blue-700">
            <strong>Teacher:</strong> teacher@example.com / teacher123
          </p>
          <p className="text-xs text-blue-700">
            <strong>Parent:</strong> parent@example.com / parent123
          </p>
          <p className="text-xs text-blue-700">
            <strong>Admin:</strong> admin@edutrack.com / admin123
          </p>
        </div>

        {/* Sign Up Link */}
        <p className="text-center text-gray-600 text-sm mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-indigo-600 font-semibold hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
