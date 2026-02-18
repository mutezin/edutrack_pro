import React, { useState } from 'react';

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('ADMIN');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      onLogin({ email, password, userType });
    }
  };

  return (
    <div className="w-full md:w-96 bg-white p-8 flex flex-col justify-center">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">📚</span>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-800">EduTrack Pro</h1>
        <p className="text-gray-500 text-sm mt-2">Welcome back, please enter your details</p>
      </div>

      <div className="flex gap-4 mb-6 border-b">
        {['ADMIN', 'TEACHER', 'PARENT'].map(type => (
          <button
            key={type}
            onClick={() => setUserType(type)}
            className={`pb-3 text-sm font-semibold transition ${
              userType === type
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-600 mb-2">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@youremail.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="block text-sm text-gray-600">Password</label>
            <a href="#" className="text-sm text-blue-600 hover:text-blue-700">Forgot?</a>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition mt-6"
        >
          Sign In
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        Need an account? <a href="#" className="text-blue-600 hover:text-blue-700">Contact Support</a>
      </p>

      <p className="text-center text-xs text-gray-400 mt-8">
        © 2024 EDUTRACK PRO ACADEMIC SYSTEM
      </p>
    </div>
  );
}

export default LoginPage;
