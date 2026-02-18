import React, { useState } from 'react';
import { Search, Bell, User, LogOut } from 'lucide-react';

function TopBar({ userInfo, onLogout }) {
  const [showProfile, setShowProfile] = useState(false);

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center flex-1 max-w-md">
        <Search className="w-5 h-5 text-gray-400 absolute ml-3" />
        <input
          type="text"
          placeholder="Search for students, teachers or classes..."
          className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-gray-100 rounded-lg transition relative">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
              {userInfo.name.charAt(0)}
            </div>
            <span className="text-sm font-medium text-gray-700">{userInfo.name}</span>
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg p-4 z-50">
              <p className="text-sm text-gray-600 mb-4">{userInfo.email}</p>
              <button
                onClick={() => {
                  onLogout();
                  setShowProfile(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded transition text-sm font-medium"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TopBar;
