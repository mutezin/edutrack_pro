import React, { useState } from 'react';
import LoginPage from '../components/LoginPage';

function Login({ onLogin }) {
  const handleLogin = (credentials) => {
    onLogin(credentials.email);
  };

  return (
    <div className="flex h-screen bg-gradient-to-r from-blue-50 to-blue-100">
      {/* Left side - Illustration/Design */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 items-center justify-center p-8">
        <div className="text-center">
          <div className="text-white opacity-20 mb-8">
            <svg className="w-32 h-32 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.5 1.5H3.75A2.25 2.25 0 001.5 3.75v12.5A2.25 2.25 0 003.75 18.5h12.5a2.25 2.25 0 002.25-2.25V9.5M10.5 1.5v4.5h4.5M10.5 1.5L15 6" />
            </svg>
          </div>
          <h2 className="text-white text-3xl font-bold mb-4">Welcome to EduTrack Pro</h2>
          <p className="text-blue-100 text-lg">Comprehensive Educational Management System</p>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <LoginPage onLogin={handleLogin} />
      </div>
    </div>
  );
}

export default Login;
